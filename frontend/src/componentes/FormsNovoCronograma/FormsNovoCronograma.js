import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import style from './FormsNovoCronograma.module.css'
import { baseURL }  from "../api.js";

const FazerFormulario = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    const formattedData = {
      segunda: data.segunda?.horario || '',
      terca: data.terca?.horario || '',
      quarta: data.quarta?.horario || '',
      quinta: data.quinta?.horario || '',
      sexta: data.sexta?.horario || '',
      sabado: data.sabado?.horario || '',
      domingo: data.domingo?.horario || '',
      disciplinas: data.materia || '', 
      observacoes: Object.values(data)
        .filter((value) => value.observacoes)
        .map((value) => value.observacoes)
        .join('; ') || 'Nenhuma observação', 
    };

    try {
      const response = await fetch(`${baseURL}/gerar-cronograma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const respostaApi = await response.json();
        navigate('/chat', { 
          state: { 
            estudoData: formattedData, 
            cronograma_output: respostaApi.cronograma 
          } 
        });

      } else {
        const erro = await response.json();
        alert(`Erro ao gerar cronograma: ${erro.detail || 'Erro desconhecido'}`);
        setIsLoading(false); 
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao gerar cronograma. Tente novamente.');
      setIsLoading(false); 
    }
  };


  const diasDaSemana = [
    { nome: 'Segunda-feira', chave: 'segunda' },
    { nome: 'Terça-feira', chave: 'terca' },
    { nome: 'Quarta-feira', chave: 'quarta' },
    { nome: 'Quinta-feira', chave: 'quinta' },
    { nome: 'Sexta-feira', chave: 'sexta' },
    { nome: 'Sábado', chave: 'sabado' },
    { nome: 'Domingo', chave: 'domingo' },
  ];

  return (
    <div className='py-10 flex justify-center flex-col items-center'>
      <div className={style.Quadro}>
        <div className="bg-[#004E7E] px-10 w-full flex flex-col items-center justify-center rounded-3xl mb-6 py-2">
          <h1 className="text-white font-bold text-3xl align-top mb-2">Crie seu cronograma de estudos personalizado</h1>
          <p className='text-white text-lg'>Preencha as informações de acordo com a sua disponibilidade</p>
        </div>

        <section className={style.Caixa}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <section className={style['Grid-dias']}>
              {diasDaSemana.map((dia) => (
                <details key={dia.chave} className={`${style['Caixa-dia']}`}>
                  <summary className={`${style['Caixa-dia']}`}>{dia.nome}</summary>

                  <div className={style['Caixa-input']}>
                    <label>Horário disponível:</label>
                    <input
                      placeholder="Ex: 14h às 16h"
                      className='text-black px-2 py-1'
                      {...register(`${dia.chave}.horario`)}
                    />
                  </div>

                  <div className={style['Caixa-input']}>
                    <label >Observações:</label>
                    <textarea
                      placeholder="Ex: foco em revisão, evitar horários à tarde..."
                      className='text-black px-2 py-2'
                      {...register(`${dia.chave}.observacoes`)}
                    />
                  </div>
                </details>
              ))}
            </section>

            <fieldset className={style['Caixa-input']}>
              <label className='text-[#004E7E] font-bold text-xl'>Matérias para estudar na semana</label>
              <input
                placeholder="Ex: Matemática, Biologia"
                className='text-black px-2 py-1'
                {...register('materia')}
              />
            </fieldset>

            <footer className={style['Caixa-botoes-centralizado']}>
              <button className={style['botao']} type="submit" disabled={isLoading}>
                {isLoading ? 'Gerando...' : 'Gerar Cronograma'}
              </button>
            </footer>

          </form>
        </section>
      </div>
    </div>
  );
};

export default FazerFormulario;
