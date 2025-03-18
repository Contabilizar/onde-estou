let usuarioLogado = null;

document.addEventListener('DOMContentLoaded', () => {
    const solicitacaoForm = document.getElementById('solicitacaoForm');
    const solicitacoesLista = document.getElementById('solicitacoes');
    const logoutBtn = document.getElementById('logoutBtn');
    const gerenciamentoLink = document.getElementById('gerenciamentoLink');

    verificarSessao();

    solicitacaoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const destino = document.getElementById('destino').value;
        const motivo = document.getElementById('motivo').value;

        const solicitacao = {
            id: Date.now(),
            usuario: usuarioLogado.usuario,
            destino: destino,
            motivo: motivo,
            status: 'aberta',
            descricao: '',
            dataCriacao: new Date().toLocaleString('pt-BR')
        };

        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
        solicitacoes.push(solicitacao);
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));

        carregarSolicitacoes();
        solicitacaoForm.reset();
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
    carregarSolicitacoes();
}

function carregarSolicitacoes() {
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const solicitacoesLista = document.getElementById('solicitacoes');
    solicitacoesLista.innerHTML = '';

    solicitacoes.forEach((solicitacao, index) => {
        const li = document.createElement('li');
        li.classList.add('solicitacao-item');
        li.innerHTML = `
            <span>Solicitante: ${solicitacao.usuario}</span>
            <span>Destino: ${solicitacao.destino}</span>
            <span>Motivo: ${solicitacao.motivo}</span>
            <span class="status ${solicitacao.status}">${solicitacao.status === 'aberta' ? 'Aberta' : 'Finalizada'}</span>
            <span class="descricao">${solicitacao.descricao || 'Sem descrição'}</span>
            <span>Data: ${solicitacao.dataCriacao}</span>
        `;

        if (usuarioLogado.cargo === 'admin' || usuarioLogado.cargo === 'recepcionista') {
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('actions');

            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Atualizar';
            updateBtn.classList.add('update-solicitacao-btn');
            updateBtn.onclick = () => atualizarSolicitacao(index);
            actionsDiv.appendChild(updateBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Excluir';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.onclick = () => excluirSolicitacao(index);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(actionsDiv);
        }

        solicitacoesLista.appendChild(li);
    });
}

function atualizarSolicitacao(index) {
    const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
    const solicitacao = solicitacoes[index];

    const descricao = prompt('Descreva o ocorrido:', solicitacao.descricao);
    if (descricao === null) return;

    const status = confirm('A ligação foi concluída com sucesso? (OK para Finalizar, Cancelar para manter Aberta)') ? 'finalizada' : 'aberta';
    solicitacao.status = status;
    solicitacao.descricao = descricao;

    localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
    carregarSolicitacoes();
}

function excluirSolicitacao(index) {
    if (confirm('Tem certeza que deseja excluir esta solicitação?')) {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes') || '[]');
        solicitacoes.splice(index, 1);
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        carregarSolicitacoes();
    }
}

function logout() {
    localStorage.removeItem('sessao');
    window.location.href = 'index.html';
}