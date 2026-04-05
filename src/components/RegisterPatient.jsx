import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import '../styles/RegisterForms.css';

export default function RegisterPatient({ onVoltarClick }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    endereco: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: ''
  });

  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let valorFormatado = value;

    // Formatar CPF
    if (name === 'cpf') {
      valorFormatado = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
    }

    // Formatar Telefone
    if (name === 'telefone') {
      valorFormatado = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    }

    // Formatar Data
    if (name === 'dataNascimento') {
      valorFormatado = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substring(0, 10);
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

  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');

    if (cpfLimpo.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    let soma = 0;
    let resto;

    // Validar primeiro dígito
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    // Validar segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true;
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nomeCompleto.trim()) {
      novosErros.nomeCompleto = 'Nome completo é obrigatório';
    } else if (formData.nomeCompleto.trim().split(' ').length < 2) {
      novosErros.nomeCompleto = 'Digite seu nome completo';
    }

    if (!formData.cpf.trim()) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!validarCPF(formData.cpf)) {
      novosErros.cpf = 'CPF inválido';
    }

    if (!formData.dataNascimento) {
      novosErros.dataNascimento = 'Data de nascimento é obrigatória';
    } else {
      const [dia, mes, ano] = formData.dataNascimento.split('/');
      const dataNasc = new Date(ano, mes - 1, dia);
      const hoje = new Date();
      const idade = hoje.getFullYear() - dataNasc.getFullYear();

      if (idade < 18) {
        novosErros.dataNascimento = 'Você deve ter pelo menos 18 anos';
      }
    }

    if (!formData.sexo) {
      novosErros.sexo = 'Sexo é obrigatório';
    }

    if (!formData.endereco.trim()) {
      novosErros.endereco = 'Endereço é obrigatório';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    if (!formData.telefone.trim()) {
      novosErros.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.replace(/\D/g, '').length !== 11) {
      novosErros.telefone = 'Telefone inválido';
    }

    if (!formData.senha.trim()) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 8) {
      novosErros.senha = 'Senha deve ter no mínimo 8 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.senha)) {
      novosErros.senha = 'Senha deve conter maiúsculas, minúsculas e números';
    }

    if (!formData.confirmarSenha.trim()) {
      novosErros.confirmarSenha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
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
      // const response = await fetch('/api/autenticacao/registro/paciente', {
      const response = await fetch('/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nomeCompleto: formData.nomeCompleto,
          cpf: formData.cpf.replace(/\D/g, ''),
          dataNascimento: formData.dataNascimento,
          sexo: formData.sexo,
          endereco: formData.endereco,
          email: formData.email,
          telefone: formData.telefone.replace(/\D/g, ''),
          senha: formData.senha
        })
      });

if (response.ok) {
  const dadosPaciente = {
    nomeCompleto: formData.nomeCompleto,
    cpf: formData.cpf.replace(/\D/g, ''),
    dataNascimento: formData.dataNascimento,
    sexo: formData.sexo,
    endereco: formData.endereco,
    email: formData.email,
    telefone: formData.telefone.replace(/\D/g, ''),
    senha: formData.senha
  };
  
  navigate('/ficha-saude', { state: { patientData: dadosPaciente } });
} else {
        const erro = await response.json();
        setErros({
          geral: erro.mensagem || 'Erro ao criar conta'
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
    <div className="register-form-container">
      <div className="register-form-card">
        <div className="form-header">
          <Logo />
          <button className="btn-voltar" onClick={onVoltarClick}>← Voltar</button>
          <h1>Cadastro de Paciente</h1>
          <p>Preencha seus dados para se cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          {erros.geral && (
            <div className="erro-geral">
              {erros.geral}
            </div>
          )}

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="nomeCompleto">Nome completo *</label>
              <input
                type="text"
                id="nomeCompleto"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                disabled={carregando}
                className={erros.nomeCompleto ? 'input-erro' : ''}
              />
              {erros.nomeCompleto && <span className="erro-texto">{erros.nomeCompleto}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                placeholder="000.000.000-00"
                disabled={carregando}
                className={erros.cpf ? 'input-erro' : ''}
                maxLength="14"
              />
              {erros.cpf && <span className="erro-texto">{erros.cpf}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="dataNascimento">Data de nascimento *</label>
              <input
                type="text"
                id="dataNascimento"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                placeholder="dd/mm/aaaa"
                disabled={carregando}
                className={erros.dataNascimento ? 'input-erro' : ''}
                maxLength="10"
              />
              {erros.dataNascimento && <span className="erro-texto">{erros.dataNascimento}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sexo">Sexo *</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                disabled={carregando}
                className={erros.sexo ? 'input-erro' : ''}
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
              {erros.sexo && <span className="erro-texto">{erros.sexo}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="endereco">Endereço *</label>
              <input
                type="text"
                id="endereco"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                placeholder="Rua, número, bairro - Cidade, UF"
                disabled={carregando}
                className={erros.endereco ? 'input-erro' : ''}
              />
              {erros.endereco && <span className="erro-texto">{erros.endereco}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                disabled={carregando}
                className={erros.email ? 'input-erro' : ''}
              />
              {erros.email && <span className="erro-texto">{erros.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="telefone">Telefone *</label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                disabled={carregando}
                className={erros.telefone ? 'input-erro' : ''}
                maxLength="15"
              />
              {erros.telefone && <span className="erro-texto">{erros.telefone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="senha">Senha *</label>
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
              {erros.senha && <span className="erro-texto">{erros.senha}</span>}
              <p className="password-hint">Mínimo 8 caracteres, com maiúsculas, minúsculas e números</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="confirmarSenha">Confirmar Senha *</label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                placeholder="Confirme sua senha"
                disabled={carregando}
                className={erros.confirmarSenha ? 'input-erro' : ''}
              />
              {erros.confirmarSenha && <span className="erro-texto">{erros.confirmarSenha}</span>}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={carregando}
          >
            {carregando ? 'Criando conta...' : 'Continuar para Ficha de Saúde'}
          </button>
        </form>

        <div className="form-footer">
          <Link to="/login" className="link-login">
            Já tem uma conta? Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}