import pytest
from datetime import time
from main import gerar_cronograma, EstudoInput,app
from fastapi.testclient import TestClient
from pydantic import ValidationError
client = TestClient(app)
from gerar import gerar_resposta

@pytest.fixture
def estudo_input_exemplo():
    return EstudoInput(
        segunda="08:00-10:00",
        terca="14:00-16:00",
        quarta="",
        quinta="",
        sexta="10:00-12:00",
        sabado="",
        domingo="",
        disciplinas= "Matemática, História",
        observacoes="Foco maior em exatas."
    )

def test_gerar_cronograma_contem_horarios_e_disciplinas(estudo_input_exemplo):
    resultado = gerar_cronograma(estudo_input_exemplo)
    cronograma = resultado["cronograma"].lower()  

    horarios = [
        estudo_input_exemplo.segunda,
        estudo_input_exemplo.terca,
        estudo_input_exemplo.sexta,
    ]
    horario_encontrado = any(horario.split('-')[0] in cronograma for horario in horarios if horario)

    
    disciplina_encontrada = any(disciplina.lower() in cronograma for disciplina in estudo_input_exemplo.disciplinas)

    assert horario_encontrado, "Nenhum dos horários apareceu na resposta da IA"
    assert disciplina_encontrada, "Nenhuma das disciplinas apareceu na resposta da IA"



def estudo_input_exemplo_falho():
    return EstudoInput(
        segunda="08:00-10:00",
        terca="14:00-16:00",
        quarta="",
        quinta="",
        sexta="10:00-12:00",
        sabado="",
        domingo="",
        disciplinas= 123,  
        observacoes="Foco maior em exatas."
    )

def test_estudo_input_invalido_erro_de_validacao():
    with pytest.raises(ValidationError):
        estudo_input_exemplo_falho()



def test_cadastro_sucesso():
    response = client.post("/cadastro", json={
        "nome": "Juan",
        "email": "juan@example.com",
        "senha": "123456",
        "confirmacao": "123456"
    })
    assert response.status_code == 200
    assert response.json() == {
        "email": "juan@example.com",
        "mensagem": "Cadastro bem-sucedido"
    }

def test_cadastro_senhas_diferentes():
    response = client.post("/cadastro", json={
        "nome": "Lucas",
        "email": "lucas@example.com",
        "senha": "senha123",
        "confirmacao": "outrasenha"
    })
    assert response.status_code == 401
    assert response.json() == {"detail": "Senhas Diferentes"}

