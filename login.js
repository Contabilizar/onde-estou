console.log('Iniciando login.js...');

if (typeof firebase === 'undefined') {
    console.error('Firebase não foi carregado. Verifique os scripts no <head> do HTML.');
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
        console.log('DOM carregado, configurando login...');
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) {
            console.error('Elemento #loginForm não encontrado.');
            return;
        }
        console.log('Formulário de login encontrado:', loginForm);

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Evento de submit disparado em login.');

            const usuario = document.getElementById('loginUsuario').value.trim();
            const senha = document.getElementById('loginSenha').value.trim();
            console.log('Dados inseridos:', { usuario, senha });

            if (!usuario || !senha) {
                alert('Preencha todos os campos!');
                console.log('Campos vazios.');
                return;
            }

            try {
                console.log('Buscando usuário no Firestore...');
                const usuarioSnapshot = await db.collection('usuarios')
                    .where('usuario', '==', usuario)
                    .where('senha', '==', senha)
                    .get();

                if (usuarioSnapshot.empty) {
                    alert('Usuário ou senha inválidos!');
                    console.log('Nenhum usuário encontrado:', usuario);
                    return;
                }

                const usuarioData = usuarioSnapshot.docs[0].data();
                console.log('Usuário encontrado:', usuarioData);
                localStorage.setItem('sessao', JSON.stringify({
                    usuario: usuarioData.usuario,
                    expiracao: Date.now() + 3600000
                }));
                console.log('Login bem-sucedido, redirecionando...');
                window.location.href = 'dashboard.html';
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro ao fazer login. Veja o console.');
            }
        });
    });
}
