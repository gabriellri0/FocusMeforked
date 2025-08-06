import { useForm } from 'react-hook-form';
import './FormsNovoCronograma.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { API_URL } from "../../api.js";

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
      const response = await fetch(`${API_URL}/gerar-cronograma`, {
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
    <form className="Caixa" onSubmit={handleSubmit(onSubmit)}>

      <section className="Grid-dias">
        {diasDaSemana.map((dia) => (
          <details key={dia.chave} className="Caixa-dia">
            <summary>{dia.nome}</summary>

            <div className="Caixa-input">
              <label>Horário disponível:</label>
              <input
                placeholder="Ex: 14h às 16h"
                {...register(`${dia.chave}.horario`)}
              />
            </div>

            <div className="Caixa-input">
              <label>Observações:</label>
              <textarea
                placeholder="Ex: foco em revisão, evitar tarde..."
                {...register(`${dia.chave}.observacoes`)}
              />
            </div>
          </details>
        ))}
      </section>

      {/* O campo de matéria continua como antes */}
      <fieldset className="Caixa-input">
        <label>Matéria para estudar na semana:</label>
        <input
          placeholder="Ex: Matemática"
          {...register('materia')}
        />
      </fieldset>

      <footer className="Caixa-botoes-centralizado">
        <button className="botao" type="submit" disabled={isLoading}>
          {isLoading ? 'Gerando...' : 'Gerar Cronograma'}
        </button>
      </footer>
      
    </form>
  );
};

export default FazerFormulario;