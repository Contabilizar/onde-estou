const firebaseConfig = {
    apiKey: "AIzaSyCt7HvTd9a1GCXVJogQPox7RyvScS5tSnk",
    authDomain: "ondeestou-af562.firebaseapp.com",
    projectId: "ondeestou-af562",
    storageBucket: "ondeestou-af562.firebasestorage.app",
    messagingSenderId: "531700999360",
    appId: "1:531700999360:web:30480679b1ec78b3ca3925"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    verificarSessao();
    logoutBtn.addEventListener('click', logout);
});

async function verificarSessao() {
    const sessao = JSON.parse(localStorage.getItem('sessao') || '{}');
    if (!sessao.usuario || sessao.expiracao <= Date.now()) {
        window.location.href = 'index.html';
        return;
    }
    const usuariosSnapshot = await db.collection('usuarios').where('usuario', '==', sessao.usuario).get();
    if (usuariosSnapshot.empty) {
        window.location.href = 'index.html';
        return;
    }
    usuarioLogado = usuariosSnapshot.docs[0].data();
    usuarioLogado.id = usuariosSnapshot.docs[0].id;
    if (usuarioLogado.cargo !== 'admin') {
        window.location.href = 'dashboard.html';
        return;
    }
    carregarUsuarios();
    carregarAtividades();
}

async function carregarAtividades() {
    const atividadesSnapshot = await db.collection('atividades').get();
    const lista = document.getElementById('atividades');
    lista.innerHTML = '';
    atividadesSnapshot.forEach((doc) => {
        const atividade = doc.data().texto;
        const li = document.createElement('li');
        li.textContent = atividade;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.onclick = () => excluirAtividade(doc.id);
        li.appendChild(deleteBtn);
        lista.appendChild(li);
    });
}

async function excluirAtividade(id) {
    await db.collection('atividades').doc(id).delete();
    carregarAtividades();
}

async function carregarUsuarios() {
    const usuariosSnapshot = await db.collection('usuarios').get();
    const usuariosList = document.getElementById('usuariosList');
    usuariosList.innerHTML = '';
    usuariosSnapshot.forEach((doc) => {
        const u = doc.data();
        if (u.usuario === usuarioLogado.usuario) return;
        const div = document.createElement('div');
        div.classList.add('usuario-item');
        div.innerHTML = `${u.usuario} (${u.cargo})`;

        const cargoButtons = document.createElement('div');
        cargoButtons.classList.add('cargo-buttons');

        const comumBtn = document.createElement('button');
        comumBtn.textContent = 'Comum';
        comumBtn.classList.add('cargo-btn');
        if (u.cargo === 'comum') comumBtn.classList.add('active');
        comumBtn.onclick = () => alterarCargo(doc.id, 'comum');
        cargoButtons.appendChild(comumBtn);

        const recepcionistaBtn = document.createElement('button');
        recepcionistaBtn.textContent = 'Recep.';
        recepcionistaBtn.classList.add('cargo-btn');
        if (u.cargo === 'recepcionista') recepcionistaBtn.classList.add('active');
        recepcionistaBtn.onclick = () => alterarCargo(doc.id, 'recepcionista');
        cargoButtons.appendChild(recepcionistaBtn);

        const adminBtn = document.createElement('button');
        adminBtn.textContent = 'Admin';
        adminBtn.classList.add('cargo-btn');
        if (u.cargo === 'admin') adminBtn.classList.add('active');
        adminBtn.onclick = () => alterarCargo(doc.id, 'admin');
        cargoButtons.appendChild(adminBtn);

        div.appendChild(cargoButtons);

        const deleteUserBtn = document.createElement('button');
        deleteUserBtn.textContent = 'Excluir';
        deleteUserBtn.classList.add('delete-btn');
        deleteUserBtn.style.marginTop = '5px';
        deleteUserBtn.onclick = () => excluirUsuario(doc.id);
        div.appendChild(deleteUserBtn);

        const changePasswordBtn = document.createElement('button');
        changePasswordBtn.textContent = 'Senha';
        changePasswordBtn.classList.add('change-password-btn');
        changePasswordBtn.style.marginTop = '5px';
        changePasswordBtn.onclick = () => alterarSenha(doc.id);
        div.appendChild(changePasswordBtn);

        usuariosList.appendChild(div);
    });
}

async function alterarCargo(id, novoCargo) {
    await db.collection('usuarios').doc(id).update({ cargo: novoCargo });
    carregarUsuarios();
}

async function excluirUsuario(id) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        await db.collection('usuarios').doc(id).delete();
        carregarUsuarios();
    }
}

async function alterarSenha(id) {
    const novaSenha = prompt('Digite a nova senha para o usuário:');
    if (novaSenha) {
        await db.collection('usuarios').doc(id).update({ senha: novaSenha });
        alert('Senha alterada com sucesso!');
        carregarUsuarios();
    }
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}