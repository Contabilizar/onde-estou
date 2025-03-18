let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('atividadeForm');
    const lista = document.getElementById('atividades');
    const logoutBtn = document.getElementById('logoutBtn');
    const gerenciamentoLink = document.getElementById('gerenciamentoLink');

    verificarSessao();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const atividade = document.getElementById('atividade').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;

        const dataFormatada = new Date(data).toLocaleDateString('pt-BR');
        const textoAtividade = `${usuarioLogado.usuario} irá fazer ${atividade} em ${dataFormatada} às ${hora}`;

        const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
        atividadesSalvas.push(textoAtividade);
        localStorage.setItem('atividades', JSON.stringify(atividadesSalvas));

        carregarAtividades();
        form.reset();
    });

    logoutBtn.addEventListener('click', logout);
});

function verificarSessao() {
    const sessao = JSON.parse(localStorage.getItem('sessao') || '{}');
    if (!sessao.usuario || sessao.expiracao <= Date.now()) {
        window.location.href = 'index.html';
        return;
    }
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    usuarioLogado = usuarios.find(u => u.usuario === sessao.usuario);
    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return;
    }
    if (usuarioLogado.cargo === 'admin') {
        document.getElementById('gerenciamentoLink').classList.remove('hidden');
    }
    carregarAtividades();
}

function carregarAtividades() {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
    const lista = document.getElementById('atividades');
    lista.innerHTML = '';
    atividadesSalvas.forEach((atividade, index) => {
        const li = document.createElement('li');
        li.textContent = atividade;
        if (usuarioLogado.cargo === 'admin') {
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => excluirAtividade(index);
            li.appendChild(deleteBtn);
        }
        lista.appendChild(li);
    });
}

function excluirAtividade(index) {
    const atividadesSalvas = JSON.parse(localStorage.getItem('atividades') || '[]');
    atividadesSalvas.splice(index, 1);
    localStorage.setItem('atividades', JSON.stringify(atividadesSalvas));
    carregarAtividades();
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}