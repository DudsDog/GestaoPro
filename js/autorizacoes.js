// ════════════════════════════════════════════════════════════
//  autorizacoes.js — Autorizações de Veiculação (PR)
// ════════════════════════════════════════════════════════════

let _autorizacoesListener    = null;
let _autorizacoesCache       = [];
let _registrosPendentes      = [];
let _contadorInicializado    = false;
let _sortColuna              = '';
let _sortDirecao             = 'asc';

const MESES_NUM = {
  'Janeiro':1,'Fevereiro':2,'Março':3,'Abril':4,'Maio':5,'Junho':6,
  'Julho':7,'Agosto':8,'Setembro':9,'Outubro':10,'Novembro':11,'Dezembro':12
};

// ── Numeração automática de PR ────────────────────────────────
function parsearNumeroPR(str) {
  if (!str) return null;
  const m = str.match(/PR\s+(\d+)\/(\d{2})/i);
  return m ? { numero: parseInt(m[1]), ano: m[2] } : null;
}

async function inicializarContadorPR() {
  const anoAtual = new Date().getFullYear().toString().slice(-2);
  const ref = db.collection('contadores').doc('pr');
  const doc = await ref.get();
  if (doc.exists && doc.data().ano === anoAtual) return; // já existe para este ano

  // Encontra o maior nº PR do ano atual nos registros importados
  let maxNumero = 0;
  _autorizacoesCache.forEach(a => {
    const p = parsearNumeroPR(a.numeroPR);
    if (p && p.ano === anoAtual) maxNumero = Math.max(maxNumero, p.numero);
  });

  await ref.set({ ultimo: maxNumero, ano: anoAtual });
  console.log(`Contador PR inicializado: ${maxNumero} (ano ${anoAtual})`);
}

async function gerarNumeroPR() {
  const anoAtual = new Date().getFullYear().toString().slice(-2);

  // Consulta o Firestore diretamente para garantir dados atualizados,
  // independente do estado do cache local.
  const snap = await db.collection('autorizacoes').get();
  let maxNumero = 0;
  snap.docs.forEach(d => {
    const p = parsearNumeroPR(d.data().numeroPR);
    if (p && p.ano === anoAtual) maxNumero = Math.max(maxNumero, p.numero);
  });

  const proximo = maxNumero + 1;
  return `PR ${String(proximo).padStart(3, '0')}/${anoAtual}`;
}

// ── Carregamento ──────────────────────────────────────────────
function carregarAutorizacoes() {
  if (_autorizacoesListener) { filtrarAutorizacoes(); return; }

  document.getElementById('autorizacoes-lista').innerHTML =
    '<div class="carregando">Carregando autorizações…</div>';

  _autorizacoesListener = db.collection('autorizacoes')
    .orderBy('data', 'desc')
    .onSnapshot(snap => {
      _autorizacoesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (!_contadorInicializado) {
        _contadorInicializado = true;
        inicializarContadorPR().catch(console.error);
      }
      atualizarFiltroCliente();
      atualizarFiltroAno();
      filtrarAutorizacoes();
    }, err => {
      document.getElementById('autorizacoes-lista').innerHTML =
        '<div class="vazio">Erro ao carregar autorizações.</div>';
      console.error(err);
    });

  document.getElementById('filtro-cliente-autorizacoes')
    .addEventListener('change', filtrarAutorizacoes);
  document.getElementById('filtro-ano-autorizacoes')
    .addEventListener('change', filtrarAutorizacoes);
  document.getElementById('filtro-status-autorizacoes')
    .addEventListener('change', filtrarAutorizacoes);
}

function atualizarFiltroCliente() {
  const sel = document.getElementById('filtro-cliente-autorizacoes');
  if (!sel) return;
  const valorAtual = sel.value;
  const clientes = [...new Set(_autorizacoesCache
    .map(a => a.clienteNome).filter(Boolean)
  )].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  sel.innerHTML = '<option value="">Todos os clientes</option>' +
    clientes.map(c =>
      `<option value="${escapeHtml(c)}"${c === valorAtual ? ' selected' : ''}>${escapeHtml(c)}</option>`
    ).join('');
}

function atualizarFiltroAno() {
  const sel = document.getElementById('filtro-ano-autorizacoes');
  if (!sel) return;
  const valorAtual = sel.value;
  const anos = [...new Set(_autorizacoesCache
    .map(a => a.anoReferencia).filter(Boolean)
  )].sort().reverse();
  sel.innerHTML = '<option value="">Todos os anos</option>' +
    anos.map(a => `<option value="${a}"${a === valorAtual ? ' selected' : ''}>${a}</option>`).join('');
}

function filtrarAutorizacoes() {
  const cliente = document.getElementById('filtro-cliente-autorizacoes').value;
  const ano     = document.getElementById('filtro-ano-autorizacoes').value;
  const status  = document.getElementById('filtro-status-autorizacoes').value;
  const lista   = _autorizacoesCache.filter(a => {
    const ok1 = !cliente || a.clienteNome === cliente;
    const ok2 = !ano     || a.anoReferencia === ano;
    const ok3 = !status  || a.status === status;
    return ok1 && ok2 && ok3;
  });
  renderizarAutorizacoes(lista);
}

// ── Ordenação ────────────────────────────────────────────────
function ordenarPor(coluna) {
  if (_sortColuna === coluna) {
    _sortDirecao = _sortDirecao === 'asc' ? 'desc' : 'asc';
  } else {
    _sortColuna  = coluna;
    _sortDirecao = 'asc';
  }
  filtrarAutorizacoes();
}

function valorOrdenacao(a, col) {
  switch (col) {
    case 'clienteNome':   return (a.clienteNome  || '').toLowerCase();
    case 'piPoAf':        return (a.piPoAf        || '').toLowerCase();
    case 'valorBruto':    return a.valorBruto  || 0;
    case 'valor':         return a.valor        || 0;
    case 'mesReferencia': return MESES_NUM[a.mesReferencia] || 0;
    case 'anoReferencia': return parseInt(a.anoReferencia) || 0;
    case 'nf':            return (a.nf            || '').toLowerCase();
    case 'dataEmissaoNF': return a.dataEmissaoNF  ? a.dataEmissaoNF.seconds  : 0;
    case 'dataPagamento': return a.dataPagamento  ? a.dataPagamento.seconds  : 0;
    case 'numeroPR':      return _sortKeyPR(a.numeroPR);
    case 'descricao':     return (a.descricao || a.produto || '').toLowerCase();
    case 'agencia':       return (a.agencia       || '').toLowerCase();
    case 'status':        return a.status          || '';
    case 'dataPostagem':  return a.dataPostagem    ? a.dataPostagem.seconds   : 0;
    default:              return a.data            ? a.data.seconds           : 0;
  }
}

function _sortKeyPR(str) {
  if (!str) return 0;
  const m = str.match(/PR\s*(\d+)\/(\d{2})/i);
  if (!m) return 0;
  return parseInt(m[2]) * 100000 + parseInt(m[1]); // ano*100000 + nº
}

function _thSort(col, label) {
  const ativo = _sortColuna === col;
  const seta  = ativo ? (_sortDirecao === 'asc' ? ' ▲' : ' ▼') : '';
  return `<th class="th-sortable${ativo ? ' th-sort-ativo' : ''}"
    onclick="ordenarPor('${col}')">${label}${seta}</th>`;
}

// ── Renderização ─────────────────────────────────────────────
function renderizarAutorizacoes(lista) {
  const el = document.getElementById('autorizacoes-lista');
  if (!lista.length) {
    document.getElementById('autorizacoes-totais').hidden = true;
    el.innerHTML = '<div class="vazio">Nenhuma autorização encontrada.</div>';
    return;
  }

  // Totalizadores
  const totalBruto = lista.reduce((s, a) => s + (a.valorBruto || 0), 0);
  const totalLiq   = lista.reduce((s, a) => s + (a.valor      || 0), 0);
  const elTotais   = document.getElementById('autorizacoes-totais');
  elTotais.hidden  = false;
  elTotais.innerHTML = `
    <span class="total-label">${lista.length} registro${lista.length !== 1 ? 's' : ''}</span>
    <span class="total-sep">|</span>
    <span class="total-item">
      <span class="total-nome">Val. Bruto</span>
      <strong class="total-valor">${formatarMoeda(totalBruto)}</strong>
    </span>
    <span class="total-sep">|</span>
    <span class="total-item">
      <span class="total-nome">Val. Líquido</span>
      <strong class="total-valor">${formatarMoeda(totalLiq)}</strong>
    </span>`;

  const d  = v  => escapeHtml(v || '—');
  const dt = ts => ts ? formatarData(ts) : '—';
  const mo = v  => v != null ? formatarMoeda(v) : '—';

  // Aplica ordenação
  const sorted = _sortColuna ? [...lista].sort((a, b) => {
    const va = valorOrdenacao(a, _sortColuna);
    const vb = valorOrdenacao(b, _sortColuna);
    const cmp = typeof va === 'string' ? va.localeCompare(vb, 'pt-BR') : va - vb;
    return _sortDirecao === 'asc' ? cmp : -cmp;
  }) : lista;

  el.innerHTML = `
    <div class="tabela-wrapper">
      <table class="tabela-autorizacoes">
        <thead>
          <tr>
            ${_thSort('clienteNome',   'Cliente')}
            ${_thSort('piPoAf',        'PI/PO/AF')}
            ${_thSort('valorBruto',    'Val. Bruto')}
            ${_thSort('valor',         'Val. Líquido')}
            ${_thSort('mesReferencia', 'Mês Ref.')}
            ${_thSort('anoReferencia', 'Ano')}
            ${_thSort('nf',            'NF')}
            ${_thSort('dataEmissaoNF', 'Dt. Emissão NF')}
            ${_thSort('dataPagamento', 'Dt. Pagamento')}
            ${_thSort('numeroPR',      'Nº PR / Proposta')}
            ${_thSort('descricao',     'Descrição / Campanha')}
            ${_thSort('agencia',       'Agência')}
            <th>Contato</th>
            <th>Conta</th>
            <th>Cliente (detalhe)</th>
            <th>Responsável</th>
            <th>E-mail</th>
            <th>Quantidade</th>
            <th>Meio Pagamento</th>
            ${_thSort('dataPostagem',  'Dt. Postagem')}
            ${_thSort('status',        'Status')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(a => `
            <tr>
              <td class="nowrap"><strong>${d(a.clienteNome)}</strong></td>
              <td class="nowrap text-sm">${d(a.piPoAf)}</td>
              <td class="td-valor text-sm">${mo(a.valorBruto)}</td>
              <td class="td-valor text-sm">${mo(a.valor)}</td>
              <td class="text-sm">${d(a.mesReferencia)}</td>
              <td class="text-sm">${d(a.anoReferencia)}</td>
              <td class="text-sm">${d(a.nf)}</td>
              <td class="nowrap text-sm">${dt(a.dataEmissaoNF)}</td>
              <td class="nowrap text-sm">${dt(a.dataPagamento)}</td>
              <td class="nowrap text-sm">${d(a.numeroPR)}</td>
              <td class="text-sm td-descricao">${d(a.descricao || a.produto)}</td>
              <td class="text-sm">${d(a.agencia)}</td>
              <td class="text-sm">${d(a.contato)}</td>
              <td class="text-sm">${d(a.conta)}</td>
              <td class="text-sm">${d(a.clienteDetalhe)}</td>
              <td class="text-sm">${d(a.responsavel)}</td>
              <td class="text-sm">${d(a.emailContato)}</td>
              <td class="text-sm">${d(a.quantidade)}</td>
              <td class="text-sm">${d(a.meioPagamento)}</td>
              <td class="nowrap text-sm">${dt(a.dataPostagem)}</td>
              <td>${badgeStatus(a.status || 'Autorizada')}</td>
              <td class="td-acoes">
                <button class="btn btn-outline btn-sm"
                  onclick="selecionarProdutoPDF('${a.id}')">PDF</button>
                <button class="btn btn-outline btn-sm"
                  onclick="abrirModalAutorizacao('${a.id}')">Editar</button>
                <button class="btn btn-perigo btn-sm"
                  onclick="confirmarExcluirAutorizacao('${a.id}','${escapeHtml(a.piPoAf||a.numeroPR||'esta PR')}')">Excluir</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-sm text-muted mt-3">
      ${lista.length} autorização${lista.length !== 1 ? 'ões' : ''} encontrada${lista.length !== 1 ? 's' : ''}
    </p>`;
}

// ── Modal com abas ────────────────────────────────────────────
async function abrirModalAutorizacao(id) {
  const base   = id ? (_autorizacoesCache.find(x => x.id === id) || {}) : {};
  const a      = Object.assign({}, base);
  const titulo = id ? 'Editar Autorização' : 'Nova Autorização de Veiculação';

  const v     = campo => escapeHtml(a[campo] || '');
  const selSt = val   => (a.status || 'Autorizada') === val ? 'selected' : '';

  const clientes = _clientesCache.length
    ? _clientesCache
    : await db.collection('clientes').orderBy('nomeFantasia').get()
        .then(s => s.docs.map(d => ({ id: d.id, ...d.data() })));

  const optsClientes = clientes.map(c =>
    `<option value="${c.id}" data-nome="${escapeHtml(c.nomeFantasia||'')}"
      ${a.clienteId === c.id ? 'selected' : ''}>${escapeHtml(c.nomeFantasia||'')}</option>`
  ).join('');

  const optsM = Object.keys(MESES_NUM).map(m =>
    `<option value="${m}" ${a.mesReferencia===m?'selected':''}>${m}</option>`).join('');

  const corpo = `
    <div class="form-tabs" id="form-tabs-aut">
      <button type="button" class="form-tab ativo"
        onclick="mudarTabAut(this,'ftab-aut-id')">Identificação</button>
      <button type="button" class="form-tab"
        onclick="mudarTabAut(this,'ftab-aut-fin')">Financeiro</button>
      <button type="button" class="form-tab"
        onclick="mudarTabAut(this,'ftab-aut-camp')">Campanha</button>
      <button type="button" class="form-tab"
        onclick="mudarTabAut(this,'ftab-aut-cont')">Agência / Contato</button>
    </div>

    <form id="form-autorizacao" onsubmit="return false">

      <!-- Identificação -->
      <div id="ftab-aut-id" class="tab-painel form-grid">
        <div class="campo campo-full">
          <label>Cliente *</label>
          <select name="clienteId" id="sel-cliente-pr" required>
            <option value="">— selecione —</option>${optsClientes}
          </select>
        </div>
        <div class="campo">
          <label>PI / PO / AF</label>
          <input type="text" name="piPoAf" value="${v('piPoAf')}"
            placeholder="Nº interno do cliente">
        </div>
        <div class="campo">
          <label>Nº PR / Proposta</label>
          <input type="text" name="numeroPR" value="${v('numeroPR')}"
            placeholder="${id ? 'PR 001/26' : 'Gerado automaticamente ao salvar'}">
          ${!id ? '<span class="campo-dica">O número será reservado apenas ao salvar.</span>' : ''}
        </div>
        <div class="campo">
          <label>Mês Referência</label>
          <select name="mesReferencia">
            <option value="">—</option>${optsM}
          </select>
        </div>
        <div class="campo">
          <label>Ano</label>
          <input type="text" name="anoReferencia" value="${v('anoReferencia') || new Date().getFullYear()}"
            placeholder="${new Date().getFullYear()}" maxlength="4">
        </div>
        <div class="campo">
          <label>Status</label>
          <select name="status">
            <option value="Proposta"   ${selSt('Proposta')}>Proposta</option>
            <option value="Autorizada" ${selSt('Autorizada')}>Autorizada</option>
            <option value="Faturada"   ${selSt('Faturada')}>Faturada</option>
            <option value="Paga"       ${selSt('Paga')}>Paga</option>
            <option value="Cancelada"  ${selSt('Cancelada')}>Cancelada</option>
          </select>
        </div>
      </div>

      <!-- Financeiro -->
      <div id="ftab-aut-fin" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Valor Bruto (R$)</label>
          <input type="text" name="valorBrutoTexto"
            value="${a.valorBruto != null ? formatarMoedaInput(a.valorBruto) : ''}"
            placeholder="0,00" inputmode="decimal">
        </div>
        <div class="campo">
          <label>Valor Líquido (R$)</label>
          <input type="text" name="valorTexto"
            value="${a.valor != null ? formatarMoedaInput(a.valor) : ''}"
            placeholder="0,00" inputmode="decimal">
        </div>
        <div class="campo">
          <label>NF</label>
          <input type="text" name="nf" value="${v('nf')}"
            placeholder="Número da nota fiscal">
        </div>
        <div class="campo">
          <label>Data Emissão NF</label>
          <input type="date" name="dataEmissaoNF"
            value="${a.dataEmissaoNF ? tsParaInputDate(a.dataEmissaoNF) : ''}">
        </div>
        <div class="campo">
          <label>Data de Pagamento</label>
          <input type="date" name="dataPagamento"
            value="${a.dataPagamento ? tsParaInputDate(a.dataPagamento) : ''}">
        </div>
        <div class="campo">
          <label>Meio de Pagamento</label>
          <input type="text" name="meioPagamento" value="${v('meioPagamento')}"
            placeholder="PIX, Transferência, Boleto…">
        </div>
      </div>

      <!-- Campanha -->
      <div id="ftab-aut-camp" class="tab-painel form-grid" hidden>
        <div class="campo campo-full">
          <label>Descrição / Campanha</label>
          <textarea name="descricao" rows="4">${escapeHtml(a.descricao || a.produto || '')}</textarea>
        </div>
        <div class="campo">
          <label>Quantidade</label>
          <input type="text" name="quantidade" value="${v('quantidade')}">
        </div>
        <div class="campo">
          <label>Data da Postagem</label>
          <input type="date" name="dataPostagem"
            value="${a.dataPostagem ? tsParaInputDate(a.dataPostagem) : ''}">
        </div>
        <div class="campo campo-full">
          <label>Observações</label>
          <textarea name="observacoes" rows="2">${escapeHtml(a.observacoes || '')}</textarea>
        </div>
      </div>

      <!-- Agência / Contato -->
      <div id="ftab-aut-cont" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Agência</label>
          <input type="text" name="agencia" value="${v('agencia')}">
        </div>
        <div class="campo">
          <label>Contato</label>
          <input type="text" name="contato" value="${v('contato')}">
        </div>
        <div class="campo">
          <label>Conta</label>
          <input type="text" name="conta" value="${v('conta')}">
        </div>
        <div class="campo">
          <label>Cliente (detalhe)</label>
          <input type="text" name="clienteDetalhe" value="${v('clienteDetalhe')}">
        </div>
        <div class="campo">
          <label>Responsável</label>
          <input type="text" name="responsavel" value="${v('responsavel')}">
        </div>
        <div class="campo">
          <label>E-mail</label>
          <input type="email" name="emailContato" value="${v('emailContato')}">
        </div>
      </div>

    </form>`;

  criarModal('autorizacao', titulo, corpo,
    `<button class="btn btn-secundario" onclick="fecharModal('autorizacao')">Cancelar</button>
     <button class="btn btn-primario" onclick="salvarAutorizacao('${id||''}')">Salvar</button>`);
}

function mudarTabAut(btn, painelId) {
  document.querySelectorAll('#form-tabs-aut .form-tab')
    .forEach(t => t.classList.remove('ativo'));
  document.querySelectorAll('#form-autorizacao .tab-painel')
    .forEach(p => { p.hidden = true; });
  btn.classList.add('ativo');
  document.getElementById(painelId).hidden = false;
}

// ── Salvar ────────────────────────────────────────────────────
async function salvarAutorizacao(id) {
  const form = document.getElementById('form-autorizacao');
  const selCliente = document.getElementById('sel-cliente-pr');

  if (!selCliente.value) {
    document.querySelector('#form-tabs-aut .form-tab').click();
    selCliente.focus();
    mostrarToast('Selecione um cliente.', 'erro');
    return;
  }

  const clienteOpt   = selCliente.options[selCliente.selectedIndex];
  const clienteNome  = clienteOpt.dataset.nome || clienteOpt.text;
  const mes          = form.querySelector('[name="mesReferencia"]').value;
  const ano          = form.querySelector('[name="anoReferencia"]').value || String(new Date().getFullYear());
  const dataEmStr    = form.querySelector('[name="dataEmissaoNF"]').value;
  const dataOrdem    = dataEmStr
    ? inputDateParaTimestamp(dataEmStr)
    : (primeiroDiaMes(mes, ano) || firebase.firestore.Timestamp.fromDate(new Date()));

  // Gera número PR se for novo registro e o campo estiver vazio
  let numeroPR = form.querySelector('[name="numeroPR"]').value.trim();
  if (!id && !numeroPR) {
    try { numeroPR = await gerarNumeroPR(); } catch (err) { console.error(err); }
  }

  const dados = {
    clienteId:     selCliente.value,
    clienteNome,
    piPoAf:        form.querySelector('[name="piPoAf"]').value.trim(),
    numeroPR,
    mesReferencia: mes,
    anoReferencia: ano,
    status:        form.querySelector('[name="status"]').value,
    valorBruto:    parsearValor(form.querySelector('[name="valorBrutoTexto"]').value),
    valor:         parsearValor(form.querySelector('[name="valorTexto"]').value),
    nf:            form.querySelector('[name="nf"]').value.trim(),
    dataEmissaoNF: inputDateParaTimestamp(dataEmStr),
    dataPagamento: inputDateParaTimestamp(form.querySelector('[name="dataPagamento"]').value),
    meioPagamento: form.querySelector('[name="meioPagamento"]').value.trim(),
    descricao:     form.querySelector('[name="descricao"]').value.trim(),
    quantidade:    form.querySelector('[name="quantidade"]').value.trim(),
    dataPostagem:  inputDateParaTimestamp(form.querySelector('[name="dataPostagem"]').value),
    observacoes:   form.querySelector('[name="observacoes"]').value.trim(),
    agencia:       form.querySelector('[name="agencia"]').value.trim(),
    contato:       form.querySelector('[name="contato"]').value.trim(),
    conta:         form.querySelector('[name="conta"]').value.trim(),
    clienteDetalhe: form.querySelector('[name="clienteDetalhe"]').value.trim(),
    responsavel:   form.querySelector('[name="responsavel"]').value.trim(),
    emailContato:  form.querySelector('[name="emailContato"]').value.trim(),
    data:          dataOrdem,
  };

  const btnSalvar = document.querySelector('#overlay-autorizacao .btn-primario');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando…';

  try {
    if (id) {
      await db.collection('autorizacoes').doc(id).update(dados);
      mostrarToast('Autorização atualizada!', 'sucesso');
    } else {
      dados.criadoEm = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('autorizacoes').add(dados);
      mostrarToast('Autorização cadastrada!', 'sucesso');
    }
    fecharModal('autorizacao');
  } catch (err) {
    mostrarToast('Erro ao salvar autorização.', 'erro');
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
    console.error(err);
  }
}

// ── Excluir ───────────────────────────────────────────────────
function confirmarExcluirAutorizacao(id, label) {
  criarModal('confirmar-pr', 'Excluir Autorização',
    `<p>Tem certeza que deseja excluir <strong>${escapeHtml(label)}</strong>?</p>
     <p class="text-sm text-muted mt-3">Esta ação não pode ser desfeita.</p>`,
    `<button class="btn btn-secundario" onclick="fecharModal('confirmar-pr')">Cancelar</button>
     <button class="btn btn-perigo" onclick="excluirAutorizacao('${id}')">Excluir</button>`
  );
}

async function excluirAutorizacao(id) {
  try {
    await db.collection('autorizacoes').doc(id).delete();
    mostrarToast('Autorização excluída.', 'sucesso');
    fecharModal('confirmar-pr');
  } catch (err) {
    mostrarToast('Erro ao excluir autorização.', 'erro');
    console.error(err);
  }
}

// ── Helpers de data ───────────────────────────────────────────
function hoje() {
  return new Date().toISOString().slice(0, 10);
}

function tsParaInputDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toISOString().slice(0, 10);
}

function inputDateParaTimestamp(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return firebase.firestore.Timestamp.fromDate(new Date(y, m - 1, d));
}

function parsearDataBR(str) {
  if (!str) return null;
  str = String(str).trim();
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const d = parseInt(m[1]), mes = parseInt(m[2]), ano = parseInt(m[3]);
  if (d < 1 || d > 31 || mes < 1 || mes > 12) return null;
  try {
    return firebase.firestore.Timestamp.fromDate(new Date(ano, mes - 1, d));
  } catch { return null; }
}

function primeiroDiaMes(mes, ano) {
  const m = MESES_NUM[mes];
  const y = parseInt(ano);
  if (!m || !y) return null;
  return firebase.firestore.Timestamp.fromDate(new Date(y, m - 1, 1));
}

function formatarMoedaInput(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
}

function parsearValor(str) {
  if (!str) return null;
  str = String(str).replace(/[R$\s]/g, '').trim();
  if (!str) return null;

  const temPonto  = str.includes('.');
  const temVirgula = str.includes(',');
  let limpo;

  if (temPonto && temVirgula) {
    // Formato BR completo: 40.436,64 → ponto=milhar, vírgula=decimal
    limpo = str.replace(/\./g, '').replace(',', '.');
  } else if (temVirgula) {
    // Só vírgula: 40436,64 → vírgula=decimal
    limpo = str.replace(',', '.');
  } else if (temPonto) {
    const partes = str.split('.');
    const dec    = partes[partes.length - 1];
    // Ponto único com exatamente 2 casas → decimal (formato inglês: 40436.64)
    // Ponto(s) com 3 casas → separador de milhar: 40.000 → 40000
    if (partes.length === 2 && dec.length <= 2) {
      limpo = str;
    } else {
      limpo = str.replace(/\./g, '');
    }
  } else {
    limpo = str;
  }

  const n = parseFloat(limpo);
  return isNaN(n) ? null : n;
}

// ── Apagar todos ─────────────────────────────────────────────
function confirmarApagarTodas() {
  const total = _autorizacoesCache.length;
  criarModal('confirmar-apagar', 'Apagar todos os registros',
    `<p>Tem certeza que deseja apagar <strong>todos os ${total} registros</strong> de autorizações?</p>
     <p class="text-sm text-muted mt-3">Esta ação <strong>não pode ser desfeita</strong>.</p>`,
    `<button class="btn btn-secundario" onclick="fecharModal('confirmar-apagar')">Cancelar</button>
     <button class="btn btn-perigo" id="btn-apagar-tudo" onclick="apagarTodasAutorizacoes()">Apagar todos</button>`
  );
}

async function apagarTodasAutorizacoes() {
  const btn = document.getElementById('btn-apagar-tudo');
  btn.disabled = true;
  btn.textContent = 'Apagando…';
  try {
    let total = 0;
    let snap;
    do {
      snap = await db.collection('autorizacoes').limit(499).get();
      if (snap.empty) break;
      const batch = db.batch();
      snap.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      total += snap.docs.length;
    } while (snap.docs.length >= 499);

    mostrarToast(`${total} autorizações apagadas.`, 'sucesso');
    fecharModal('confirmar-apagar');
  } catch (err) {
    mostrarToast('Erro ao apagar registros.', 'erro');
    btn.disabled = false;
    btn.textContent = 'Apagar todos';
    console.error(err);
  }
}

// ── Exportação do CSV ────────────────────────────────────────
function exportarCSVAutorizacoes() {
  const cliente = document.getElementById('filtro-cliente-autorizacoes').value;
  const ano     = document.getElementById('filtro-ano-autorizacoes').value;
  const status  = document.getElementById('filtro-status-autorizacoes').value;

  const lista = _autorizacoesCache.filter(a => {
    const ok1 = !cliente || a.clienteNome === cliente;
    const ok2 = !ano     || a.anoReferencia === ano;
    const ok3 = !status  || a.status === status;
    return ok1 && ok2 && ok3;
  });

  if (!lista.length) { mostrarToast('Nenhum registro para exportar.', 'aviso'); return; }

  const fmtData = ts => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('pt-BR');
  };
  const fmtVal = v => (v != null && !isNaN(v)) ? Number(v).toFixed(2).replace('.', ',') : '';

  const cabecalho = [
    'Cliente','PI/PO/AF','Valor Bruto','Valor Líquido','Mês Ref.','Ano',
    'NF','Dt. Emissão NF','Dt. Pagamento','Nº PR','Descrição','Agência',
    'Contato','Conta','Detalhe Cliente','Responsável','E-mail Contato',
    'Quantidade','Meio Pagamento','Dt. Postagem','Status'
  ];

  const linhas = lista.map(a => [
    a.clienteNome      || '',
    a.piPoAf           || '',
    fmtVal(a.valorBruto),
    fmtVal(a.valor),
    a.mesReferencia    || '',
    a.anoReferencia    || '',
    a.nf               || '',
    fmtData(a.dataEmissaoNF),
    fmtData(a.dataPagamento),
    a.numeroPR         || '',
    a.descricao        || '',
    a.agencia          || '',
    a.contato          || '',
    a.conta            || '',
    a.clienteDetalhe   || '',
    a.responsavel      || '',
    a.emailContato     || '',
    a.quantidade       || '',
    a.meioPagamento    || '',
    fmtData(a.dataPostagem),
    a.status           || '',
  ].map(v => '"' + String(v).replace(/"/g, '""') + '"'));

  const csv = '﻿' + [cabecalho, ...linhas].map(r => r.join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  const sufixo  = [cliente, ano, status].filter(Boolean).join('_') || 'todas';
  link.download = 'autorizacoes_' + sufixo + '.csv';
  link.click();
  URL.revokeObjectURL(url);
  mostrarToast(`${lista.length} registro(s) exportado(s).`, 'sucesso');
}

// ── Importação do CSV ─────────────────────────────────────────
function abrirModalImportarCSV() {
  _registrosPendentes = [];
  criarModal('importar-csv', 'Importar Histórico de Autorizações',
    `<p class="text-sm mb-3">
       Selecione o arquivo CSV com o histórico. Separador: <strong>ponto-e-vírgula (;)</strong>.
     </p>
     <div class="aviso-alerta mb-3">
       ⚠️ Execute a importação apenas uma vez para evitar duplicatas.
       Os registros existentes não serão apagados.
     </div>
     <div class="campo campo-full">
       <label>Arquivo CSV</label>
       <input type="file" id="input-csv-aut" accept=".csv,.txt"
         onchange="previsualizarCSVAut(this)">
     </div>
     <div id="csv-preview-aut" class="mt-3"></div>`,
    `<button class="btn btn-secundario" onclick="fecharModal('importar-csv')">Cancelar</button>
     <button class="btn btn-primario" id="btn-exec-import" disabled
       onclick="iniciarImportacaoAut()">Importar</button>`
  );
}

function lerArquivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsText(file, 'windows-1252');
  });
}

async function previsualizarCSVAut(input) {
  const file = input.files[0];
  if (!file) return;
  const preview = document.getElementById('csv-preview-aut');
  preview.innerHTML = '<p class="text-sm text-muted">Analisando arquivo…</p>';
  try {
    const text = await lerArquivo(file);
    _registrosPendentes = parsearCSVAutorizacoes(text);

    const clientes    = [...new Set(_registrosPendentes.map(r => r.clienteNomeCSV))].sort();
    const totalBruto  = _registrosPendentes.reduce((s, r) => s + (r.valorBruto || 0), 0);
    const totalLiq    = _registrosPendentes.reduce((s, r) => s + (r.valor      || 0), 0);
    const amostra     = _registrosPendentes.slice(0, 5);

    // Lê as primeiras linhas brutas para comparação
    const linhasBrutas = text.replace(/^﻿/, '').split(/\r?\n/).slice(1, 6);

    preview.innerHTML = `
      <div class="import-resumo">
        <span class="badge badge-autorizada">${_registrosPendentes.length} registros</span>
        <span class="badge badge-ativo">${clientes.length} clientes únicos</span>
      </div>

      <div class="import-totais-preview">
        <span>Val. Bruto total: <strong>${formatarMoeda(totalBruto)}</strong>
          <small style="color:#64748b">(${totalBruto.toLocaleString('pt-BR',{maximumFractionDigits:2})})</small></span>
        <span>Val. Líquido total: <strong>${formatarMoeda(totalLiq)}</strong>
          <small style="color:#64748b">(${totalLiq.toLocaleString('pt-BR',{maximumFractionDigits:2})})</small></span>
      </div>
      <p class="campo-dica mb-2">Confira se os totais batem com o esperado (Bruto: 3.699.377,58 · Líquido: 2.859.509,78) antes de importar.</p>

      <details open>
        <summary class="text-sm import-details-title">Amostra das primeiras 5 linhas</summary>
        <div class="tabela-wrapper mt-2">
          <table class="tabela-preview-csv">
            <thead><tr>
              <th>Cliente</th>
              <th>Val. Bruto (CSV)</th>
              <th>Val. Bruto (parseado)</th>
              <th>Val. Líq. (CSV)</th>
              <th>Val. Líq. (parseado)</th>
            </tr></thead>
            <tbody>
              ${amostra.map((r, i) => {
                const cols = (linhasBrutas[i] || '').split(';');
                return `<tr>
                  <td>${escapeHtml(r.clienteNomeCSV)}</td>
                  <td class="text-sm text-muted">${escapeHtml((cols[2]||'').trim())}</td>
                  <td class="td-valor">${r.valorBruto != null ? formatarMoeda(r.valorBruto) : '—'}</td>
                  <td class="text-sm text-muted">${escapeHtml((cols[3]||'').trim())}</td>
                  <td class="td-valor">${r.valor != null ? formatarMoeda(r.valor) : '—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </details>

      <details class="mt-2">
        <summary class="text-sm import-details-title">Ver todos os clientes</summary>
        <p class="text-sm text-muted mt-1">${clientes.map(c => escapeHtml(c)).join(' · ')}</p>
      </details>`;

    document.getElementById('btn-exec-import').disabled = false;
  } catch (err) {
    preview.innerHTML = '<p class="text-sm" style="color:var(--vermelho)">Erro ao analisar o arquivo.</p>';
    console.error(err);
  }
}

function parsearCSVAutorizacoes(text) {
  text = text.replace(/^﻿/, ''); // remove BOM se houver
  const linhas = text.split(/\r?\n/);
  const registros = [];

  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i].trim();
    if (!linha) continue;
    const c = linha.split(';');
    const cliente = (c[0] || '').trim();
    if (!cliente) continue;

    const dataEmissao = parsearDataBR(c[7]);
    const dataPagam   = parsearDataBR(c[8]);
    const nf          = (c[6] || '').trim();
    const mes         = (c[4] || '').trim();
    const ano         = (c[5] || '').trim();

    let status = 'Autorizada';
    if (dataPagam)             status = 'Paga';
    else if (nf || dataEmissao) status = 'Faturada';

    const data = dataEmissao
      || primeiroDiaMes(mes, ano)
      || firebase.firestore.Timestamp.fromDate(new Date());

    registros.push({
      clienteNomeCSV: cliente,
      piPoAf:        (c[1]  || '').trim(),
      valorBruto:    parsearValor(c[2]),
      valor:         parsearValor(c[3]),
      mesReferencia: mes,
      anoReferencia: ano,
      nf,
      dataEmissaoNF: dataEmissao,
      dataPagamento: dataPagam,
      numeroPR:      (c[9]  || '').trim(),
      descricao:     (c[10] || '').trim(),
      agencia:       (c[11] || '').trim(),
      contato:       (c[12] || '').trim(),
      conta:         (c[13] || '').trim(),
      clienteDetalhe:(c[14] || '').trim(),
      responsavel:   (c[15] || '').trim(),
      emailContato:  (c[16] || '').trim(),
      quantidade:    (c[17] || '').trim(),
      meioPagamento: (c[18] || '').trim(),
      dataPostagem:  parsearDataBR(c[19]),
      status,
      data,
    });
  }
  return registros;
}

async function iniciarImportacaoAut() {
  const btn = document.getElementById('btn-exec-import');
  btn.disabled = true;
  btn.textContent = 'Importando…';

  try {
    // 1. Encontrar/criar todos os clientes únicos
    const nomes = [...new Set(_registrosPendentes.map(r => r.clienteNomeCSV))];
    const clienteMap = {};
    for (const nome of nomes) {
      clienteMap[nome] = await buscarOuCriarClientePorNome(nome);
    }

    // 2. Gravar em lotes de 499
    let batch = db.batch();
    let n = 0;

    for (const reg of _registrosPendentes) {
      const doc = {
        clienteId:      clienteMap[reg.clienteNomeCSV],
        clienteNome:    reg.clienteNomeCSV,
        piPoAf:         reg.piPoAf,
        numeroPR:       reg.numeroPR,
        mesReferencia:  reg.mesReferencia,
        anoReferencia:  reg.anoReferencia,
        nf:             reg.nf,
        dataEmissaoNF:  reg.dataEmissaoNF,
        dataPagamento:  reg.dataPagamento,
        valorBruto:     reg.valorBruto,
        valor:          reg.valor,
        descricao:      reg.descricao,
        agencia:        reg.agencia,
        contato:        reg.contato,
        conta:          reg.conta,
        clienteDetalhe: reg.clienteDetalhe,
        responsavel:    reg.responsavel,
        emailContato:   reg.emailContato,
        quantidade:     reg.quantidade,
        meioPagamento:  reg.meioPagamento,
        dataPostagem:   reg.dataPostagem,
        status:         reg.status,
        data:           reg.data,
        importado:      true,
        criadoEm:       firebase.firestore.FieldValue.serverTimestamp(),
      };
      // Remove valores null/undefined para não poluir o Firestore
      Object.keys(doc).forEach(k => {
        if (doc[k] === null || doc[k] === undefined) delete doc[k];
      });

      batch.set(db.collection('autorizacoes').doc(), doc);
      n++;

      if (n % 499 === 0) {
        await batch.commit();
        batch = db.batch();
      }
    }

    if (n % 499 !== 0) await batch.commit();

    mostrarToast(`${_registrosPendentes.length} autorizações importadas!`, 'sucesso');
    fecharModal('importar-csv');
    _registrosPendentes = [];
  } catch (err) {
    mostrarToast('Erro durante a importação. Verifique o console.', 'erro');
    btn.disabled = false;
    btn.textContent = 'Importar';
    console.error(err);
  }
}
