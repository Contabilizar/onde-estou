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

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('atividadeForm');
    const lista = document.getElementById('atividades');
    const logoutBtn = document.getElementById('logoutBtn');
    const gerenciamentoLink = document.getElementById('gerenciamentoLink');

    verificarSessao();

    const atividadesSnapshot = await db.collection('atividades').get();
    if (atividadesSnapshot.empty) {
        await db.collection('atividades').add({ texto: 'Wagner Santos irá fazer Reunião em 20/03/2025 às 14:00' });
        await db.collection('atividades').add({ texto: 'Admin irá fazer Consulta em 21/03/2025 às 09:00' });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const atividade = document.getElementById('atividade').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;

        const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
        const textoAtividade = `${usuarioLogado.usuario} irá fazer ${atividade} em ${dataFormatada} às ${hora}`;

        await db.collection('atividades').add({ texto: textoAtividade });
        carregarAtividades();
        form.reset();
    });

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
    if (usuarioLogado.cargo === 'admin') {
        document.getElementById('gerenciamentoLink').classList.remove('hidden');
    }
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
        if (usuarioLogado.cargo === 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => excluirAtividade(doc.id);
            li.appendChild(deleteBtn);
        }
        lista.appendChild(li);
    });
}

async function excluirAtividade(id) {
    await db.collection('atividades').doc(id).delete();
    carregarAtividades();
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}