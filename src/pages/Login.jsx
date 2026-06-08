import { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tipoUsuario: 'Paciente'
  });

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const tiposUsuario = ['Paciente', 'Médico', 'Administrador'];

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

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      novosErros.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      novosErros.password = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setCarregando(true);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data));
        
        const rotas = {
          'Paciente': '/paciente/dashboard',
          'Médico': '/medico/dashboard',
          'Administrador': '/admin/dashboard'
        };
        
        window.location.href = rotas[formData.tipoUsuario] || '/';
      } else {
        setErros({ geral: 'Email ou senha incorretos' });
      }
    } catch (erro) {
      setErros({ geral: 'Erro ao conectar ao servidor' });
      console.error('Erro:', erro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Logo />
          <h1>Sistema Inteligente de Atendimento Hospitalar</h1>
          <p className="login-subtitle">Entre para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {erros.geral && (
            <div className="erro-geral">
              {erros.geral}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Digite seu email"
              disabled={carregando}
              className={erros.email ? 'input-erro' : ''}
            />
            {erros.email && (
              <span className="erro-texto">{erros.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Digite sua senha"
              disabled={carregando}
              className={erros.password ? 'input-erro' : ''}
            />
            {erros.password && (
              <span className="erro-texto">{erros.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tipoUsuario">Usuário</label>
            <select
              id="tipoUsuario"
              name="tipoUsuario"
              value={formData.tipoUsuario}
              onChange={handleChange}
              disabled={carregando}
            >
              {tiposUsuario.map(tipo => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn-entrar"
            disabled={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/esqueci-senha'); }} className="link-esqueci">
            Esqueci minha senha
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/criar-conta'); }} className="link-criar">
            Criar conta
          </a>
        </div>
      </div>
    </div>
  );
}