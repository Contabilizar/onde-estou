document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');

    // Criar usuário Admin automaticamente se não existir
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const adminExistente = usuarios.find(u => u.usuario === 'Admin');
    if (!adminExistente) {
        usuarios.push({ usuario: 'Admin', senha: '79695641', cargo: 'admin' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        console.log('Usuário Admin criado como administrador'); // Apenas para debug, não precisa ver isso
    }

    cadastroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const novoUsuario = document.getElementById('cadastroUsuario').value;
        const novaSenha = document.getElementById('cadastroSenha').value;
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

        if (usuarios.some(u => u.usuario === novoUsuario)) {
            alert('Este usuário já existe!');
            return;
        }

        usuarios.push({ usuario: novoUsuario, senha: novaSenha, cargo: 'comum' });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Usuário cadastrado com sucesso! Faça login.');
        window.location.href = 'index.html';
    });
});