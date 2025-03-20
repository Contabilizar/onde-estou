console.log('Iniciando solicitacoes.js...');

if (typeof firebase === 'undefined') {
    console.error('Firebase não foi carregado no início do script.');
} else {
    console.log('Firebase detectado, inicializando...');
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
    console.log('Firestore inicializado com sucesso.');

    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM carregado, configurando solicitações...');

        // Verificar sessão
        const sessao = JSON.parse(localStorage.getItem('sessao'));
        if (!sessao || sessao.expiracao < Date.now()) {
            console.log('Sessão inválida ou expirada, redirecionando para login...');
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'index.html';
            return;
        }
        console.log('Sessão válida encontrada:', sessao);

        // Botão de logout
        document.getElementById('logout').addEventListener('click', () => {
            console.log('Logout solicitado.');
            localStorage.removeItem('sessao');
            window.location.href = 'index.html');
        });

        // Formulário de solicitação
        const solicitacaoForm = document.getElementById('solicitacaoForm');
        const listaSolicitacoes = document.getElementById('listaSolicitacoes');

        solicitacaoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mensagem = document.getElementById('mensagem').value.trim();
            console.log('Solicitação enviada:', mensagem);

            try {
                await db.collection('solicitacoes').add({
                    usuario: sessao.usuario,
                    mensagem: mensagem,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('Solicitação salva com sucesso.');
                alert('Solicitação enviada!');
                document.getElementById('mensagem').value = '';
            } catch (error) {
                console.error('Erro ao salvar solicitação:', error);
                alert('Erro ao enviar solicitação. Veja o console.');
            }
        });

        // Carregar solicitações existentes
        db.collection('solicitacoes')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                listaSolicitacoes.innerHTML = '';
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const li = document.createElement('li');
                    li.textContent = `${data.usuario}: ${data.mensagem} (${new Date(data.timestamp?.toDate()).toLocaleString()})`;
                    listaSolicitacoes.appendChild(li);
                });
                console.log('Lista de solicitações atualizada.');
            }, (error) => {
                console.error('Erro ao carregar solicitações:', error);
            });
    });
}