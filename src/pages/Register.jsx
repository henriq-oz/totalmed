import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterPatient from '../components/RegisterPatient';
import RegisterDoctor from '../components/RegisterDoctor';
import Logo from '../components/Logo';
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
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="30" cy="16" r="6" stroke="#27ae60" strokeWidth="2" fill="none"/>
                <path d="M22 30C22 25.6 25.6 22 30 22C34.4 22 38 25.6 38 30" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M18 36C18 31.6 21.6 28 26 28C26.8 28 27.6 28.1 28.4 28.3" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M42 36C42 31.6 38.4 28 34 28C33.2 28 32.4 28.1 31.6 28.3" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M12 44C12 37.4 18 32 24 32C24.6 32 25.2 32 25.8 32.1" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M48 44C48 37.4 42 32 36 32C35.4 32 34.8 32 34.2 32.1" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M14 44C14 36.3 20.7 30 28.5 30C36.3 30 43 36.3 43 44" stroke="#27ae60" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
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
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 10C21.7 10 15 16.7 15 25C15 35 30 50 30 50C30 50 45 35 45 25C45 16.7 38.3 10 30 10Z" stroke="#27ae60" strokeWidth="2" fill="none"/>
                <circle cx="30" cy="25" r="4" fill="#27ae60"/>
                <line x1="28" y1="18" x2="28" y2="32" stroke="#27ae60" strokeWidth="2" strokeLinecap="round"/>
                <line x1="22" y1="25" x2="36" y2="25" stroke="#27ae60" strokeWidth="2" strokeLinecap="round"/>
              </svg>
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