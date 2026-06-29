// ════════════════════════════════════════════════════════════
//  CONFIGURAÇÃO DO FIREBASE
//  Substitua os valores abaixo pelas credenciais do seu projeto.
//
//  Como obter:
//  1. Acesse https://console.firebase.google.com
//  2. Abra o projeto > ⚙ Configurações do projeto
//  3. Role até "Seus apps" > clique em "</> Web" (ou adicione um app web)
//  4. Copie o objeto firebaseConfig e cole aqui.
// ════════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyBqkPg5kUkDmdDdIuADigsv5kXbuoDEQzc",
  authDomain:        "gestaopro-tribuna.firebaseapp.com",
  projectId:         "gestaopro-tribuna",
  storageBucket:     "gestaopro-tribuna.firebasestorage.app",
  messagingSenderId: "680228382801",
  appId:             "1:680228382801:web:b964502bc4c6e87e1e3070"
};

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();
