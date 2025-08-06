import FazerFormulario from '../componentes/FormsNovoCronograma/FormsNovoCronograma';
import './NovoCronograma.css';

function Novo() {
  return (
 <div className="Novo">
  <div className='Caixa-titulo'>
    <h1 className='Tit'>Crie seu cronograma de estudos personalizado</h1>
  </div>
  <div className='Formulario'>
    <h2 className='Horarios'>Insira as informações...</h2>
    <FazerFormulario />
  </div>
</div>

  );
}

export default Novo;
