let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    verificarSessao();
    logoutBtn.addEventListener('click', logout);
});

function verificarSessao() {
    const sessao = JSON.parse(localStorage.getItem('sessao') || '{}');
    if (!sessao.usuario || sessao.expiracao <= Date.now()) {
        window.location.href = 'index.html';
        return;
    }
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarioLogado = usuarios.find(u => u.usuario === sessao.usuario);
    if (!usuarioLogado || usuarioLogado.cargo !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }
    carregarUsuarios();
    carregarAtividades();
}

function carregarAtividades() {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
    const lista = document.getElementById('atividades');
    lista.innerHTML = '';
    atividadesSalvas.forEach((atividade, index) => {
        const li = document.createElement('li');
        li.textContent = atividade;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => excluirAtividade(index);
        li.appendChild(deleteBtn);
        lista.appendChild(li);
    });
}

function excluirAtividade(index) {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
    atividadesSalvas.splice(index, 1);
    localStorage.setItem('atividades', JSON.stringify(atividadesSalvas));
    carregarAtividades();
}

function carregarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuariosList = document.getElementById('usuariosList');
    usuariosList.innerHTML = '';
    usuarios.forEach((u, index) => {
        if (u.usuario === usuarioLogado.usuario) return; // Não exibir o próprio admin logado
        const div = document.createElement('div');
        div.classList.add('usuario-item');
        div.innerHTML = `${u.usuario} (${u.cargo})`;

        // Botões de cargo
        const cargoButtons = document.createElement('div');
        cargoButtons.classList.add('cargo-buttons');

        const comumBtn = document.createElement('button');
        comumBtn.textContent = 'Comum';
        comumBtn.classList.add('cargo-btn');
        if (u.cargo === 'comum') comumBtn.classList.add('active');
        comumBtn.onclick = () => alterarCargo(index, 'comum');
        cargoButtons.appendChild(comumBtn);

        const recepcionistaBtn = document.createElement('button');
        recepcionistaBtn.textContent = 'Recep.';
        recepcionistaBtn.classList.add('cargo-btn');
        if (u.cargo === 'recepcionista') recepcionistaBtn.classList.add('active');
        recepcionistaBtn.onclick = () => alterarCargo(index, 'recepcionista');
        cargoButtons.appendChild(recepcionistaBtn);

        const adminBtn = document.createElement('button');
        adminBtn.textContent = 'Admin';
        adminBtn.classList.add('cargo-btn');
        if (u.cargo === 'admin') adminBtn.classList.add('active');
        adminBtn.onclick = () => alterarCargo(index, 'admin');
        cargoButtons.appendChild(adminBtn);

        div.appendChild(cargoButtons);

        // Botão Excluir
        const deleteUserBtn = document.createElement('button');
        deleteUserBtn.textContent = 'Excluir';
        deleteUserBtn.classList.add('delete-btn');
        deleteUserBtn.style.marginTop = '5px'; // Alinhamento
        deleteUserBtn.onclick = () => excluirUsuario(index);
        div.appendChild(deleteUserBtn);

        // Botão Alterar Senha
        const changePasswordBtn = document.createElement('button');
        changePasswordBtn.textContent = 'Senha';
        changePasswordBtn.classList.add('change-password-btn');
        changePasswordBtn.style.marginTop = '5px'; // Alinhamento
        changePasswordBtn.onclick = () => alterarSenha(index);
        div.appendChild(changePasswordBtn);

        usuariosList.appendChild(div);
    });
}

function alterarCargo(index, novoCargo) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarios[index].cargo = novoCargo;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    carregarUsuarios();
}

function excluirUsuario(index) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuarios.splice(index, 1);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        carregarUsuarios();
    }
}

function alterarSenha(index) {
    const novaSenha = prompt('Digite a nova senha para o usuário:');
    if (novaSenha) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        usuarios[index].senha = novaSenha;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Senha alterada com sucesso!');
        carregarUsuarios();
    }
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}