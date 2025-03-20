// Your web app's Firebase configuration
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

document.addEventListener('DOMContentLoaded', async () => {
    const cadastroForm = document.getElementById('cadastroForm');

    // Verifica se já existem usuários iniciais
    const usuariosSnapshot = await db.collection('usuarios').get();
    if (usuariosSnapshot.empty) {
        await db.collection('usuarios').add({ usuario: 'Admin', senha: '79695641', cargo: 'admin' });
        await db.collection('usuarios').add({ usuario: 'Wagner Santos', senha: '123456', cargo: 'comum' });
    }

    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const novoUsuario = document.getElementById('cadastroUsuario').value;
        const novaSenha = document.getElementById('cadastroSenha').value;

        const usuarioExistente = await db.collection('usuarios')
            .where('usuario', '==', novoUsuario)
            .get();

        if (!usuarioExistente.empty) {
            alert('Este usuário já existe!');
            return;
        }

        await db.collection('usuarios').add({
            usuario: novoUsuario,
            senha: novaSenha,
            cargo: 'comum'
        });
        alert('Usuário cadastrado com sucesso! Faça login.');
        window.location.href = 'index.html';
    });
});