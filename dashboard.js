console.log('Iniciando dashboard.js...');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCt7HvTd9a1GCXVJogQPox7RyvScS5tSnk",
    authDomain: "ondeestou-af562.firebaseapp.com",
    projectId: "ondeestou-af562",
    storageBucket: "ondeestou-af562.firebasestorage.app",
    messagingSenderId: "531700999360",
    appId: "1:531700999360:web:30480679b1ec78b3ca3925"
};

// Inicializar Firebase
if (typeof firebase === 'undefined') {
    console.error('Firebase não foi carregado.');
} else {
    console.log('Firebase carregado. Versão:', firebase.SDK_VERSION);
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    console.log('Firestore inicializado.');

    let usuarioLogado = null;

    document.addEventListener('DOMContentLoaded', async () => {
        const form = document.getElementById('atividadeForm');
        const lista = document.getElementById('atividades');
        const logoutBtn = document.getElementById('logoutBtn');
        const gerenciamentoLink = document.getElementById('gerenciamentoLink');

        // Verificar sessão
        await verificarSessao();

        // Carregar atividades iniciais (se vazio)
        const atividadesSnapshot = await db.collection('atividades').get();
        if (atividadesSnapshot.empty) {
            console.log('Nenhuma atividade encontrada, adicionando iniciais...');
            await db.collection('atividades').add({ texto: 'Wagner Santos irá fazer Reunião em 20/03/2025 às 14:00' });
            await db.collection('atividades').add({ texto: 'Admin irá fazer Consulta em 21/03/2025 às 09:00' });
            console.log('Atividades iniciais adicionadas.');
        }

        // Evento de envio do formulário
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const atividade = document.getElementById('atividade').value;
            const data = document.getElementById('data').value;
            const hora = document.getElementById('hora').value;

            const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
            const textoAtividade = `${usuarioLogado.usuario} irá fazer ${atividade} em ${dataFormatada} às ${hora}`;

            try {
                await db.collection('atividades').add({ texto: textoAtividade });
                console.log('Atividade registrada:', textoAtividade);
                carregarAtividades();
                form.reset();
            } catch (error) {
                console.error('Erro ao registrar atividade:', error);
            }
        });

        // Evento de logout
        logoutBtn.addEventListener('click', logout);

        // Carregar atividades iniciais
        carregarAtividades();
    });

    async function verificarSessao() {
        const sessao = JSON.parse(localStorage.getItem('sessao') || '{}');
        if (!sessao.usuario || sessao.expiracao <= Date.now()) {
            console.log('Sessão inválida ou expirada.');
            window.location.href = 'index.html';
            return;
        }
        const usuariosSnapshot = await db.collection('usuarios')
            .where('usuario', '==', sessao.usuario)
            .get();
        if (usuariosSnapshot.empty) {
            console.log('Usuário não encontrado no Firestore.');
            window.location.href = 'index.html';
            return;
        }
        usuarioLogado = usuariosSnapshot.docs[0].data();
        console.log('Usuário logado:', usuarioLogado);
        if (usuarioLogado.cargo === 'admin') {
            document.getElementById('gerenciamentoLink').classList.remove('hidden');
        }
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
        console.log('Atividades carregadas.');
    }

    async function excluirAtividade(id) {
        try {
            await db.collection('atividades').doc(id).delete();
            console.log('Atividade excluída:', id);
            carregarAtividades();
        } catch (error) {
            console.error('Erro ao excluir atividade:', error);
        }
    }

    function logout() {
        console.log('Logout solicitado.');
        localStorage.removeItem('sessao');
        window.location.href = 'index.html';
    }
}