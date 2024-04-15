document.addEventListener('DOMContentLoaded', function () {
    fetchUsers();

    function fetchUsers() {
        fetch('/usuarios')
            .then(response => response.json())
            .then(users => displayUsers(users))
            .catch(error => console.error('Erro ao buscar usuários:', error));
    }

    function displayUsers(users) {
        const userList = document.getElementById('userList');
        userList.innerHTML = users.map(user => `
            <div>
                ${user.nome} (${user.role}) - ${user.init ? 'Ativo' : 'Inativo'}
                <button onclick="toggleUserInit(${user.id}, ${!user.init})">
                    ${user.init ? 'Desativar' : 'Ativar'}
                </button>
                <select id="roleSelect${user.id}">
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrador</option>
                    <option value="gestor" ${user.role === 'gestor' ? 'selected' : ''}>Gestor</option>
                    <option value="agente_adm" ${user.role === 'agente_adm' ? 'selected' : ''}>Agente Administrativo</option>
                    <option value="pai" ${user.role === 'pai' ? 'selected' : ''}>Pai</option>
                </select>
                <button onclick="changeUserRole(${user.id}, document.getElementById('roleSelect${user.id}').value)">
                    Alterar Papel
                </button>
                <button onclick="deleteUser(${user.id})">Excluir</button>
            </div>
        `).join('');
    }


    window.changeUserRole = function (userId, newRole) {
        fetch(`/update-user-role/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        }).then(response => response.json())
            .then(data => {
                alert(data.message);
                fetchUsers();
            })
            .catch(error => alert('Erro ao atualizar o papel do usuário: ' + error.message));
    };
    window.deleteUser = function (userId) {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            fetch(`/delete-user/${userId}`, {
                method: 'DELETE'
            }).then(response => response.json())
                .then(data => {
                    alert(data.message);
                    fetchUsers(); // Recarrega a lista de usuários após a exclusão
                })
                .catch(error => alert('Erro ao excluir usuário: ' + error.message));
        }
    };


    window.toggleUserInit = function (userId, newInit) {
        fetch(`/update-user-init/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ init: newInit })
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                window.location.reload(); // Recarrega a página para refletir as mudanças
            })
            .catch(error => {
                console.error('Erro ao atualizar status do usuário:', error);
                alert('Erro ao atualizar status do usuário.');
            });
    }
});
