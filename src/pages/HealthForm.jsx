import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/HealthForm.css';

export default function HealthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state?.patientData;

  const [formData, setFormData] = useState({
    tipoAtendimento: '',
    tipoSintoma: '',
    descricaoSintomas: ''
  });

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const tiposAtendimento = [
    'TRIAGEM',
    'CONSULTA',
    'EMERGENCIA',
    'ACOMPANHAMENTO'
  ];

  const tiposSintoma = [
    'DOR',
    'FEBRE',
    'TOSSE',
    'FALTA_DE_AR',
    'NAUSEA',
    'VOMITO',
    'DIARREIA',
    'CONSTIPACAO',
    'TONTURA',
    'CEFALEIA',
    'OUTRO'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.tipoAtendimento) {
      novosErros.tipoAtendimento = 'Tipo de atendimento é obrigatório';
    }

    if (!formData.tipoSintoma) {
      novosErros.tipoSintoma = 'Tipo de sintoma é obrigatório';
    }

    if (!formData.descricaoSintomas.trim()) {
      novosErros.descricaoSintomas = 'Descrição dos sintomas é obrigatória';
    } else if (formData.descricaoSintomas.trim().length < 10) {
      novosErros.descricaoSintomas = 'Descreva seus sintomas com mais detalhes (mínimo 10 caracteres)';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setCarregando(true);

    try {
      const dadosCompletos = {
        tipoAtendimento: formData.tipoAtendimento,
        tipoSintoma: formData.tipoSintoma,
        descricaoSintomas: formData.descricaoSintomas
      };

      // Primeiro, criar a ficha
      const response = await fetch(`http://localhost:8080/pacientes/${patientData.id}/ficha`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCompletos)
      });

      if (response.ok) {
        navigate('/cadastro-concluido', { state: { tipo: 'paciente' } });
      } else {
        setErros({
          geral: 'Erro ao salvar ficha de saúde'
        });
      }
    } catch (erro) {
      setErros({
        geral: 'Erro ao conectar ao servidor'
      });
      console.error('Erro:', erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="health-form-container">
      <div className="health-form-card">
        <div className="health-form-header">
          <Logo />
          <div className="heart-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 35C20 35 4 25 4 16C4 11.6 7.6 8 12 8C14.4 8 16.8 9.2 20 11.4C23.2 9.2 25.6 8 28 8C32.4 8 36 11.6 36 16C36 25 20 35 20 35Z" 
                    fill="#27ae60" stroke="#27ae60" strokeWidth="1.5"/>
            </svg>
          </div>
          <h1>Ficha Inicial de Saúde</h1>
          <p className="health-subtitle">Complete suas informações de saúde para um atendimento mais seguro e eficiente</p>
        </div>

        <form onSubmit={handleSubmit} className="health-form">
          {erros.geral && (
            <div className="erro-geral">
              {erros.geral}
            </div>
          )}

          <div className="form-section">
            <h2>Informações de Atendimento</h2>

            <div className="form-group">
              <label htmlFor="tipoAtendimento">Tipo de Atendimento *</label>
              <select
                id="tipoAtendimento"
                name="tipoAtendimento"
                value={formData.tipoAtendimento}
                onChange={handleChange}
                disabled={carregando}
                className={erros.tipoAtendimento ? 'input-erro' : ''}
              >
                <option value="">Selecione</option>
                {tiposAtendimento.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {erros.tipoAtendimento && (
                <span className="erro-texto">{erros.tipoAtendimento}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="tipoSintoma">Sintoma Principal *</label>
              <select
                id="tipoSintoma"
                name="tipoSintoma"
                value={formData.tipoSintoma}
                onChange={handleChange}
                disabled={carregando}
                className={erros.tipoSintoma ? 'input-erro' : ''}
              >
                <option value="">Selecione</option>
                {tiposSintoma.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {erros.tipoSintoma && (
                <span className="erro-texto">{erros.tipoSintoma}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="descricaoSintomas">Descrição dos Sintomas *</label>
              <textarea
                id="descricaoSintomas"
                name="descricaoSintomas"
                value={formData.descricaoSintomas}
                onChange={handleChange}
                placeholder="Descreva seus sintomas com detalhes (quando começaram, intensidade, etc.)"
                disabled={carregando}
                className={erros.descricaoSintomas ? 'input-erro' : ''}
                rows="5"
              />
              {erros.descricaoSintomas && (
                <span className="erro-texto">{erros.descricaoSintomas}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={carregando}
          >
            {carregando ? 'Salvando...' : 'Concluir Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}