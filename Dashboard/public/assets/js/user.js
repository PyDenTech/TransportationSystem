document.addEventListener('DOMContentLoaded', function () {
  fetchUserData();

  const formChangePassword = document.getElementById('form-change-password');
  if (formChangePassword) {
    formChangePassword.addEventListener('submit', function (event) {
      event.preventDefault();
      updateUserPassword();
    });
  }
});

function fetchUserData() {
  fetch('/api/userDetails')
    .then(response => response.json())
    .then(data => {
      updateProfilePage(data);
    })
    .catch(error => console.error('Erro ao buscar dados do usuário:', error));
}

function updateProfilePage(user) {
  const usuarioNomeHeader = document.getElementById('usuarioNome');
  const nomeCompletoMain = document.getElementById('nomeCompletoMain');
  const usuarioFuncaoHeader = document.getElementById('usuarioFuncao'); 
  const usuarioFuncaoMain = document.getElementById('usuarioFuncaoMain');
  const usuarioFuncaotwo = document.getElementById('usuario-Funcao');
  const usuarioLotacaoHeader = document.getElementById('usuarioLotacao');
  const usuarioLotacaoMain = document.getElementById('usuarioLotacaoMain');
  const userEmail = document.getElementById('email');
  const userContato = document.getElementById('contatoMain');

  if (usuarioNomeHeader) usuarioNomeHeader.textContent = user.usuario || 'Nome de Usuário';
  if (nomeCompletoMain) nomeCompletoMain.textContent = user.nome_completo || 'Nome Completo';
  if (usuarioFuncaoHeader) usuarioFuncaoHeader.textContent = user.funcao || 'Função'; // Atualiza com a função do usuário
  if (usuarioFuncaoMain) usuarioFuncaoMain.textContent = user.funcao || 'Função';
  if (usuarioFuncaotwo) usuarioFuncaotwo.textContent = user.funcao || 'Função';
  if (usuarioLotacaoHeader) usuarioLotacaoHeader.textContent = user.setor || 'Setor';
  if (usuarioLotacaoMain) usuarioLotacaoMain.textContent = user.setor || 'Setor';
  if (userEmail) userEmail.textContent = user.email || 'seuemail@example.com';
  if (userContato) userContato.textContent = user.numero || '94 991989803';
}

function updateUserPassword() {
  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const renewPassword = document.getElementById('renewPassword').value;

  if (newPassword !== renewPassword) {
    alert('A confirmação da nova senha não coincide.');
    return;
  }

  fetch('/changeUserPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Falha ao mudar senha do usuário');
      }
      return response.json();
    })
    .then(data => {
      alert('Senha atualizada com sucesso!');
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('renewPassword').value = '';
    })
    .catch(error => {
      console.error('Erro ao mudar senha do usuário:', error);
      alert('Erro ao mudar senha do usuário.');
    });
}

document.addEventListener('DOMContentLoaded', function () {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      fetch('/logout')
        .then(response => {
          // Redireciona para a página de login após o logout
          window.location.href = '/login.html';
        })
        .catch(error => console.error('Erro ao realizar logout:', error));
    });
  }
});
