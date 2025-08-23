document.addEventListener('DOMContentLoaded', () => {
  // === Elementos principais ===
  const abas = document.querySelectorAll('.tab');
  const containerAbas = document.querySelector('.tab-selector');

  const formLoginCliente = document.getElementById('form-cliente');
  const formLoginEmpresa = document.getElementById('form-empresa');

  const cadastroCliente = document.getElementById('cadastroForm');
  // const cadastroEmpresa = document.getElementById('cadastroForm-empresa'); // caso exista

  const linksCadastro = document.querySelectorAll('.link-to-cadastro');
  const linkLoginRodape = document.querySelector('#link-login');

  // === Estado inicial: mostrar Cliente por padrão ===
  if (abas.length) {
    abas.forEach(a => a.classList.remove('active'));
    abas[0].classList.add('active');
  }
  if (formLoginCliente) formLoginCliente.style.display = 'block';
  if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
  if (cadastroCliente) cadastroCliente.style.display = 'none';

  // === Funções auxiliares ===
  function esconderAbas() {
    if (containerAbas) containerAbas.style.display = 'none';
    abas.forEach(a => a.classList.remove('active'));
  }

  function mostrarAbas() {
    if (containerAbas) containerAbas.style.display = '';
    abas.forEach(a => a.classList.remove('active'));
    if (abas[0]) abas[0].classList.add('active');
  }

  // === Navegação entre abas (Cliente/Empresa) ===
  abas.forEach(tab => {
    tab.addEventListener('click', () => {
      abas.forEach(a => a.classList.remove('active'));
      tab.classList.add('active');

      const label = tab.textContent.trim().toLowerCase();

      if (label.includes('cliente')) {
        if (formLoginCliente) formLoginCliente.style.display = 'block';
        if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
        if (cadastroCliente) cadastroCliente.style.display = 'none';
      } else if (label.includes('empresa')) {
        if (formLoginEmpresa) formLoginEmpresa.style.display = 'block';
        if (formLoginCliente) formLoginCliente.style.display = 'none';
        if (cadastroCliente) cadastroCliente.style.display = 'none';
      }
    });
  });

  // === Abrir cadastro (links de cadastro) ===
  linksCadastro.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      esconderAbas();
      if (formLoginCliente) formLoginCliente.style.display = 'none';
      if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
      if (cadastroCliente) cadastroCliente.style.display = 'block';
      // if (cadastroEmpresa) cadastroEmpresa.style.display = 'block';
    });
  });

  // === Voltar ao login pelo rodapé ===
  if (linkLoginRodape) {
    linkLoginRodape.addEventListener('click', e => {
      e.preventDefault();
      mostrarAbas();
      if (formLoginCliente) formLoginCliente.style.display = 'block';
      if (formLoginEmpresa) formLoginEmpresa.style.display = 'none';
      if (cadastroCliente) cadastroCliente.style.display = 'none';
      // if (cadastroEmpresa) cadastroEmpresa.style.display = 'none';
    });
  }

  // === Validações ===
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateCNPJ(cnpj) {
    return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  }

  // === Submit login cliente ===
  if (formLoginCliente) {
    formLoginCliente.addEventListener('submit', e => {
      e.preventDefault();

      const email = document.getElementById('email-cliente').value.trim();
      const senha = document.getElementById('senha-cliente').value.trim();

      if (!validateEmail(email)) {
        alert('Informe um e-mail válido para Cliente.');
        return;
      }
      if (!senha) {
        alert('Informe a senha para Cliente.');
        return;
      }

      alert('Login de Cliente realizado com sucesso (simulado).');
    });
  }

  // === Submit login empresa ===
  if (formLoginEmpresa) {
    formLoginEmpresa.addEventListener('submit', e => {
      e.preventDefault();

      const cnpj = document.getElementById('cnpj').value.trim();
      const senha = document.getElementById('senha-empresa').value.trim();

      if (!validateCNPJ(cnpj)) {
        alert('Informe um CNPJ válido no formato 00.000.000/0000-00.');
        return;
      }
      if (!senha) {
        alert('Informe a senha para Empresa.');
        return;
      }

      alert('Login de Empresa realizado com sucesso (simulado).');
    });
  }
});
