// ════════════════════════════════════════════════════════════
//  auth.js — Login e logout
// ════════════════════════════════════════════════════════════

const formLogin = document.getElementById('form-login');
const loginErro = document.getElementById('login-erro');
const btnEntrar = document.getElementById('btn-entrar');
const btnLogout = document.getElementById('btn-logout');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginErro.hidden = true;
  btnEntrar.disabled = true;
  btnEntrar.textContent = 'Entrando…';

  const email = document.getElementById('login-email').value.trim();
  const senha = document.getElementById('login-senha').value;

  try {
    await auth.signInWithEmailAndPassword(email, senha);
  } catch (err) {
    loginErro.textContent = traduzirErroAuth(err.code);
    loginErro.hidden = false;
    btnEntrar.disabled = false;
    btnEntrar.textContent = 'Entrar';
  }
});

btnLogout.addEventListener('click', async () => {
  await auth.signOut();
  formLogin.reset();
});

function traduzirErroAuth(code) {
  const msgs = {
    'auth/user-not-found':   'E-mail não encontrado.',
    'auth/wrong-password':   'Senha incorreta.',
    'auth/invalid-email':    'E-mail inválido.',
    'auth/too-many-requests':'Muitas tentativas. Tente novamente mais tarde.',
    'auth/invalid-credential': 'E-mail ou senha incorretos.',
    'auth/network-request-failed': 'Erro de rede. Verifique sua conexão.',
  };
  return msgs[code] || 'Erro ao entrar. Verifique suas credenciais.';
}
