import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterPatient from '../components/RegisterPatient';
import RegisterDoctor from '../components/RegisterDoctor';
import Logo from '../components/Logo';
import iconDoctor from '../assets/stethoscope.png';
import iconPatient from '../assets/person.png';
import '../styles/Register.css';

export default function Register() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const navigate = useNavigate();

  if (tipoSelecionado === 'paciente') {
    return <RegisterPatient onVoltarClick={() => setTipoSelecionado(null)} />;
  }

  if (tipoSelecionado === 'medico') {
    return <RegisterDoctor onVoltarClick={() => setTipoSelecionado(null)} />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <Logo />
          <h1>Criar Conta</h1>
          <p className="register-subtitle">Escolha o tipo de conta que deseja criar</p>
        </div>

        <div className="type-selection">
          {/* Card Paciente */}
          <div
            className="type-card"
            onClick={() => setTipoSelecionado('paciente')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setTipoSelecionado('paciente')}
          >
            <div className="type-icon">
              <img src={iconPatient} alt="Ícone Paciente" />
            </div>
            <h2>Paciente</h2>
            <p>Crie uma conta como paciente para realizar triagens, solicitar atendimentos e acompanhar seu histórico médico.</p>
          </div>

          {/* Card Médico */}
          <div
            className="type-card"
            onClick={() => setTipoSelecionado('medico')}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setTipoSelecionado('medico')}
          >
            <div className="type-icon">
              <img src={iconDoctor} alt="Ícone Médico" />
            </div>
            <h2>Médico</h2>
            <p>Crie uma conta como médico para atender pacientes, registrar diagnósticos e prescrever receitas digitais.</p>
          </div>
        </div>

        <div className="register-footer">
          <Link to="/login" className="link-entrar">
            Já tem uma conta? Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}