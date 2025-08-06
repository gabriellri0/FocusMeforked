
from fastapi import FastAPI, HTTPException, status, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from database.models import User, Cronograma
from database.schemas import UserSchema
from database.database import Base, engine, get_session
from gerar import gerar_resposta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class EstudoInput(BaseModel):
    segunda: str
    terca: str
    quarta: str
    quinta: str
    sexta: str
    sabado: str
    domingo: str
    disciplinas: str
    observacoes: str

class UserInfo(BaseModel):
    nome: str
    email: str
    senha: str
    confirmacao: str

class LoginInput(BaseModel):
    email: str
    senha: str

class CronogramaInput(BaseModel):
    nome: str
    descricao: str
    user_id: int

class ChatInput(BaseModel):
    mensagem: str

# Criar tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Endpoint de cadastro
@app.post("/cadastro")
def cadastro(info: UserInfo, db: Session = Depends(get_session)):
    if info.senha != info.confirmacao:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Senhas diferentes")

    user_email = db.query(User).filter(User.email == info.email).first()
    if user_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email já cadastrado")

    user_nome = db.query(User).filter(User.nome == info.nome).first()
    if user_nome:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nome já cadastrado")

    novo_usuario = User(
        nome=info.nome,
        email=info.email,
        senha=info.senha
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {"email": novo_usuario.email, "mensagem": "Cadastro bem-sucedido"}

# Endpoint de login
@app.post("/login")
def login(info: LoginInput, db: Session = Depends(get_session)):
    usuario = db.query(User).filter(User.email == info.email).first()
    
    if not usuario or usuario.senha != info.senha:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email ou senha incorretos")
    
    return {"id": usuario.id, "email": usuario.email, "mensagem": "Login bem-sucedido"}

# Endpoint para gerar cronograma (sem salvar)
@app.post("/gerar-cronograma")
def gerar_cronograma(estudo: EstudoInput):
    mensagem_inicial = f"""
    O usuário tem os seguintes horários disponíveis para estudar:
    Segunda: {estudo.segunda}
    Terça:  {estudo.terca}
    Quarta:  {estudo.quarta}
    Quinta:  {estudo.quinta}
    Sexta:   {estudo.sexta}
    Sábado:  {estudo.sabado}
    Domingo: {estudo.domingo}

    As disciplinas são: {estudo.disciplinas}
    Observações: {estudo.observacoes}

    Crie um cronograma de estudos personalizado, aproveitando os horários indicados,
    usando a técnica Pomodoro (25 minutos de estudo e pausas),
    e distribua as disciplinas equilibradamente.

    Comece agora às {datetime.now().strftime('%H:%M')}.
    Retorne apenas o cronograma formatado, fácil de entender.
    """

    messages = [{"role": "user", "content": mensagem_inicial}]
    resposta = gerar_resposta(messages)

    return {"cronograma": resposta}

# Endpoint para salvar cronograma
@app.post("/salvar-cronograma")
def salvar_cronograma(cronograma: CronogramaInput, db: Session = Depends(get_session)):
    # Verificar se o usuário existe
    usuario = db.query(User).filter(User.id == cronograma.user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    # Criar e salvar o cronograma
    novo_cronograma = Cronograma(
        nome=cronograma.nome,
        descricao=cronograma.descricao,
        user_id=cronograma.user_id
    )
    db.add(novo_cronograma)
    db.commit()
    db.refresh(novo_cronograma)

    return {"id": novo_cronograma.id, "nome": novo_cronograma.nome, "mensagem": "Cronograma salvo com sucesso"}

# Endpoint para listar cronogramas de um usuário
@app.get("/cronogramas/{user_id}")
def listar_cronogramas(user_id: int, db: Session = Depends(get_session)):
    usuario = db.query(User).filter(User.id == user_id).first()
    if not usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuário não encontrado")

    cronogramas = db.query(Cronograma).filter(Cronograma.user_id == user_id).all()
    return [{"id": cronograma.id, "nome": cronograma.nome, "descricao": cronograma.descricao} for cronograma in cronogramas]

@app.post("/chat")
def conversar(chat_input: ChatInput):
    messages = [{"role": "user", "content": chat_input.mensagem}]

    resposta_ia = gerar_resposta(messages)

    return {"resposta": resposta_ia}
