import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/HealthForm.css';

export default function HealthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const patientData = location.state?.patientData;

  const [formData, setFormData] = useState({
    // Informações de Saúde
    doencaCronica: false,
    doencaCronicaDescricao: '',
    usaMedicamentos: false,
    medicamentos: [''],
    alergiaMedicamentos: false,
    alergiaMedicamentosDescricao: '',
    cirurgia: false,
    cirurgiaDescricao: '',
    tipoSanguineo: '',
    
    // Histórico Familiar
    doencasCardiacas: false,
    diabetes: false,
    hipertensao: false,
    outrasDoencas: '',
    
    // Contato de Emergência
    nomeContato: '',
    parentesco: '',
    telefoneContato: ''
  });

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const tiposSanguineo = ['', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const parentescos = ['Mãe', 'Pai', 'Cônjuge', 'Filho(a)', 'Irmão/Irmã', 'Avó/Avô', 'Tio(a)', 'Outro'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTelefoneChange = (e) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    // Formatar Telefone
    if (name === 'telefoneContato') {
      valorFormatado = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }

    setFormData(prev => ({
      ...prev,
      [name]: valorFormatado
    }));

    if (erros[name]) {
      setErros(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMedicamentoChange = (index, value) => {
    const novosMedicamentos = [...formData.medicamentos];
    novosMedicamentos[index] = value;
    setFormData(prev => ({
      ...prev,
      medicamentos: novosMedicamentos
    }));
  };

  const adicionarMedicamento = () => {
    setFormData(prev => ({
      ...prev,
      medicamentos: [...prev.medicamentos, '']
    }));
  };

  const removerMedicamento = (index) => {
    setFormData(prev => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== index)
    }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (formData.doencaCronica && !formData.doencaCronicaDescricao.trim()) {
      novosErros.doencaCronicaDescricao = 'Descreva a doença crônica';
    }

    if (formData.usaMedicamentos && formData.medicamentos.every(m => !m.trim())) {
      novosErros.medicamentos = 'Adicione pelo menos um medicamento';
    }

    if (formData.alergiaMedicamentos && !formData.alergiaMedicamentosDescricao.trim()) {
      novosErros.alergiaMedicamentosDescricao = 'Descreva a alergia a medicamentos';
    }

    if (formData.cirurgia && !formData.cirurgiaDescricao.trim()) {
      novosErros.cirurgiaDescricao = 'Descreva a(s) cirurgia(s)';
    }

    if (!formData.nomeContato.trim()) {
      novosErros.nomeContato = 'Nome do contato é obrigatório';
    }

    if (!formData.parentesco) {
      novosErros.parentesco = 'Parentesco é obrigatório';
    }

    if (!formData.telefoneContato.trim()) {
      novosErros.telefoneContato = 'Telefone é obrigatório';
    } else if (formData.telefoneContato.replace(/\D/g, '').length !== 11) {
      novosErros.telefoneContato = 'Telefone inválido';
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
        ...patientData,
        fichasSaude: {
          doencaCronica: formData.doencaCronica,
          doencaCronicaDescricao: formData.doencaCronicaDescricao,
          usaMedicamentos: formData.usaMedicamentos,
          medicamentos: formData.medicamentos.filter(m => m.trim()),
          alergiaMedicamentos: formData.alergiaMedicamentos,
          alergiaMedicamentosDescricao: formData.alergiaMedicamentosDescricao,
          cirurgia: formData.cirurgia,
          cirurgiaDescricao: formData.cirurgiaDescricao,
          tipoSanguineo: formData.tipoSanguineo,
          doencasCardiacas: formData.doencasCardiacas,
          diabetes: formData.diabetes,
          hipertensao: formData.hipertensao,
          outrasDoencas: formData.outrasDoencas,
          nomeContato: formData.nomeContato,
          parentesco: formData.parentesco,
          telefoneContato: formData.telefoneContato.replace(/\D/g, '')
        }
      };

      // Adicionar dados à lista de pacientes
      const response = await fetch('/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosCompletos)
      });

      if (response.ok) {
        // Redirecionar para página de sucesso
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

          {/* INFORMAÇÕES DE SAÚDE */}
          <div className="form-section">
            <h2>Informações de Saúde</h2>

            {/* Doença Crônica */}
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="doencaCronica"
                  checked={formData.doencaCronica}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Possui doença crônica?</span>
              </label>
            </div>

            {formData.doencaCronica && (
              <div className="form-group full-width">
                <textarea
                  name="doencaCronicaDescricao"
                  value={formData.doencaCronicaDescricao}
                  onChange={handleChange}
                  placeholder="Descreva quais doenças crônicas você possui"
                  disabled={carregando}
                  className={erros.doencaCronicaDescricao ? 'input-erro' : ''}
                  rows="3"
                />
                {erros.doencaCronicaDescricao && (
                  <span className="erro-texto">{erros.doencaCronicaDescricao}</span>
                )}
              </div>
            )}

            {/* Medicamentos Contínuos */}
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="usaMedicamentos"
                  checked={formData.usaMedicamentos}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Usa medicamentos contínuos?</span>
              </label>
            </div>

            {formData.usaMedicamentos && (
              <div className="form-group-medicamentos">
                {formData.medicamentos.map((medicamento, index) => (
                  <div key={index} className="medicamento-row">
                    <input
                      type="text"
                      value={medicamento}
                      onChange={(e) => handleMedicamentoChange(index, e.target.value)}
                      placeholder="Digite o nome do medicamento"
                      disabled={carregando}
                    />
                    {formData.medicamentos.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove-medicamento"
                        onClick={() => removerMedicamento(index)}
                        disabled={carregando}
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-add-medicamento"
                  onClick={adicionarMedicamento}
                  disabled={carregando}
                >
                  +
                </button>
                {erros.medicamentos && (
                  <span className="erro-texto">{erros.medicamentos}</span>
                )}
              </div>
            )}

            {/* Alergia a Medicamentos */}
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="alergiaMedicamentos"
                  checked={formData.alergiaMedicamentos}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Possui alergia a medicamentos?</span>
              </label>
            </div>

            {formData.alergiaMedicamentos && (
              <div className="form-group full-width">
                <textarea
                  name="alergiaMedicamentosDescricao"
                  value={formData.alergiaMedicamentosDescricao}
                  onChange={handleChange}
                  placeholder="Digite o medicamento que causa alergia"
                  disabled={carregando}
                  className={erros.alergiaMedicamentosDescricao ? 'input-erro' : ''}
                  rows="2"
                />
                {erros.alergiaMedicamentosDescricao && (
                  <span className="erro-texto">{erros.alergiaMedicamentosDescricao}</span>
                )}
              </div>
            )}

            {/* Cirurgia */}
            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="cirurgia"
                  checked={formData.cirurgia}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Já realizou cirurgia?</span>
              </label>
            </div>

            {formData.cirurgia && (
              <div className="form-group full-width">
                <textarea
                  name="cirurgiaDescricao"
                  value={formData.cirurgiaDescricao}
                  onChange={handleChange}
                  placeholder="Descreva quais cirurgias realizou e quando"
                  disabled={carregando}
                  className={erros.cirurgiaDescricao ? 'input-erro' : ''}
                  rows="3"
                />
                {erros.cirurgiaDescricao && (
                  <span className="erro-texto">{erros.cirurgiaDescricao}</span>
                )}
              </div>
            )}

            {/* Tipo Sanguíneo */}
            <div className="form-group">
              <label htmlFor="tipoSanguineo">Tipo sanguíneo</label>
              <select
                id="tipoSanguineo"
                name="tipoSanguineo"
                value={formData.tipoSanguineo}
                onChange={handleChange}
                disabled={carregando}
              >
                {tiposSanguineo.map(tipo => (
                  <option key={tipo} value={tipo}>
                    {tipo || 'Selecione'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* HISTÓRICO FAMILIAR */}
          <div className="form-section">
            <h2>Histórico Familiar</h2>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="doencasCardiacas"
                  checked={formData.doencasCardiacas}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Doenças cardíacas na família</span>
              </label>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="diabetes"
                  checked={formData.diabetes}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Diabetes na família</span>
              </label>
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  name="hipertensao"
                  checked={formData.hipertensao}
                  onChange={handleChange}
                  disabled={carregando}
                />
                <span>Hipertensão na família</span>
              </label>
            </div>

            <div className="form-group full-width">
              <label htmlFor="outrasDoencas">Outras doenças familiares</label>
              <textarea
                id="outrasDoencas"
                name="outrasDoencas"
                value={formData.outrasDoencas}
                onChange={handleChange}
                placeholder="Descreva outras doenças presentes na família"
                disabled={carregando}
                rows="3"
              />
            </div>
          </div>

          {/* CONTATO DE EMERGÊNCIA */}
          <div className="form-section">
            <h2>Contato de Emergência</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nomeContato">Nome do contato *</label>
                <input
                  type="text"
                  id="nomeContato"
                  name="nomeContato"
                  value={formData.nomeContato}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  disabled={carregando}
                  className={erros.nomeContato ? 'input-erro' : ''}
                />
                {erros.nomeContato && (
                  <span className="erro-texto">{erros.nomeContato}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="parentesco">Parentesco *</label>
                <select
                  id="parentesco"
                  name="parentesco"
                  value={formData.parentesco}
                  onChange={handleChange}
                  disabled={carregando}
                  className={erros.parentesco ? 'input-erro' : ''}
                >
                  <option value="">Selecione</option>
                  {parentescos.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {erros.parentesco && (
                  <span className="erro-texto">{erros.parentesco}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="telefoneContato">Telefone *</label>
                <input
                  type="tel"
                  id="telefoneContato"
                  name="telefoneContato"
                  value={formData.telefoneContato}
                  onChange={handleTelefoneChange}
                  placeholder="(00) 00000-0000"
                  disabled={carregando}
                  className={erros.telefoneContato ? 'input-erro' : ''}
                  maxLength="15"
                />
                {erros.telefoneContato && (
                  <span className="erro-texto">{erros.telefoneContato}</span>
                )}
              </div>
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