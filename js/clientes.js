// ════════════════════════════════════════════════════════════
//  clientes.js — Cadastro e lista de Clientes
// ════════════════════════════════════════════════════════════

let _clientesListener = null;
let _clientesCache    = [];
const _detalheAberto  = {};

// ── Carregamento ──────────────────────────────────────────────
function carregarClientes() {
  if (_clientesListener) { filtrarClientes(); return; }

  document.getElementById('clientes-lista').innerHTML =
    '<div class="carregando">Carregando clientes…</div>';

  _clientesListener = db.collection('clientes')
    .orderBy('nomeFantasia')
    .onSnapshot(snap => {
      _clientesCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      filtrarClientes();
    }, err => {
      document.getElementById('clientes-lista').innerHTML =
        '<div class="vazio">Erro ao carregar clientes.</div>';
      console.error(err);
    });

  document.getElementById('busca-clientes')
    .addEventListener('input', filtrarClientes);
  document.getElementById('filtro-status-clientes')
    .addEventListener('change', filtrarClientes);
}

function filtrarClientes() {
  const busca  = (document.getElementById('busca-clientes').value || '').toLowerCase();
  const status = document.getElementById('filtro-status-clientes').value;
  const lista  = _clientesCache.filter(c => {
    const ok1 = !busca  || (c.nomeFantasia || '').toLowerCase().includes(busca);
    const ok2 = !status || (c.status || 'Ativo') === status;
    return ok1 && ok2;
  });
  renderizarClientes(lista);
}

// ── Tabela com colunas expansíveis ───────────────────────────
function renderizarClientes(lista) {
  const el = document.getElementById('clientes-lista');
  if (!lista.length) {
    el.innerHTML = '<div class="vazio">Nenhum cliente encontrado.</div>';
    return;
  }
  el.innerHTML = `
    <div class="tabela-wrapper">
      <table class="tabela-clientes">
        <thead>
          <tr>
            <th class="th-grupo">Empresa</th>
            <th class="th-grupo">Principal</th>
            <th class="th-grupo">Financeiro</th>
            <th class="th-grupo">Marketing</th>
            <th class="th-grupo">Ag. Propaganda</th>
            <th class="th-grupo">Mídias Sociais</th>
            <th class="th-grupo">Dados Cadastrais</th>
            <th class="th-grupo">Sistema</th>
            <th>Outras Informações</th>
            <th></th>
          </tr>
        </thead>
        <tbody>${lista.map(c => linhasCliente(c)).join('')}</tbody>
      </table>
    </div>
    <p class="text-sm text-muted mt-3">
      ${lista.length} cliente${lista.length !== 1 ? 's' : ''} encontrado${lista.length !== 1 ? 's' : ''}
    </p>`;
}

function linhasCliente(c) {
  const tem = (...fs) => fs.some(f => c[f]);

  const g = (grupo, temDado, label) => `
    <td class="td-grupo${temDado ? ' tem-dado' : ''}" id="td-${c.id}-${grupo}"
        onclick="toggleDetalhe('${c.id}','${grupo}')">
      <span class="grupo-dot"></span>${label}<span class="grupo-seta">▾</span>
    </td>`;

  const outras = c.outrasInformacoes || '';
  const outrasResumido = outras.length > 60 ? outras.slice(0,60)+'…' : outras;

  return `
    <tr class="linha-cliente" id="linha-${c.id}">
      ${g('empresa',
          tem('nomeFantasia','setor','subsetor'),
          escapeHtml(c.nomeFantasia || '—'))}
      ${g('proprietario',
          tem('propNome','propCelular','propCargo','propEmail'),
          escapeHtml(c.propNome || 'Principal'))}
      ${g('financeiro',
          tem('finNome','finCelular','finCargo','finEmail'),
          escapeHtml(c.finNome || 'Financeiro'))}
      ${g('marketing',
          tem('mktNome','mktCelular','mktCargo','mktEmail'),
          escapeHtml(c.mktNome || 'Marketing'))}
      ${g('agencia',
          tem('agenciaNome','agenciaContato','agenciaCelular','agenciaEmail'),
          escapeHtml(c.agenciaNome || 'Agência'))}
      ${g('midias',
          tem('instagram','facebook','site','whatsapp','outrasRedes'),
          'Mídias')}
      ${g('dados',
          tem('razaoSocial','cnpj','cidade','endereco'),
          escapeHtml([c.cidade,c.estado].filter(Boolean).join('/') || 'Dados'))}
      ${g('sistema', true, badgeStatus(c.status || 'Ativo'))}
      <td class="text-sm td-outras" title="${escapeHtml(outras)}">
        ${escapeHtml(outrasResumido) || '<span class="text-muted">—</span>'}
      </td>
      <td class="td-acoes">
        <button class="btn btn-outline btn-sm"
          onclick="event.stopPropagation();abrirModalCliente('${c.id}')">Editar</button>
        <button class="btn btn-perigo btn-sm"
          onclick="event.stopPropagation();confirmarExcluirCliente('${c.id}','${escapeHtml(c.nomeFantasia||'')}')">Excluir</button>
      </td>
    </tr>
    <tr class="linha-detalhe" id="detalhe-${c.id}" hidden>
      <td colspan="8">
        <div class="detalhe-conteudo" id="detalhe-conteudo-${c.id}"></div>
      </td>
    </tr>`;
}

// ── Expandir / recolher detalhe ───────────────────────────────
function toggleDetalhe(clienteId, grupo) {
  event.stopPropagation();
  const linhaDetalhe = document.getElementById('detalhe-' + clienteId);
  const conteudo     = document.getElementById('detalhe-conteudo-' + clienteId);
  const c = _clientesCache.find(x => x.id === clienteId) || {};

  if (!linhaDetalhe.hidden && _detalheAberto[clienteId] === grupo) {
    linhaDetalhe.hidden = true;
    _detalheAberto[clienteId] = null;
    document.querySelectorAll(`[id^="td-${clienteId}-"]`)
      .forEach(el => el.classList.remove('ativo'));
    return;
  }

  _detalheAberto[clienteId] = grupo;
  conteudo.innerHTML = gerarHtmlDetalhe(c, grupo);
  linhaDetalhe.hidden = false;
  document.querySelectorAll(`[id^="td-${clienteId}-"]`)
    .forEach(el => el.classList.remove('ativo'));
  document.getElementById(`td-${clienteId}-${grupo}`).classList.add('ativo');
}

function gerarHtmlDetalhe(c, grupo) {
  const f = (label, val) => `
    <div class="detalhe-campo">
      <span class="detalhe-label">${label}</span>
      <span class="detalhe-valor">${val ? escapeHtml(val) : '<span class="text-muted">—</span>'}</span>
    </div>`;

  const grupos = {
    empresa: () =>
      f('Nome Fantasia', c.nomeFantasia) +
      f('Setor',         c.setor) +
      f('Subsetor',      c.subsetor),

    proprietario: () =>
      f('Contato',  c.propNome) +
      f('Celular',  c.propCelular) +
      f('Cargo',    c.propCargo) +
      f('E-mail',   c.propEmail),

    financeiro: () =>
      f('Contato',  c.finNome) +
      f('Celular',  c.finCelular) +
      f('Cargo',    c.finCargo) +
      f('E-mail',   c.finEmail),

    marketing: () =>
      f('Contato',  c.mktNome) +
      f('Celular',  c.mktCelular) +
      f('Cargo',    c.mktCargo) +
      f('E-mail',   c.mktEmail),

    agencia: () =>
      f('Empresa',  c.agenciaNome) +
      f('Contato',  c.agenciaContato) +
      f('Celular',  c.agenciaCelular) +
      f('Cargo',    c.agenciaCargo) +
      f('E-mail',   c.agenciaEmail),

    midias: () =>
      f('Instagram',    c.instagram) +
      f('Facebook',     c.facebook) +
      f('Site',         c.site) +
      f('WhatsApp',     c.whatsapp) +
      f('Outras Redes', c.outrasRedes),

    dados: () =>
      f('Razão Social', c.razaoSocial) +
      f('CNPJ',         c.cnpj) +
      f('Telefone',     c.telefone) +
      f('Endereço',     [c.endereco,c.complemento].filter(Boolean).join(', ')) +
      f('CEP',          c.cep) +
      f('Cidade/Estado',[c.cidade,c.estado].filter(Boolean).join('/')),

    sistema: () => `
      <div class="detalhe-campo">
        <span class="detalhe-label">Status</span>
        <span class="detalhe-valor">${badgeStatus(c.status||'Ativo')}</span>
      </div>
      <div class="detalhe-campo detalhe-campo-full">
        <span class="detalhe-label">Trabalhos Realizados</span>
        <span class="detalhe-valor">${c.trabalhosRealizados ? escapeHtml(c.trabalhosRealizados) : '<span class="text-muted">—</span>'}</span>
      </div>`,
  };

  return `<div class="detalhe-campos">${(grupos[grupo]||(() => ''))()}</div>`;
}

// ── Modal com abas (igual às colunas da tabela) ───────────────
function abrirModalCliente(id) {
  const c      = id ? (_clientesCache.find(x => x.id === id) || {}) : {};
  const titulo = id ? 'Editar Cliente' : 'Novo Cliente';
  const v      = campo => escapeHtml(c[campo] || '');
  const sel    = val   => (c.status || 'Ativo') === val ? 'selected' : '';

  const abas = [
    { id: 'ftab-empresa',       label: 'Empresa'          },
    { id: 'ftab-proprietario',  label: 'Principal'        },
    { id: 'ftab-financeiro',    label: 'Financeiro'       },
    { id: 'ftab-marketing',     label: 'Marketing'        },
    { id: 'ftab-agencia',       label: 'Ag. Propaganda'   },
    { id: 'ftab-midias',        label: 'Mídias Sociais'   },
    { id: 'ftab-dados',         label: 'Dados Cadastrais' },
    { id: 'ftab-sistema',       label: 'Sistema'          },
  ];

  const corpo = `
    <div class="form-tabs" id="form-tabs-cliente">
      ${abas.map((a,i) =>
        `<button type="button" class="form-tab${i===0?' ativo':''}"
          onclick="mudarTabCliente(this,'${a.id}')">${a.label}</button>`
      ).join('')}
    </div>

    <form id="form-cliente" onsubmit="return false">

      <!-- Empresa -->
      <div id="ftab-empresa" class="tab-painel form-grid">
        <div class="campo campo-full">
          <label>Nome Fantasia *</label>
          <input type="text" name="nomeFantasia" value="${v('nomeFantasia')}"
            required placeholder="Como o cliente é conhecido">
        </div>
        <div class="campo">
          <label>Setor</label>
          <input type="text" name="setor" value="${v('setor')}">
        </div>
        <div class="campo">
          <label>Subsetor</label>
          <input type="text" name="subsetor" value="${v('subsetor')}">
        </div>
      </div>

      <!-- Principal -->
      <div id="ftab-proprietario" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Contato (nome)</label>
          <input type="text" name="propNome" value="${v('propNome')}">
        </div>
        <div class="campo">
          <label>Celular</label>
          <input type="text" name="propCelular" value="${v('propCelular')}" placeholder="(11) 99999-0000" oninput="mascararCelular(this)" maxlength="15">
        </div>
        <div class="campo">
          <label>Cargo</label>
          <input type="text" name="propCargo" value="${v('propCargo')}">
        </div>
        <div class="campo">
          <label>E-mail</label>
          <input type="email" name="propEmail" value="${v('propEmail')}">
        </div>
      </div>

      <!-- Financeiro -->
      <div id="ftab-financeiro" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Contato (nome)</label>
          <input type="text" name="finNome" value="${v('finNome')}">
        </div>
        <div class="campo">
          <label>Celular</label>
          <input type="text" name="finCelular" value="${v('finCelular')}" placeholder="(11) 99999-0000" oninput="mascararCelular(this)" maxlength="15">
        </div>
        <div class="campo">
          <label>Cargo</label>
          <input type="text" name="finCargo" value="${v('finCargo')}">
        </div>
        <div class="campo">
          <label>E-mail</label>
          <input type="email" name="finEmail" value="${v('finEmail')}">
        </div>
      </div>

      <!-- Marketing -->
      <div id="ftab-marketing" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Contato (nome)</label>
          <input type="text" name="mktNome" value="${v('mktNome')}">
        </div>
        <div class="campo">
          <label>Celular</label>
          <input type="text" name="mktCelular" value="${v('mktCelular')}" placeholder="(11) 99999-0000" oninput="mascararCelular(this)" maxlength="15">
        </div>
        <div class="campo">
          <label>Cargo</label>
          <input type="text" name="mktCargo" value="${v('mktCargo')}">
        </div>
        <div class="campo">
          <label>E-mail</label>
          <input type="email" name="mktEmail" value="${v('mktEmail')}">
        </div>
      </div>

      <!-- Agência de Propaganda -->
      <div id="ftab-agencia" class="tab-painel form-grid" hidden>
        <div class="campo campo-full">
          <label>Nome da Agência</label>
          <input type="text" name="agenciaNome" value="${v('agenciaNome')}">
        </div>
        <div class="campo">
          <label>Contato</label>
          <input type="text" name="agenciaContato" value="${v('agenciaContato')}">
        </div>
        <div class="campo">
          <label>Celular</label>
          <input type="text" name="agenciaCelular" value="${v('agenciaCelular')}" placeholder="(11) 99999-0000" oninput="mascararCelular(this)" maxlength="15">
        </div>
        <div class="campo">
          <label>Cargo</label>
          <input type="text" name="agenciaCargo" value="${v('agenciaCargo')}">
        </div>
        <div class="campo">
          <label>E-mail</label>
          <input type="email" name="agenciaEmail" value="${v('agenciaEmail')}">
        </div>
      </div>

      <!-- Mídias Sociais -->
      <div id="ftab-midias" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Instagram</label>
          <input type="text" name="instagram" value="${v('instagram')}" placeholder="@perfil">
        </div>
        <div class="campo">
          <label>Facebook</label>
          <input type="text" name="facebook" value="${v('facebook')}">
        </div>
        <div class="campo">
          <label>Site</label>
          <input type="text" name="site" value="${v('site')}">
        </div>
        <div class="campo">
          <label>WhatsApp</label>
          <input type="text" name="whatsapp" value="${v('whatsapp')}">
        </div>
        <div class="campo campo-full">
          <label>Outras Redes</label>
          <input type="text" name="outrasRedes" value="${v('outrasRedes')}">
        </div>
      </div>

      <!-- Dados Cadastrais -->
      <div id="ftab-dados" class="tab-painel form-grid" hidden>
        <div class="campo campo-full">
          <label>Razão Social</label>
          <input type="text" name="razaoSocial" value="${v('razaoSocial')}">
        </div>
        <div class="campo">
          <label>CNPJ</label>
          <input type="text" name="cnpj" value="${v('cnpj')}" placeholder="00.000.000/0000-00" oninput="mascararCNPJ(this)" maxlength="18">
        </div>
        <div class="campo">
          <label>Telefone</label>
          <input type="text" name="telefone" value="${v('telefone')}">
        </div>
        <div class="campo campo-full">
          <label>Endereço</label>
          <input type="text" name="endereco" value="${v('endereco')}">
        </div>
        <div class="campo">
          <label>Complemento</label>
          <input type="text" name="complemento" value="${v('complemento')}">
        </div>
        <div class="campo">
          <label>CEP</label>
          <input type="text" name="cep" value="${v('cep')}" placeholder="00000-000">
        </div>
        <div class="campo">
          <label>Cidade</label>
          <input type="text" name="cidade" value="${v('cidade')}">
        </div>
        <div class="campo">
          <label>Estado</label>
          <input type="text" name="estado" value="${v('estado')}" maxlength="2" placeholder="SP">
        </div>
      </div>

      <!-- Sistema -->
      <div id="ftab-sistema" class="tab-painel form-grid" hidden>
        <div class="campo">
          <label>Status</label>
          <select name="status">
            <option value="Ativo"    ${sel('Ativo')}>Ativo</option>
            <option value="Inativo"  ${sel('Inativo')}>Inativo</option>
            <option value="Prospect" ${sel('Prospect')}>Prospect</option>
          </select>
        </div>
        <div class="campo campo-full">
          <label>Trabalhos Realizados</label>
          <textarea name="trabalhosRealizados" rows="4">${escapeHtml(c.trabalhosRealizados||'')}</textarea>
        </div>
        <div class="campo campo-full">
          <label>Outras Informações</label>
          <textarea name="outrasInformacoes" rows="4">${escapeHtml(c.outrasInformacoes||'')}</textarea>
        </div>
      </div>

    </form>`;

  const rodape = `
    <button class="btn btn-secundario" onclick="fecharModal('cliente')">Cancelar</button>
    <button class="btn btn-primario" onclick="salvarCliente('${id||''}')">Salvar</button>`;

  criarModal('cliente', titulo, corpo, rodape);
}

// ── Troca de aba no formulário ────────────────────────────────
function mudarTabCliente(btn, painelId) {
  document.querySelectorAll('#form-tabs-cliente .form-tab')
    .forEach(t => t.classList.remove('ativo'));
  document.querySelectorAll('#form-cliente .tab-painel')
    .forEach(p => { p.hidden = true; });
  btn.classList.add('ativo');
  document.getElementById(painelId).hidden = false;
}

// ── Salvar ────────────────────────────────────────────────────
async function salvarCliente(id) {
  // Valida campo obrigatório (pode estar em aba oculta)
  const nomeInput = document.querySelector('#form-cliente [name="nomeFantasia"]');
  if (!nomeInput.value.trim()) {
    mudarTabCliente(
      document.querySelector('#form-tabs-cliente .form-tab'),
      'ftab-empresa'
    );
    nomeInput.focus();
    mostrarToast('Nome Fantasia é obrigatório.', 'erro');
    return;
  }

  const dados = {};
  new FormData(document.getElementById('form-cliente'))
    .forEach((val, key) => { dados[key] = val.trim(); });

  const btnSalvar = document.querySelector('#overlay-cliente .btn-primario');
  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando…';

  try {
    if (id) {
      await db.collection('clientes').doc(id).update(dados);
      mostrarToast('Cliente atualizado!', 'sucesso');
    } else {
      dados.dataCadastro = firebase.firestore.FieldValue.serverTimestamp();
      await db.collection('clientes').add(dados);
      mostrarToast('Cliente cadastrado!', 'sucesso');
    }
    fecharModal('cliente');
  } catch (err) {
    mostrarToast('Erro ao salvar cliente.', 'erro');
    btnSalvar.disabled = false;
    btnSalvar.textContent = 'Salvar';
    console.error(err);
  }
}

// ── Excluir ───────────────────────────────────────────────────
function confirmarExcluirCliente(id, nome) {
  criarModal('confirmar', 'Excluir Cliente',
    `<p>Tem certeza que deseja excluir <strong>${escapeHtml(nome)}</strong>?</p>
     <p class="text-sm text-muted mt-3">Esta ação não pode ser desfeita.</p>`,
    `<button class="btn btn-secundario" onclick="fecharModal('confirmar')">Cancelar</button>
     <button class="btn btn-perigo" onclick="excluirCliente('${id}')">Excluir</button>`
  );
}

async function excluirCliente(id) {
  try {
    await db.collection('clientes').doc(id).delete();
    mostrarToast('Cliente excluído.', 'sucesso');
    fecharModal('confirmar');
  } catch (err) {
    mostrarToast('Erro ao excluir cliente.', 'erro');
    console.error(err);
  }
}

// ── Exportar CSV ──────────────────────────────────────────────
function exportarCSVClientes() {
  const busca  = (document.getElementById('busca-clientes').value || '').toLowerCase();
  const status = document.getElementById('filtro-status-clientes').value;
  const lista  = _clientesCache.filter(c => {
    const ok1 = !busca  || (c.nomeFantasia || '').toLowerCase().includes(busca);
    const ok2 = !status || (c.status || 'Ativo') === status;
    return ok1 && ok2;
  });

  if (!lista.length) { mostrarToast('Nenhum cliente para exportar.', 'aviso'); return; }

  const cols = [
    'Nome Fantasia','Razão Social','CNPJ','Setor','Subsetor','Status',
    'Principal Nome','Principal Celular','Principal Cargo','Principal Email',
    'Financeiro Nome','Financeiro Celular','Financeiro Cargo','Financeiro Email',
    'Marketing Nome','Marketing Celular','Marketing Cargo','Marketing Email',
    'Agência Nome','Agência Contato','Agência Celular','Agência Cargo','Agência Email',
    'Instagram','Facebook','Site','WhatsApp',
    'Endereço','CEP','Cidade','Estado',
    'Outras Informações','Trabalhos Realizados'
  ];

  const esc = v => '"' + String(v || '').replace(/"/g, '""') + '"';

  const linhas = lista.map(c => [
    c.nomeFantasia, c.razaoSocial, c.cnpj, c.setor, c.subsetor, c.status || 'Ativo',
    c.propNome, c.propCelular, c.propCargo, c.propEmail,
    c.finNome, c.finCelular, c.finCargo, c.finEmail,
    c.mktNome, c.mktCelular, c.mktCargo, c.mktEmail,
    c.agenciaNome, c.agenciaContato, c.agenciaCelular, c.agenciaCargo, c.agenciaEmail,
    c.instagram, c.facebook, c.site, c.whatsapp,
    c.endereco, c.cep, c.cidade, c.estado,
    c.outrasInformacoes, c.trabalhosRealizados
  ].map(esc).join(';'));

  const csv = '﻿' + cols.map(esc).join(';') + '\n' + linhas.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'clientes_' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarToast(`${lista.length} clientes exportados.`, 'sucesso');
}

// ── Utilitário para importação (Etapa 5) ─────────────────────
async function buscarOuCriarClientePorNome(nome) {
  if (!nome) return null;
  const snap = await db.collection('clientes')
    .where('nomeFantasia', '==', nome).limit(1).get();
  if (!snap.empty) return snap.docs[0].id;
  const ref = await db.collection('clientes').add({
    nomeFantasia: nome,
    status: 'Ativo',
    dataCadastro: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}
