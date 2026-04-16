document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // CONFIG API
  // =========================
  const API_URL = window.API_URL || "https://api.medflix-atestado24h.com.br";

  // =========================
  // SCROLL
  // =========================
  window.scrollToForm = function () {
    const el = document.getElementById('formSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // =========================
  // FORM
  // =========================
  const form = document.getElementById('form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome')?.value?.trim() || '';
      const cpf = document.getElementById('cpf')?.value?.trim() || '';
      const sintomas = document.getElementById('sintomas')?.value?.trim() || '';

      if (!nome || !cpf) {
        alert('Preencha nome e CPF.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/pedido`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome,
            cpf,
            sintomas,
            detalhes: sintomas,
            diasAfastamento: 1
          })
        });

        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Resposta não é JSON:", text);
          throw new Error("Erro na API");
        }

        if (!response.ok) {
          alert(data.mensagem || 'Erro ao criar pedido.');
          return;
        }

        // dados básicos do formulário
        localStorage.setItem('nome', nome);
        localStorage.setItem('cpf', cpf);
        localStorage.setItem('sintomas', sintomas);

        // novo payload do pedido
        localStorage.setItem('ultimoPedido', JSON.stringify({
          pedidoId: data.pedidoId,
          status: data.status,
          codigoValidacao: data.codigoValidacao,
          pdfUrl: data.pdfUrl,
          urlValidacao: data.urlValidacao,
          nome,
          cpf,
          sintomas
        }));

        localStorage.setItem('ultimoPedidoId', data.pedidoId);
        localStorage.setItem('ultimoPedidoStatus', data.status);
        localStorage.setItem('ultimoPedidoPdfUrl', data.pdfUrl || '');
        localStorage.setItem('ultimoPedidoCodigo', data.codigoValidacao || '');
        localStorage.setItem('ultimoPedidoValidacao', data.urlValidacao || '');

        window.location.href = 'requisicao.html';

      } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        alert('Não foi possível enviar o pedido agora.');
      }
    });
  }

  // =========================
  // ANIMAÇÃO
  // =========================
  const elements = document.querySelectorAll('.fade');

  window.addEventListener('scroll', () => {
    elements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 50) {
        el.classList.add('show');
      }
    });
  });

  // =========================
  // CONTADOR
  // =========================
  function atualizarContador() {
    const el = document.getElementById('contador');
    if (!el) return;

    const num = Math.floor(Math.random() * 20) + 80;
    el.innerText = `${num} pessoas solicitando agora`;
  }

  setInterval(atualizarContador, 3000);
  atualizarContador();

  // =========================
  // NOTIFICAÇÃO
  // =========================
  const nomes = ["Jorge","Maria","Lucas","Ana","Carlos","Fernanda"];
  const estados = ["SP","RJ","MG","BA","RS"];

  function mostrarNotificacao() {
    const el = document.getElementById('notificacao');
    const som = document.getElementById('somNotificacao');

    if (!el) return;

    const nome = nomes[Math.floor(Math.random() * nomes.length)];
    const estado = estados[Math.floor(Math.random() * estados.length)];

    el.innerText = `${nome} (${estado}) acabou de receber um atestado`;
    el.style.display = 'block';

    if (som) {
      som.currentTime = 0;
      som.play().catch(() => {});
    }

    setTimeout(() => {
      el.style.display = 'none';
    }, 4000);
  }

  setInterval(mostrarNotificacao, 5000);

  // =========================
  // VENDAS
  // =========================
  let vendas = 127;

  function atualizarVendas() {
    const el = document.getElementById('vendasNum');
    if (!el) return;

    vendas += Math.floor(Math.random() * 3);
    el.innerText = vendas;
  }

  setInterval(atualizarVendas, 5000);

  // =========================
  // CHAT
  // =========================
  const mensagens = [
    "Olá! Precisa de ajuda?",
    "Seu atestado sai em minutos 😉",
    "Pagamento via PIX é imediato"
  ];

  function atualizarChat() {
    const el = document.getElementById('chatMsg');
    if (!el) return;

    el.innerText = mensagens[Math.floor(Math.random() * mensagens.length)];
  }

  setInterval(atualizarChat, 4000);

  // =========================
  // FAQ
  // =========================
  document.querySelectorAll('.pergunta').forEach(p => {
    p.addEventListener('click', () => {
      const r = p.nextElementSibling;
      if (r) {
        r.style.display = r.style.display === 'block' ? 'none' : 'block';
      }
    });
  });

  // =========================
  // FILA
  // =========================
  let posicao = Math.floor(Math.random() * 10) + 8;

  function atualizarFila() {
    const el = document.getElementById('posicaoFila');
    if (!el) return;

    if (posicao > 1) posicao--;
    el.innerText = posicao;
  }

  setInterval(atualizarFila, 4000);

  // =========================
  // MÁSCARAS
  // =========================
  function mascaraCPF(v) {
    v = v.replace(/\D/g,'');
    v = v.replace(/(\d{3})(\d)/,'$1.$2');
    v = v.replace(/(\d{3})(\d)/,'$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');
    return v;
  }

  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', e => {
      e.target.value = mascaraCPF(e.target.value);
    });
  }

  // =========================
  // OPÇÕES
  // =========================
  document.querySelectorAll('.opcoes').forEach(container => {

    const isMulti = container.classList.contains('multi');

    container.querySelectorAll('.opcao').forEach(opcao => {

      opcao.addEventListener('click', () => {

        if (!isMulti) {
          container.querySelectorAll('.opcao')
            .forEach(o => o.classList.remove('ativa'));

          opcao.classList.add('ativa');
        } else {
          opcao.classList.toggle('ativa');
        }

      });

    });

  });

});