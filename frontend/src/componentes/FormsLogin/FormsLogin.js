import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from './FormsLogin.module.css';

const FormsLogin = () => {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(null);

  const onSubmit = async (data) => {
  try {
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const respostaApi = await response.json();
      console.log(respostaApi);  // Verifique o que é retornado

      localStorage.setItem("user_id", respostaApi.id); // Salva o user_id no localStorage

      setLoginStatus("sucesso");
      navigate('/novocronograma');
    } else {
      const errorData = await response.json();
      setLoginStatus(errorData.detail || "Erro ao logar.");
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    setLoginStatus("Erro na comunicação com o servidor.");
  }
};


  const handleFazerCadastro = () => {
    navigate('/cadastro');
  };

  const email = watch('email');
  const senha = watch('senha');
  const camposPreenchidos = email && senha;

  return (

   
    <div className="w-screen h-screen flex flex-row bg-[#004E7E]">

      
      <div className={`bg-[#004E7E] w-5/12 h-full flex flex-col justify-center items-center`}>
        <img src="/Logo-fundo-transparente.png" alt="Logo do FocusMe em fundo transparente" className={`${styles.LogoTransparente}`}/>
        <h1 className={`${styles.TextoLogo} text-white font-medium opacity-90 text-center mt-5`}>
          Bem-vindo ao FocusMe, aqui você pode criar um cronograma semanal de estudos personalizável em instantes!
          </h1>
      </div>


      <div className=" bg-white w-7/12 h-full rounded-l-3xl px-20 py-20 flex-col">
        
        <h1 className="flex justify-center text-[#004E7E] font-bold text-4xl mb-5 mt-16">Bem-vindo de volta!</h1>
        

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">

            <div className="flex flex-col">
              <label className={`${styles.LabelLogin}`}>E-mail</label>
              <input
                className={`${styles.InputsLogin}`}
                placeholder="E-mail"
                {...register('email', { required: true })}
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className={`${styles.LabelLogin}`}>Senha</label>
              <input
                className={`${styles.InputsLogin}`}
                type="password"
                placeholder="Senha"
                {...register('senha', { required: true })}
              />
            </div>

            <div className="flex flex-col gap-1 items-center">
              <button
                className={`${styles.Botao} hover:opacity-70`}
                type="submit"
                disabled={!camposPreenchidos}
              >
                Entrar
              </button>

              <button
                type="button"
                className="text-blue-500 text-sm hover:text-blue-800 hover:underline"
                onClick={handleFazerCadastro}
              >
                Primeira vez por aqui? Faça seu cadastro
              </button>

              {loginStatus && (
                <p style={{ marginTop: '10px', color: loginStatus === 'sucesso' ? 'green' : 'red' }}>
                  {loginStatus === 'sucesso' ? 'Login bem-sucedido!' : loginStatus}
                </p>
              )}
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default FormsLogin;
