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
    console.log('Página de cadastro carregada, inicializando...');
    const cadastroForm = document.getElementById('cadastroForm');

    // Verifica e adiciona usuários iniciais
    try {
        const usuariosSnapshot = await db.collection('usuarios').get();
        if (usuariosSnapshot.empty) {
            console.log('Nenhum usuário encontrado, adicionando usuários iniciais...');
            await db.collection('usuarios').add({ usuario: 'Admin', senha: '79695641', cargo: 'admin' });
            await db.collection('usuarios').add({ usuario: 'Wagner Santos', senha: '123456', cargo: 'comum' });
            console.log('Usuários iniciais "Admin" e "Wagner Santos" adicionados ao Firestore.');
        } else {
            console.log('Usuários já existem no Firestore:', usuariosSnapshot.size, 'usuários encontrados.');
        }
    } catch (error) {
        console.error('Erro ao verificar usuários iniciais:', error);
    }

    cadastroForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede o envio padrão do formulário
        console.log('Formulário de cadastro submetido.');

        const novoUsuario = document.getElementById('cadastroUsuario').value.trim();
        const novaSenha = document.getElementById('cadastroSenha').value.trim();

        if (!novoUsuario || !novaSenha) {
            alert('Por favor, preencha todos os campos!');
            console.log('Campos vazios detectados.');
            return;
        }

        try {
            // Verifica se o usuário já existe
            const usuarioExistente = await db.collection('usuarios')
                .where('usuario', '==', novoUsuario)
                .get();

            if (!usuarioExistente.empty) {
                alert('Este usuário já existe!');
                console.log('Usuário já registrado:', novoUsuario);
                return;
            }

            // Cadastra o novo usuário no Firestore
            await db.collection('usuarios').add({
                usuario: novoUsuario,
                senha: novaSenha,
                cargo: 'comum'
            });
            console.log('Novo usuário cadastrado com sucesso:', novoUsuario);
            alert('Usuário cadastrado com sucesso! Faça login.');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            alert('Erro ao cadastrar usuário. Verifique o console para mais detalhes.');
        }
    });
});