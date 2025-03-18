document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    const sessao = JSON.parse(localStorage.getItem('sessao') || '{}');
    if (sessao.usuario && sessao.expiracao > Date.now()) {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const usuario = document.getElementById('loginUsuario').value;
        const senha = document.getElementById('loginSenha').value;
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        const usuarioValido = usuarios.find(u => u.usuario === usuario && u.senha === senha);
        if (usuarioValido) {
            localStorage.setItem('sessao', JSON.stringify({
                usuario: usuarioValido.usuario,
                expiracao: Date.now() + 3600000
            }));
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha inválidos!');
        }
    });
});