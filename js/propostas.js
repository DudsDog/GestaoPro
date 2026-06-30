// ════════════════════════════════════════════════════════════
//  propostas.js — Propostas Comerciais
// ════════════════════════════════════════════════════════════

let _propostasListener  = null;
let _propostasCache     = [];
let _sortPropColuna     = 'numeroPR';
let _sortPropDirecao    = 'desc';
let _produtosPropState  = { keys: [], cache: {} };

const _PROD_LIST = [
  { key: '1',  label: '1 — Publieditorial' },
  { key: '2',  label: '2 — Branded Content' },
  { key: '3',  label: '3 — Conteúdo em Vídeo' },
  { key: '4',  label: '4 — Cobertura de Evento' },
  { key: '5',  label: '5 — Postagens Mídias Sociais' },
  { key: '6',  label: '6 — Carrossel de Conteúdo' },
  { key: '7a', label: '7a — Banner Header (Home)' },
  { key: '7b', label: '7b — Banner Middle Page (Home)' },
  { key: '7c', label: '7c — Banner Aside (Home)' },
  { key: '7d', label: '7d — Banner Header (Editorias)' },
  { key: '7e', label: '7e — Banner In-Feed (Editorias)' },
  { key: '7f', label: '7f — Banner Aside (Editorias)' },
  { key: '7g', label: '7g — Banner Header (Matéria)' },
  { key: '7h', label: '7h — Banner In-Text (Matérias)' },
  { key: '7i', label: '7i — Banner Aside (Matérias)' },
  { key: '7j', label: '7j — Banner por CPM' },
  { key: '8',  label: '8 — Pacote Tribuna 1' },
  { key: '9',  label: '9 — Pacote Tribuna 2' },
  { key: '10', label: '10 — Divulgação de Vaga' },
  { key: '11', label: '11 — Publicidade Legal' },
];

// ── Carregamento ──────────────────────────────────────────────
function carregarPropostas() {
  if (_propostasListener) { filtrarPropostas(); return; }

  document.getElementById('propostas-lista').innerHTML =
    '<div class="carregando">Carregando propostas…</div>';

  _propostasListener = db.collection('propostas')
    .orderBy('dataCriacao', 'desc')
    .onSnapshot(snap => {
      _propostasCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      filtrarPropostas();
    }, err => {
      document.getElementById('propostas-lista').innerHTML =
        '<div class="vazio">Erro ao carregar propostas.</div>';
      console.error(err);
    });

  document.getElementById('filtro-status-propostas')
    .addEventListener('change', filtrarPropostas);
  document.getElementById('busca-propostas')
    .addEventListener('input', filtrarPropostas);
}

function filtrarPropostas() {
  const busca  = (document.getElementById('busca-propostas').value || '').toLowerCase();
  const status = document.getElementById('filtro-status-propostas').value;
  const lista  = _propostasCache.filter(p => {
    const ok1 = !busca  || (p.clienteNome || '').toLowerCase().includes(busca);
    const ok2 = !status || p.status === status;
    return ok1 && ok2;
  });
  renderizarPropostas(lista);
}

// ── Ordenação ─────────────────────────────────────────────────
function ordenarPropostaPor(coluna) {
  if (_sortPropColuna === coluna) {
    _sortPropDirecao = _sortPropDirecao === 'asc' ? 'desc' : 'asc';
  } else {
    _sortPropColuna  = coluna;
    _sortPropDirecao = 'asc';
  }
  filtrarPropostas();
}

function _thSortProp(col, label, classe) {
  const ativo = _sortPropColuna === col;
  const seta  = ativo ? (_sortPropDirecao === 'asc' ? ' ▲' : ' ▼') : '';
  const cls   = ['th-sortable', ativo ? 'th-sort-ativo' : '', classe || ''].filter(Boolean).join(' ');
  return `<th class="${cls}" onclick="ordenarPropostaPor('${col}')">${label}${seta}</th>`;
}

function _valorOrdenacaoProp(p, col) {
  switch (col) {
    case 'clienteNome':   return (p.clienteNome || '').toLowerCase();
    case 'numeroPR':      return _sortKeyPR(p.numeroPR);
    case 'valorProposta': return p.valorProposta || 0;
    case 'mesReferencia': return MESES_NUM[p.mesReferencia] || 0;
    case 'anoReferencia': return parseInt(p.anoReferencia) || 0;
    case 'status':        return p.status || '';
    default:              return p.dataCriacao ? p.dataCriacao.seconds : 0;
  }
}

function badgeStatusProposta(status) {
  const mapa = {
    'Em aberto': 'badge-prospect',
    'Enviada':   'badge-faturada',
    'Aprovada':  'badge-paga',
  };
  return `<span class="badge ${mapa[status] || ''}">${escapeHtml(status)}</span>`;
}

// ── Renderização ─────────────────────────────────────────────
function renderizarPropostas(lista) {
  const el = document.getElementById('propostas-lista');
  if (!lista.length) {
    el.innerHTML = '<div class="vazio">Nenhuma proposta encontrada.</div>';
    return;
  }

  const sorted = [...lista].sort((a, b) => {
    const va = _valorOrdenacaoProp(a, _sortPropColuna);
    const vb = _valorOrdenacaoProp(b, _sortPropColuna);
    const cmp = typeof va === 'string' ? va.localeCompare(vb, 'pt-BR') : va - vb;
    return _sortPropDirecao === 'asc' ? cmp : -cmp;
  });

  const d  = v => escapeHtml(v || '—');
  const mo = v => (v != null && v !== '') ? formatarMoeda(v) : '—';

  el.innerHTML = `
    <div class="tabela-wrapper">
      <table class="tabela-autorizacoes">
        <thead>
          <tr>
            ${_thSortProp('clienteNome',   'Cliente', 'col-sticky-1')}
            ${_thSortProp('numeroPR',      'Nº PR / Proposta', 'col-sticky-2')}
            <th>Descrição / Campanha</th>
            ${_thSortProp('valorProposta', 'Val. Proposta')}
            ${_thSortProp('mesReferencia', 'Mês Ref.')}
            ${_thSortProp('anoReferencia', 'Ano')}
            <th>Agência</th>
            ${_thSortProp('status', 'Status')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(p => `
            <tr>
              <td class="nowrap col-sticky-1"><strong>${d(p.clienteNome)}</strong></td>
              <td class="nowrap text-sm col-sticky-2">${d(p.numeroPR)}</td>
              <td class="text-sm td-descricao">${d(p.descricao)}</td>
              <td class="td-valor text-sm">${mo(p.valorProposta)}</td>
              <td class="text-sm">${d(p.mesReferencia)}</td>
              <td class="text-sm">${d(p.anoReferencia)}</td>
              <td class="text-sm">${d(p.agencia)}</td>
              <td>${badgeStatusProposta(p.status || 'Em aberto')}</td>
              <td class="td-acoes">
                <button class="btn btn-outline btn-sm"
                  onclick="selecionarProdutoPDF('${p.id}')">PDF</button>
                <button class="btn btn-outline btn-sm"
                  onclick="abrirModalProposta('${p.id}')">Editar</button>
                <button class="btn btn-perigo btn-sm"
                  onclick="confirmarExcluirProposta('${p.id}','${escapeHtml(p.numeroPR||p.clienteNome||'')}')">Excluir</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="text-sm text-muted mt-3">
      ${lista.length} proposta${lista.length !== 1 ? 's' : ''} encontrada${lista.length !== 1 ? 's' : ''}
    </p>`;
}

// ── Aba Produto ───────────────────────────────────────────────
function _getProdutoByKey(key) {
  if (typeof _BANNERS !== 'undefined' && _BANNERS[key]) return _BANNERS[key];
  if (typeof _PRODUTOS !== 'undefined' && _PRODUTOS[key]) return _PRODUTOS[key];
  return null;
}

function _blocoEdHtml(b, bi) {
  let h = `<div class="bloco-ed" data-bi="${bi}">`;
  if (b.titulo !== undefined) {
    h += `<div class="bloco-ed-campo">
      <span class="bloco-ed-label">Título</span>
      <input type="text" class="bloco-ed-input" data-tipo="titulo" value="${escapeHtml(b.titulo)}">
    </div>`;
  }
  if (b.texto !== undefined) {
    h += `<div class="bloco-ed-campo">
      <span class="bloco-ed-label">Texto</span>
      <textarea class="bloco-ed-textarea" data-tipo="texto" rows="3">${escapeHtml(b.texto)}</textarea>
    </div>`;
  }
  if (b.lista) {
    h += `<div class="bloco-ed-campo">
      <span class="bloco-ed-label">Itens da lista</span>
      ${b.lista.map((item, li) =>
        `<textarea class="bloco-ed-textarea bloco-ed-lista" data-tipo="lista" data-li="${li}" rows="2">${escapeHtml(item)}</textarea>`
      ).join('')}
    </div>`;
  }
  return h + '</div>';
}

function toggleProdutoProp(key) {
  const idx = _produtosPropState.keys.indexOf(key);
  if (idx !== -1) {
    const item = _lerEditsProduto(key);
    if (item) _produtosPropState.cache[key] = item;
    _produtosPropState.keys.splice(idx, 1);
    const el = document.querySelector(`.prod-editavel[data-key="${key}"]`);
    if (el) el.remove();
  } else {
    _produtosPropState.keys.push(key);
    _appendProdutoEditavel(key);
  }
  document.querySelectorAll('.btn-prod-toggle').forEach(btn => {
    btn.classList.toggle('ativo', _produtosPropState.keys.includes(btn.dataset.key));
  });
}

function _appendProdutoEditavel(key) {
  const container = document.getElementById('prod-editaveis-prop');
  if (!container) return;
  const src = _getProdutoByKey(key);
  if (!src) return;
  const cached = _produtosPropState.cache[key];
  const blocos = cached ? JSON.parse(JSON.stringify(cached.blocos)) : JSON.parse(JSON.stringify(src.blocos));
  const num = _produtosPropState.keys.indexOf(key) + 1;
  const div = document.createElement('div');
  div.className = 'prod-editavel';
  div.dataset.key = key;
  div.innerHTML = `
    <div class="prod-editavel-header">
      <strong>${num} — ${src.nome}</strong>
    </div>
    <div class="prod-editavel-blocos">
      ${blocos.map((b, bi) => _blocoEdHtml(b, bi)).join('')}
    </div>`;
  container.appendChild(div);
}

function _lerEditsProduto(key) {
  const el = document.querySelector(`.prod-editavel[data-key="${key}"]`);
  if (!el) return _produtosPropState.cache[key] || null;
  const src = _getProdutoByKey(key);
  if (!src) return null;
  const blocos = JSON.parse(JSON.stringify(src.blocos));
  el.querySelectorAll('.bloco-ed').forEach(blocoEl => {
    const bi = parseInt(blocoEl.dataset.bi);
    const b = blocos[bi];
    if (!b) return;
    const tEl = blocoEl.querySelector('[data-tipo="titulo"]');
    if (tEl && b.titulo !== undefined) b.titulo = tEl.value;
    const xEl = blocoEl.querySelector('[data-tipo="texto"]');
    if (xEl && b.texto !== undefined) b.texto = xEl.value;
    blocoEl.querySelectorAll('[data-tipo="lista"]').forEach((lEl, li) => {
      if (b.lista && b.lista[li] !== undefined) b.lista[li] = lEl.value;
    });
  });
  return { key, nome: src.nome, blocos };
}

function _initProdutoTab(p) {
  _produtosPropState = { keys: [], cache: {} };
  (p.produtosSelecionados || []).forEach(item => {
    _produtosPropState.keys.push(item.key);
    _produtosPropState.cache[item.key] = item;
  });
  _produtosPropState.keys.forEach(key => _appendProdutoEditavel(key));
  const chk = document.getElementById('chk-sobre-prop');
  if (chk) chk.checked = !!p.incluirSobre;
}

// ── Modal ─────────────────────────────────────────────────────
async function abrirModalProposta(id) {
  const base   = id ? (_propostasCache.find(x => x.id === id) || {}) : {};
  const p      = Object.assign({}, base);
  const titulo = id ? 'Editar Proposta' : 'Nova Proposta';

  const v   = campo => escapeHtml(p[campo] || '');
  const sel = val   => (p.status || 'Em aberto') === val ? 'selected' : '';

  const clientes = _clientesCache.length
    ? _clientesCache
    : await db.collection('clientes').orderBy('nomeFantasia').get()
        .then(s => s.docs.map(d => ({ id: d.id, ...d.data() })));

  const optsClientes = clientes.map(c =>
    `<option value="${c.id}" data-nome="${escapeHtml(c.nomeFantasia||'')}"
      ${p.clienteId === c.id ? 'selected' : ''}>${escapeHtml(c.nomeFantasia||'')}</option>`
  ).join('');

  const optsM = Object.keys(MESES_NUM).map(m =>
    `<option value="${m}" ${p.mesReferencia===m?'selected':''}>${m}</option>`).join('');

  const corpo = `
    <div class="form-tabs" id="form-tabs-prop">
      <button type="button" class="form-tab ativo"
        onclick="mudarTabProp(this,'ftab-prop-id')">Identificação</button>
      <button type="button" class="form-tab"
        onclick="mudarTabProp(this,'ftab-prop-fin')">Financeiro</button>
      <button type="button" class="form-tab"
        onclick="mudarTabProp(this,'ftab-prop-camp')">Campanha</button>
      <button type="button" class="form-tab"
        onclick="mudarTabProp(this,'ftab-prop-cont')">Agência / Contato</button>
      <button type="button" class="form-tab"
        onclick="mudarTabProp(this,'ftab-prop-prod')">Produto</button>
    </div>

    <form id="form-proposta" onsubmit="return false">

      <!-- Identificação -->
      <div id="ftab-prop-id" class="tab-painel form-grid">
        <div class="campo campo-full">
          <label>Cliente *</label>
          <select name="clienteId" id="sel-cliente-prop" required>
            <option value="">— selecione —</option>${optsClientes}
          </select>
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
          <input type="text" name="anoReferencia"
            value="${v('anoReferencia') || new Date().getFullYear()}"
            placeholder="${new Date().getFullYear()}" maxlength="4">
        </div>
        <div class="campo">
          <label>Status</label>
          <select name="status">
            <option value="Em aberto" ${sel('Em aberto')}>Em aberto</option>
            <option value="Enviada"   ${sel('Enviada')}>Enviada</option>
            <option value="Aprovada"  ${sel('Aprovada')}>Aprovada</option>
          </select>
        </div>
      </div>

      <!-- Financeiro -->
      <div id="ftab-prop-fin" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Valor da Proposta (R$)</label>
          <input type="text" name="valorPropostaTexto"
            value="${p.valorProposta != null ? formatarMoedaInput(p.valorProposta) : ''}"
            placeholder="0,00" inputmode="decimal">
        </div>
      </div>

      <!-- Campanha -->
      <div id="ftab-prop-camp" class="tab-painel form-grid" hidden>
        <div class="campo campo-full">
          <label>Descrição / Campanha</label>
          <textarea name="descricao" rows="4">${escapeHtml(p.descricao || '')}</textarea>
        </div>
        <div class="campo">
          <label>Quantidade</label>
          <input type="text" name="quantidade" value="${v('quantidade')}">
        </div>
        <div class="campo">
          <label>Início</label>
          <input type="date" name="dataInicio"
            value="${p.dataInicio ? tsParaInputDate(p.dataInicio) : ''}">
        </div>
        <div class="campo">
          <label>Término</label>
          <input type="date" name="dataTermino"
            value="${p.dataTermino ? tsParaInputDate(p.dataTermino) : ''}">
        </div>
        <div class="campo">
          <label>Responsável</label>
          <input type="text" name="responsavel" value="${v('responsavel')}">
        </div>
        <div class="campo">
          <label>Conta</label>
          <input type="text" name="conta" value="${v('conta')}">
        </div>
        <div class="campo campo-full">
          <label>Observações</label>
          <textarea name="observacoes" rows="2">${escapeHtml(p.observacoes || '')}</textarea>
        </div>
      </div>

      <!-- Agência / Contato -->
      <div id="ftab-prop-cont" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Agência</label>
          <input type="text" name="agencia" value="${v('agencia')}">
        </div>
        <div class="campo">
          <label>PI / PO / AF</label>
          <input type="text" name="piPoAf" value="${v('piPoAf')}">
        </div>
        <div class="campo">
          <label>Contato</label>
          <input type="text" name="contato" value="${v('contato')}">
        </div>
        <div class="campo">
          <label>E-mail do Contato</label>
          <input type="email" name="emailContato" value="${v('emailContato')}">
        </div>
        <div class="campo">
          <label>Cliente (detalhe)</label>
          <input type="text" name="clienteDetalhe" value="${v('clienteDetalhe')}">
        </div>
      </div>

      <!-- Produto -->
      <div id="ftab-prop-prod" class="tab-painel" hidden>
        <div class="sobre-chk-prod">
          <label>
            <input type="checkbox" id="chk-sobre-prop">
            Incluir <strong>Sobre a Tribuna</strong> no PDF
          </label>
        </div>
        <div class="prod-botoes">
          ${_PROD_LIST.map(pr => `<button type="button" class="btn-prod-toggle" data-key="${pr.key}" onclick="toggleProdutoProp('${pr.key}')">${pr.label}</button>`).join('')}
        </div>
        <div id="prod-editaveis-prop"></div>
      </div>

    </form>`;

  const rodape = `
    <button class="btn btn-secundario" onclick="fecharModal('proposta')">Cancelar</button>
    <button class="btn btn-primario" onclick="salvarProposta('${id||''}')">Salvar</button>`;

  criarModal('proposta', titulo, corpo, rodape, false);
  _initProdutoTab(p);
}

function mudarTabProp(btn, painelId) {
  document.querySelectorAll('#form-tabs-prop .form-tab')
    .forEach(t => t.classList.remove('ativo'));
  document.querySelectorAll('#form-proposta .tab-painel')
    .forEach(p => { p.hidden = true; });
  btn.classList.add('ativo');
  document.getElementById(painelId).hidden = false;
}

// ── Salvar ────────────────────────────────────────────────────
async function salvarProposta(id) {
  const form       = document.getElementById('form-proposta');
  const selCliente = document.getElementById('sel-cliente-prop');

  if (!selCliente.value) {
    document.querySelector('#form-tabs-prop .form-tab').click();
    selCliente.focus();
    mostrarToast('Selecione um cliente.', 'erro');
    return;
  }

  const clienteOpt  = selCliente.options[selCliente.selectedIndex];
  const clienteNome = clienteOpt.dataset.nome || clienteOpt.text;
  const status      = form.querySelector('[name="status"]').value;

  let numeroPR = form.querySelector('[name="numeroPR"]').value.trim();
  if (!id && !numeroPR) {
    try { numeroPR = await gerarNumeroPR(); } catch (err) { console.error(err); }
  }

  const dados = {
    clienteId:      selCliente.value,
    clienteNome,
    numeroPR,
    mesReferencia:  form.querySelector('[name="mesReferencia"]').value,
    anoReferencia:  form.querySelector('[name="anoReferencia"]').value || String(new Date().getFullYear()),
    status,
    valorProposta:  parsearValor(form.querySelector('[name="valorPropostaTexto"]').value),
    descricao:      form.querySelector('[name="descricao"]').value.trim(),
    quantidade:     form.querySelector('[name="quantidade"]').value.trim(),
    dataInicio:     inputDateParaTimestamp(form.querySelector('[name="dataInicio"]').value),
    dataTermino:    inputDateParaTimestamp(form.querySelector('[name="dataTermino"]').value),
    responsavel:    form.querySelector('[name="responsavel"]').value.trim(),
    conta:          form.querySelector('[name="conta"]').value.trim(),
    observacoes:    form.querySelector('[name="observacoes"]').value.trim(),
    agencia:        form.querySelector('[name="agencia"]').value.trim(),
    piPoAf:         form.querySelector('[name="piPoAf"]').value.trim(),
    contato:        form.querySelector('[name="contato"]').value.trim(),
    emailContato:   form.querySelector('[name="emailContato"]').value.trim(),
    clienteDetalhe:      form.querySelector('[name="clienteDetalhe"]').value.trim(),
    produtosSelecionados: _produtosPropState.keys.map(k => _lerEditsProduto(k)).filter(Boolean),
    incluirSobre:         document.getElementById('chk-sobre-prop')?.checked || false,
  };

  const btnSalvar = document.querySelector('#overlay-proposta .btn-primario');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando…';

  try {
    const eraAprovada = id
      ? (_propostasCache.find(x => x.id === id) || {}).status === 'Aprovada'
      : false;

    if (id) {
      await db.collection('propostas').doc(id).update(dados);
    } else {
      dados.dataCriacao = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('propostas').add(dados);
    }

    if (status === 'Aprovada' && !eraAprovada) {
      await _criarAutorizacaoDeProposta(dados);
      mostrarToast('Proposta aprovada! Registro criado no histórico de Autorizações.', 'sucesso');
    } else {
      mostrarToast(id ? 'Proposta atualizada!' : 'Proposta criada!', 'sucesso');
    }

    fecharModal('proposta');
  } catch (err) {
    mostrarToast('Erro ao salvar proposta.', 'erro');
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
    console.error(err);
  }
}

async function _criarAutorizacaoDeProposta(dados) {
  const autDados = {
    clienteId:      dados.clienteId,
    clienteNome:    dados.clienteNome,
    numeroPR:       dados.numeroPR,
    piPoAf:         dados.piPoAf,
    mesReferencia:  dados.mesReferencia,
    anoReferencia:  dados.anoReferencia,
    descricao:      dados.descricao,
    agencia:        dados.agencia,
    contato:        dados.contato,
    emailContato:   dados.emailContato,
    conta:          dados.conta,
    clienteDetalhe: dados.clienteDetalhe,
    quantidade:     dados.quantidade,
    dataInicio:     dados.dataInicio,
    dataTermino:    dados.dataTermino,
    responsavel:    dados.responsavel,
    observacoes:    dados.observacoes,
    valorProposta:  dados.valorProposta,
    status:         'Autorizada',
    data:           firebase.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection('autorizacoes').add(autDados);
}

// ── Excluir ───────────────────────────────────────────────────
function confirmarExcluirProposta(id, nome) {
  criarModal('confirmar-prop', 'Excluir Proposta',
    `<p>Tem certeza que deseja excluir <strong>${escapeHtml(nome)}</strong>?</p>
     <p class="text-sm text-muted mt-3">Esta ação não pode ser desfeita.</p>`,
    `<button class="btn btn-secundario" onclick="fecharModal('confirmar-prop')">Cancelar</button>
     <button class="btn btn-perigo" onclick="excluirProposta('${id}')">Excluir</button>`
  );
}

async function excluirProposta(id) {
  try {
    await db.collection('propostas').doc(id).delete();
    mostrarToast('Proposta excluída.', 'sucesso');
    fecharModal('confirmar-prop');
  } catch (err) {
    mostrarToast('Erro ao excluir proposta.', 'erro');
    console.error(err);
  }
}
