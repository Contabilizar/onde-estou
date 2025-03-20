console.log('Iniciando solicitacoes.js...');

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
}

let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM carregado, configurando solicitações...');
    const solicitacaoForm = document.getElementById('solicitacaoForm');
    const solicitacoesLista = document.getElementById('solicitacoes');
    const logoutBtn = document.getElementById('logoutBtn');
    const gerenciamentoLink = document.getElementById('gerenciamentoLink');

    // Carregar solicitações iniciais (se vazio)
    const solicitacoesSnapshot = await db.collection('solicitacoes').get();
    if (solicitacoesSnapshot.empty) {
        console.log('Nenhuma solicitação encontrada, adicionando inicial...');
        await db.collection('solicitacoes').add({
            usuario: 'Wagner Santos',
            destino: 'Dr. João',
            motivo: 'Agendar consulta',
            status: 'aberta',
            descricao: '',
            dataCriacao: '20/03/2025 10:00:00'
        });
        console.log('Solicitação inicial adicionada.');
    }

    // Verificar sessão
    await verificarSessao();

    // Evento de envio do formulário
    solicitacaoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const destino = document.getElementById('destino').value;
        const motivo = document.getElementById('motivo').value;

        try {
            await db.collection('solicitacoes').add({
                usuario: usuarioLogado.usuario,
                destino: destino,
                motivo: motivo,
                status: 'aberta',
                descricao: '',
                dataCriacao: new Date().toLocaleString('pt-BR')
            });
            console.log('Solicitação registrada:', { destino, motivo });
            carregarSolicitacoes();
            solicitacaoForm.reset();
        } catch (error) {
            console.error('Erro ao registrar solicitação:', error);
        }
    });

    // Evento de logout
    logoutBtn.addEventListener('click', logout);
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
    await carregarSolicitacoes();
}

async function carregarSolicitacoes() {
    const solicitacoesSnapshot = await db.collection('solicitacoes').get();
    const solicitacoesLista = document.getElementById('solicitacoes');
    solicitacoesLista.innerHTML = '';

    solicitacoesSnapshot.forEach((doc) => {
        const solicitacao = doc.data();
        const li = document.createElement('li');
        li.classList.add('solicitacao-item');
        li.innerHTML = `
            <span>Solicitante: ${solicitacao.usuario}</span>
            <span>Destino: ${solicitacao.destino}</span>
            <span>Motivo: ${solicitacao.motivo}</span>
            <span class="status ${solicitacao.status}">${solicitacao.status === 'aberta' ? 'Aberta' : 'Finalizada'}</span>
            <span class="descricao">${solicitacao.descricao || 'Sem descrição'}</span>
            <span>Data: ${solicitacao.dataCriacao}</span>
        `;

        if (usuarioLogado.cargo === 'admin' || usuarioLogado.cargo === 'recepcionista') {
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Atualizar';
            updateBtn.classList.add('update-solicitacao-btn');
            updateBtn.onclick = () => atualizarSolicitacao(doc.id);
            actionsDiv.appendChild(updateBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => excluirSolicitacao(doc.id);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(actionsDiv);
        }

        solicitacoesLista.appendChild(li);
    });
    console.log('Solicitações carregadas.');
}

async function atualizarSolicitacao(id) {
    const descricao = prompt('Descreva o ocorrido:');
    if (descricao === null) return;

    const status = confirm('A ligação foi concluída com sucesso? (OK para Finalizar, Cancelar para manter Aberta)') ? 'finalizada' : 'aberta';
    try {
        await db.collection('solicitacoes').doc(id).update({
            status: status,
            descricao: descricao
        });
        console.log('Solicitação atualizada:', id);
        carregarSolicitacoes();
    } catch (error) {
        console.error('Erro ao atualizar solicitação:', error);
    }
}

async function excluirSolicitacao(id) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
        try {
            await db.collection('solicitacoes').doc(id).delete();
            console.log('Solicitação excluída:', id);
            carregarSolicitacoes();
        } catch (error) {
            console.error('Erro ao excluir solicitação:', error);
        }
    }
}

function logout() {
    console.log('Logout solicitado.');
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}
