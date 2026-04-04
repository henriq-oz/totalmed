import { useState } from 'react';
import '../styles/Login.css';
import Logo from '../components/Logo';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    emailOuUsuario: '',
    senha: '',
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

    if (!formData.emailOuUsuario.trim()) {
      novosErros.emailOuUsuario = 'Email ou usuário é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailOuUsuario) && formData.emailOuUsuario.length < 3) {
      novosErros.emailOuUsuario = 'Email ou usuário inválido';
    }

    if (!formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      novosErros.senha = 'Senha deve ter no mínimo 6 caracteres';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validarFormulario()) {
  //     return;
  //   }

  //   setCarregando(true);

  //   try {
  //     const response = await fetch('/api/autenticacao/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         emailOuUsuario: formData.emailOuUsuario,
  //         senha: formData.senha,
  //         tipoUsuario: formData.tipoUsuario
  //       })
  //     });

  //     if (response.ok) {
  //       const dados = await response.json();
  //       localStorage.setItem('token', dados.token);
  //       localStorage.setItem('usuario', JSON.stringify(dados.usuario));
        
  //       const rotas = {
  //         'Paciente': '/paciente/dashboard',
  //         'Médico': '/medico/dashboard',
  //         'Administrador': '/admin/dashboard'
  //       };
        
  //       window.location.href = rotas[formData.tipoUsuario];
  //     } else {
  //       setErros({
  //         geral: 'Email/usuário ou senha incorretos'
  //       });
  //     }
  //   } catch (erro) {
  //     setErros({
  //       geral: 'Erro ao conectar ao servidor. Tente novamente.'
  //     });
  //     console.error('Erro de login:', erro);
  //   } finally {
  //     setCarregando(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) return;

  setCarregando(true);

  try {
    let endpoint = formData.tipoUsuario === 'Médico' ? '/medicos' : '/pacientes';

    const response = await fetch(endpoint);
    const usuarios = await response.json();

    const usuarioEncontrado = usuarios.find(u => 
      (u.email === formData.emailOuUsuario || u.cpf === formData.emailOuUsuario) &&
      u.senha === formData.senha
    );

    if (usuarioEncontrado) {
      const dados = {
        token: "fake-token-" + Date.now(),
        usuario: usuarioEncontrado
      };
      
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));
      
      const rotas = {
        'Paciente': '/paciente/dashboard',
        'Médico': '/medico/dashboard',
        'Administrador': '/admin/dashboard'
      };
      
      window.location.href = rotas[formData.tipoUsuario] || '/';
    } else {
      setErros({ geral: 'Email/usuário ou senha incorretos' });
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
            <label htmlFor="emailOuUsuario">Email ou usuário</label>
            <input
              type="text"
              id="emailOuUsuario"
              name="emailOuUsuario"
              value={formData.emailOuUsuario}
              onChange={handleChange}
              placeholder="Digite seu email ou usuário"
              disabled={carregando}
              className={erros.emailOuUsuario ? 'input-erro' : ''}
            />
            {erros.emailOuUsuario && (
              <span className="erro-texto">{erros.emailOuUsuario}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite sua senha"
              disabled={carregando}
              className={erros.senha ? 'input-erro' : ''}
            />
            {erros.senha && (
              <span className="erro-texto">{erros.senha}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tipoUsuario">Tipo de usuário</label>
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