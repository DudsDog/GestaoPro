// ════════════════════════════════════════════════════════════
//  drive.js — Integração com Google Drive
// ════════════════════════════════════════════════════════════

const _DRIVE_CLIENT_ID = '680228382801-3oleianqc8d5cd8471jo6dkn936utkv8.apps.googleusercontent.com';
const _DRIVE_PASTA_ID  = '1H3NcRIxL54akprc48ob1NmJ_cYKobmYY'; // ID da pasta compartilhada
const _DRIVE_SCOPE     = 'https://www.googleapis.com/auth/drive.file';

let _driveTokenClient = null;
let _driveAccessToken = null;
let _drivePendente    = null;

function inicializarDrive() {
  if (!window.google || !google.accounts) return;
  _driveTokenClient = google.accounts.oauth2.initTokenClient({
    client_id: _DRIVE_CLIENT_ID,
    scope:     _DRIVE_SCOPE,
    callback:  (resp) => {
      if (resp.error) {
        mostrarToast('Erro ao autorizar Google Drive.', 'erro');
        return;
      }
      _driveAccessToken = resp.access_token;
      if (_drivePendente) { _drivePendente(); _drivePendente = null; }
    },
  });
}

function salvarNoDrive(blob, nomeArquivo) {
  if (!_driveTokenClient) { console.warn('Drive não inicializado.'); return; }

  const executar = () => {
    const meta = JSON.stringify({ name: nomeArquivo, parents: [_DRIVE_PASTA_ID] });
    const form = new FormData();
    form.append('metadata', new Blob([meta], { type: 'application/json' }));
    form.append('file', blob);

    fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method:  'POST',
      headers: { Authorization: 'Bearer ' + _driveAccessToken },
      body:    form,
    })
    .then(r => r.json())
    .then(data => {
      if (data.id) {
        mostrarToast('PDF salvo no Google Drive!', 'sucesso');
      } else {
        mostrarToast('Erro ao salvar no Drive.', 'erro');
        console.error(data);
      }
    })
    .catch(() => mostrarToast('Erro ao salvar no Drive.', 'erro'));
  };

  if (_driveAccessToken) {
    executar();
  } else {
    _drivePendente = executar;
    _driveTokenClient.requestAccessToken();
  }
}
