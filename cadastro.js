console.log('Iniciando cadastro.js...');

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

    document.addEventListener('DOMContentLoaded', async () => {
        console.log('DOM carregado, configurando cadastro...');
        const cadastroForm = document.getElementById('cadastroForm');
        if (!cadastroForm) {
            console.error('Elemento #cadastroForm não encontrado.');
            return;
        }
        console.log('Formulário de cadastro encontrado.');

        try {
            console.log('Verificando usuários iniciais...');
            const usuariosSnapshot = await db.collection('usuarios').get();
            if (usuariosSnapshot.empty) {
                console.log('Nenhum usuário encontrado, adicionando iniciais...');
                await db.collection('usuarios').add({ usuario: 'Admin', senha: '79695641', cargo: 'admin' });
                await db.collection('usuarios').add({ usuario: 'Wagner Santos', senha: '123456', cargo: 'comum' });
                console.log('Usuários iniciais adicionados.');
            } else {
                console.log('Usuários já existem:', usuariosSnapshot.size);
            }
        } catch (error) {
            console.error('Erro ao verificar usuários iniciais:', error);
        }

        cadastroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Evento de submit disparado em cadastro.');

            const novoUsuario = document.getElementById('cadastroUsuario').value.trim();
            const novaSenha = document.getElementById('cadastroSenha').value.trim();
            console.log('Dados inseridos:', { novoUsuario, novaSenha });

            if (!novoUsuario || !novaSenha) {
                alert('Preencha todos os campos!');
                console.log('Campos vazios.');
                return;
            }

            try {
                console.log('Verificando se usuário existe...');
                const usuarioExistente = await db.collection('usuarios')
                    .where('usuario', '==', novoUsuario)
                    .get();

                if (!usuarioExistente.empty) {
                    alert('Este usuário já existe!');
                    console.log('Usuário já existe:', novoUsuario);
                    return;
                }

                console.log('Salvando novo usuário...');
                await db.collection('usuarios').add({
                    usuario: novoUsuario,
                    senha: novaSenha,
                    cargo: 'comum'
                });
                console.log('Usuário cadastrado com sucesso:', novoUsuario);
                alert('Usuário cadastrado com sucesso! Faça login.');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Erro ao cadastrar. Veja o console.');
            }
        });
    });
}
