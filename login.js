const firebaseConfig = {
    apiKey: "AIzaSyCt7HvTd9a1GCXVJogQPox7RyvScS5tSnk",
    authDomain: "ondeestou-af562.firebaseapp.com",
    projectId: "ondeestou-af562",
    storageBucket: "ondeestou-af562.firebasestorage.app",
    messagingSenderId: "531700999360",
    appId: "1:531700999360:web:30480679b1ec78b3ca3925"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página de login carregada, inicializando...');
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário
        console.log('Formulário de login submetido.');

        const usuario = document.getElementById('loginUsuario').value.trim();
        const senha = document.getElementById('loginSenha').value.trim();

        if (!usuario || !senha) {
            alert('Por favor, preencha todos os campos!');
            console.log('Campos vazios detectados.');
            return;
        }

        try {
            // Busca o usuário no Firestore
            const usuarioSnapshot = await db.collection('usuarios')
                .where('usuario', '==', usuario)
                .where('senha', '==', senha)
                .get();

            if (usuarioSnapshot.empty) {
                alert('Usuário ou senha inválidos!');
                console.log('Nenhum usuário encontrado com essas credenciais:', usuario);
                return;
            }

            // Usuário encontrado, salva a sessão
            const usuarioData = usuarioSnapshot.docs[0].data();
            console.log('Usuário encontrado:', usuarioData);
            localStorage.setItem('sessao', JSON.stringify({
                usuario: usuarioData.usuario,
                expiracao: Date.now() + 3600000 // Sessão válida por 1 hora
            }));
            console.log('Login bem-sucedido, redirecionando para dashboard...');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Verifique o console para mais detalhes.');
        }
    });
});