import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from './FormsCadastro.module.css';
import { baseURL }  from '../../api';

const FormsCadastro = () => {

  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [cadastro, setcadastro] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${baseURL}/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const respostaApi = await response.json();
        setcadastro(respostaApi.cadastro); 
      } else {
        console.error('Erro ao enviar dados para o backend');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  const handleFazerLogin = () => {
    navigate('/login');
  };
  
  return (

    // Div geral da página
    <div className="w-screen h-screen flex flex-row bg-[#004E7E]">

      {/* Div geral da logo, fundo azul e mensagem*/}
      <div className="bg-[#004E7E] w-5/12 h-full flex flex-col justify-center items-center ">

        <img src="/Logo-fundo-transparente.png" alt="Logo do FocusMe em fundo transparente" className={`${styles.LogoTransparente}`} />
        <h1 className={`${styles.TextoLogo} text-white font-medium opacity-90 text-center mt-5 `} >
          Bem-vindo ao FocusMe, aqui você pode criar um cronograma semanal de estudos personalizável em instantes!
        </h1>

      </div>


      {/* Div geral campos de resposta, fundo branco*/}
      <div className=" bg-white w-7/12 h-full rounded-l-3xl px-20 py-14 flex flex-col items-center">
        
        <h1 className="flex justify-center text-[#004E7E] font-bold text-4xl">Olá, registre-se</h1>
        <h1 className="flex justify-center text-[#004E7E] font-bold text-4xl mb-7">para começar!</h1>

        <div>

          <form className={`${styles.FormCadastro} flex-col `} onSubmit={handleSubmit(onSubmit)}>

            <div className="flex flex-col">
            
              <label className={`${styles.LabelCadastro}`} >Nome</label>
              <input className={`${styles.InputsCadastro}`}  placeholder="Nome"{...register('nome')} />
            
            </div>

            <div className=" flex flex-col">
            
              <label className={`${styles.LabelCadastro}`}>E-mail</label>
              <input className={`${styles.InputsCadastro}`}  placeholder="E-mail"{...register('email')} />
            
            </div>


            <div className=" flex flex-col">

              <label className={`${styles.LabelCadastro}`}>Senha</label>
              <input className={`${styles.InputsCadastro}`}  type="password" placeholder="Senha"{...register('senha')} />

            </div>

            <div className=" flex flex-col mb-4">

              <label className={`${styles.LabelCadastro}`}>Confirme sua senha</label>
              <input className={`${styles.InputsCadastro}`}  type="password" placeholder="Confirme sua senha"{...register('confirmacao')} />

            </div>

            <div className="flex flex-col gap-1 items-center">


              <button className={`${styles.Botao} hover:opacity-70`} type="submit">Cadastrar</button>


              <button className="text-blue-500 text-sm hover:text-blue-800 hover:underline" data-testid='Fazerlogin' onClick={handleFazerLogin}>Já possui uma conta? Faça login agora</button>
            
            </div>

          </form>
        </div>

      </div>

    </div>














  );
};

export default FormsCadastro;
