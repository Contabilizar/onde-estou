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

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const usuario = document.getElementById('loginUsuario').value;
        const senha = document.getElementById('loginSenha').value;

        const usuarioSnapshot = await db.collection('usuarios')
            .where('usuario', '==', usuario)
            .where('senha', '==', senha)
            .get();

        if (!usuarioSnapshot.empty) {
            const usuarioData = usuarioSnapshot.docs[0].data();
            localStorage.setItem('sessao', JSON.stringify({
                usuario: usuarioData.usuario,
                expiracao: Date.now() + 3600000
            }));
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha inválidos!');
        }
    });
});