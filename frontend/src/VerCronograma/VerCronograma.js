import './VerCronograma.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { baseURL }  from '../../api';

function VerCronograma() {
  const location = useLocation();
  const { cronograma_output, estudoData } = location.state || {};
  const [salvo, setSalvo] = useState(false);
  const navigate = useNavigate();

  const salvarCronograma = async () => {
    const user_id = localStorage.getItem('user_id');

    if (!user_id) {
      alert('Usuário não autenticado. Faça login novamente.');
      navigate('/login');
      return;
    }

    if (!cronograma_output || !estudoData) {
      alert('Dados do cronograma ou estudo estão ausentes. Gere um novo cronograma.');
      navigate('/gerar');
      return;
    }

    const cronograma_data = {
      nome: `Cronograma - ${estudoData.disciplinas || 'Estudo'}`,
      descricao: cronograma_output,
      user_id: parseInt(user_id),
    };

    console.log('Enviando cronograma:', cronograma_data);

    try {
      const response = await fetch(`${baseURL}/salvar-cronograma`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cronograma_data),
      });

      if (response.ok) {
        const data = await response.json();
        setSalvo(true);
        alert(`Cronograma salvo com sucesso! ID: ${data.id}`);
      } else {
        const erro = await response.json();
        console.error('Erro do backend:', erro);

        const mensagem =
          typeof erro.detail === 'string'
            ? erro.detail
            : JSON.stringify(erro.detail);

        alert(`Erro ao salvar o cronograma: ${mensagem || 'Erro desconhecido'}`);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      alert('Erro ao salvar o cronograma. Verifique sua conexão e tente novamente.');
    }
  };

  if (!cronograma_output || !estudoData) {
    return (
      <div className="Quadro-branco">
        <h1 className="Título">Erro</h1>
        <p>Não foi possível carregar o cronograma. Tente gerar um novo.</p>
        <button className="Botao-salvar" onClick={() => navigate('/gerar')}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="Quadro-branco">
      <h1 className="Título">Seu cronograma de estudos personalizado</h1>

      <div className="Quadro-cronograma">
        <pre>
          <p className="Texto-cronograma">{cronograma_output}</p>
        </pre>
      </div>

      <button
        className="Botao-salvar"
        onClick={salvarCronograma}
        disabled={salvo}
      >
        {salvo ? 'Cronograma Salvo!' : 'Salvar Cronograma'}
      </button>
    </div>
  );
}

export default VerCronograma;
