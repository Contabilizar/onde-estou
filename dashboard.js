console.log('Iniciando dashboard.js...');

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
        console.log('DOM carregado, configurando dashboard...');

        // Verificar sessão
        const sessao = JSON.parse(localStorage.getItem('sessao'));
        const usuarioLogado = document.getElementById('usuarioLogado');
        if (!sessao || sessao.expiracao < Date.now()) {
            console.log('Sessão inválida ou expirada, redirecionando para login...');
            alert('Sessão expirada. Faça login novamente.');
            window.location.href = 'index.html';
            return;
        }
        console.log('Sessão válida encontrada:', sessao);
        usuarioLogado.textContent = `Olá, ${sessao.usuario}!`;

        // Botão de logout
        document.getElementById('logout').addEventListener('click', () => {
            console.log('Logout solicitado.');
            localStorage.removeItem('sessao');
            window.location.href = 'index.html';
        });
    });
}
