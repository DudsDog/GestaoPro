// ════════════════════════════════════════════════════════════
//  app.js — Inicialização e roteamento
// ════════════════════════════════════════════════════════════

const telaLogin    = document.getElementById('tela-login');
const appDiv       = document.getElementById('app');
const usuarioEmail = document.getElementById('usuario-email');
const toastEl      = document.getElementById('toast');

// ── Roteamento ────────────────────────────────────────────────
const navLinks = document.querySelectorAll('.nav-link');

function navegarPara(nome) {
  document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
  navLinks.forEach(l => l.classList.remove('ativo'));

  const secao = document.getElementById('secao-' + nome);
  if (secao) secao.classList.add('ativa');

  const link = document.querySelector(`.nav-link[data-secao="${nome}"]`);
  if (link) link.classList.add('ativo');

  // Carrega dados da seção ao navegar
  if (nome === 'clientes'      && typeof carregarClientes === 'function')      carregarClientes();
  if (nome === 'autorizacoes'  && typeof carregarAutorizacoes === 'function')  carregarAutorizacoes();
  if (nome === 'dashboard'     && typeof carregarDashboard === 'function')     carregarDashboard();
}

navLinks.forEach(link =>
  link.addEventListener('click', e => {
    e.preventDefault();
    navegarPara(link.dataset.secao);
  })
);

// ── Autenticação ─────────────────────────────────────────────
auth.onAuthStateChanged(user => {
  if (user) {
    telaLogin.hidden = true;
    appDiv.hidden = false;
    usuarioEmail.textContent = user.email;
    navegarPara('dashboard');
  } else {
    telaLogin.hidden = false;
    appDiv.hidden = true;
  }
});

// ── Toast ─────────────────────────────────────────────────────
let _toastTimer;
function mostrarToast(msg, tipo = '') {
  clearTimeout(_toastTimer);
  toastEl.textContent = msg;
  toastEl.className = 'visivel' + (tipo ? ' toast-' + tipo : '');
  _toastTimer = setTimeout(() => { toastEl.className = ''; }, 3500);
}

// ── Formatação ────────────────────────────────────────────────
function formatarMoeda(valor) {
  if (valor === undefined || valor === null || valor === '') return '—';
  // Se já é número, usa diretamente. Se é string BR ("40.436,64"), converte primeiro.
  const num = typeof valor === 'number'
    ? valor
    : parseFloat(String(valor).replace(/\./g, '').replace(',', '.'));
  if (isNaN(num)) return '—';
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
  if (!data) return '—';
  if (data && typeof data.toDate === 'function') data = data.toDate();
  if (data instanceof Date) return data.toLocaleDateString('pt-BR');
  return data;
}

function badgeStatus(status) {
  if (!status) return '';
  const slug = status.toLowerCase().replace(/\s+/g, '-');
  const labels = {
    proposta:   'Proposta',
    autorizada: 'Autorizada',
    faturada:   'Faturada',
    paga:       'Paga',
    cancelada:  'Cancelada',
    ativo:      'Ativo',
    inativo:    'Inativo',
    prospect:   'Prospect',
  };
  return `<span class="badge badge-${slug}">${labels[slug] || status}</span>`;
}

// ── Máscara de celular ────────────────────────────────────────
function formatarCelular(str) {
  if (!str) return '';
  const v = String(str).replace(/\D/g, '').slice(0, 11);
  if (v.length > 6) return '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
  if (v.length > 2) return '(' + v.slice(0,2) + ') ' + v.slice(2);
  if (v.length > 0) return '(' + v;
  return '';
}

function mascararCNPJ(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 14);
  if (v.length > 12) v = v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8,12)+'-'+v.slice(12);
  else if (v.length > 8) v = v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5,8)+'/'+v.slice(8);
  else if (v.length > 5) v = v.slice(0,2)+'.'+v.slice(2,5)+'.'+v.slice(5);
  else if (v.length > 2) v = v.slice(0,2)+'.'+v.slice(2);
  input.value = v;
}

function mascararCelular(input) {
  const pos = input.selectionStart;
  const antes = input.value.length;
  input.value = formatarCelular(input.value);
  const delta = input.value.length - antes;
  input.setSelectionRange(pos + delta, pos + delta);
}

// ── Utilitários ───────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function criarModal(id, titulo, conteudo, rodape) {
  fecharModal(id);
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'overlay-' + id;
  overlay.innerHTML = `
    <div class="modal" id="modal-${id}" role="dialog" aria-modal="true" aria-labelledby="modal-titulo-${id}">
      <div class="modal-header">
        <h3 id="modal-titulo-${id}">${titulo}</h3>
        <button class="modal-fechar" onclick="fecharModal('${id}')" aria-label="Fechar">&times;</button>
      </div>
      <div class="modal-corpo">${conteudo}</div>
      <div class="modal-rodape">${rodape}</div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) fecharModal(id); });
  document.body.appendChild(overlay);
}

function fecharModal(id) {
  const el = document.getElementById('overlay-' + id);
  if (el) el.remove();
}
