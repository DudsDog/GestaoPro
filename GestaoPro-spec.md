# GestãoPro — Especificação do sistema

> Documento de referência para construir o sistema. Leia este arquivo inteiro
> antes de escrever qualquer código. Antes de começar, me faça as perguntas que
> faltarem. Construa em etapas pequenas (ver "Ordem de construção"), pedindo minha
> aprovação a cada etapa concluída.

## 1. O que é

CRM interno de uma agência de mídia/publicidade no Brasil. Centraliza o cadastro
de clientes e o histórico de autorizações de veiculação (também chamadas de
"PR" / Propostas), e gera um PDF da autorização pronto para enviar ao cliente.
Várias pessoas acessam pela nuvem, com login, vendo os mesmos dados.

## 2. Stack recomendada (econômica e robusta)

- Frontend: site web simples e limpo (pode ser HTML/CSS/JS puro ou um framework
  leve — você decide o que for mais sustentável; priorize simplicidade).
- Banco de dados: **Firebase Firestore**.
- Login: **Firebase Authentication** (e-mail e senha).
- Hospedagem: **Firebase Hosting**.
- Regras de segurança: só usuário autenticado lê/escreve (configurar por último).

Tudo isso cabe no plano gratuito do Firebase para o volume desta agência.

## 3. Idioma e formatos

- Interface 100% em português (pt-BR).
- Valores monetários em Reais (R$), com separador de milhar e duas casas.
- Datas no formato dd/mm/aaaa.

## 4. Entidade: CLIENTES

Formulário organizado nestes blocos (espelham a planilha atual):

**Empresa**
- Nome fantasia
- Setor
- Subsetor

**Proprietário (contato principal)**
- Contato (nome), Celular, Cargo, E-mail

**Agência de propaganda (contato)**
- Nome da agência, Contato, Celular, Cargo, E-mail

**Mídias sociais**
- Instagram, Facebook, Site, WhatsApp, Outras redes

**Dados cadastrais**
- Razão social, CNPJ, Telefone, Endereço, Complemento, CEP, Cidade/Estado

**Sistema**
- Status (Ativo, Inativo, Prospect)
- Trabalhos realizados (texto longo)
- Outras informações (texto longo)
- Data de cadastro (preenchida automaticamente)

## 5. Entidade: AUTORIZAÇÕES DE VEICULAÇÃO (PR / Proposta)

Cada registro pertence a um cliente e tem:

- **Nº da PR** — gerado automaticamente (ver seção 6)
- Cliente (relacionado à entidade Clientes)
- PI/PO/AF (texto livre — referência do pedido; **não** gerar automático)
- Descrição / Campanha
- Valor bruto (R$)
- Valor líquido (R$)
- Mês de referência
- Ano
- Quantidade
- Agência
- Contato
- Conta
- Responsável
- E-mail
- Meio de pagamento
- Data de pagamento
- NF (número da nota)
- Data de emissão da NF
- Data da postagem
- Status (Proposta, Autorizada, Faturada, Paga, Cancelada)
- Data de criação (automática)

## 6. Numeração automática da PR

- Formato: **`PR 001/26`** = `PR` + número sequencial de 3 dígitos com zero à
  esquerda + `/` + ano com 2 dígitos.
- O sequencial **reinicia a cada ano** (em 2027 volta para `PR 001/27`).
- Gerado **somente** ao salvar uma autorização nova criada dentro do sistema.
- Garanta que dois usuários salvando ao mesmo tempo nunca recebam o mesmo número
  (use uma transação/contador no Firestore).
- Registros **importados** do histórico mantêm o número original (não gerar novo).

## 7. Importação do histórico (CSV)

Botão "Importar histórico" que aceita um CSV exportado da aba
"Autorização de Veiculação". As colunas vêm nesta ordem:

```
Cliente | PI/PO/AF | Valor Bruto | Valor líquido | Mês Referência | Ano | NF |
Data Emissão NF | Data de Pagamento | Proposta | Descrição/Campanha | Agência |
Contato | Conta | Cliente (detalhe) | Responsável | email | Quantidade |
Meio de pagamento | Data da postagem
```

Regras:
- A coluna **Proposta** vira o nº da PR já existente (não gerar número novo).
- Se o cliente do registro ainda não existir no cadastro, **criar automaticamente**
  pelo nome (cadastro mínimo, que depois posso completar).
- Mostrar uma prévia antes de confirmar a importação.
- São cerca de 870 registros; a importação precisa aguentar esse volume.

## 8. Telas

1. **Painel inicial** — totais: nº de clientes; autorizações agrupadas por status;
   soma de valor bruto e líquido do mês e do ano atual.
2. **Clientes** — lista com busca + formulário de cadastro/edição (nos blocos da
   seção 4).
3. **Autorizações** — lista com filtros por cliente, status e ano (mostrando PR,
   cliente, campanha, valor e status) + formulário de cadastro/edição (a PR é
   gerada sozinha ao salvar).
4. **Visualização da autorização** — organizada como documento, com botão
   "Gerar PDF".

## 9. Geração de PDF

Botão "Gerar PDF" na tela de visualização. O PDF deve ter:
- Cabeçalho da agência (deixar um espaço para logo e dados — eu preencho depois).
- Nº da PR em destaque.
- Dados do cliente.
- Descrição/campanha.
- Tabela com os valores (bruto, líquido), quantidade, meio e data de pagamento.
- Mês de referência e ano.
- Espaço para condições/observações.
- Visual profissional, pronto para enviar ao cliente.

## 10. Login / multiusuário

- Login por e-mail e senha (Firebase Auth).
- Todos os usuários autenticados compartilham os mesmos dados.
- Uma tela simples para convidar/criar novos usuários.

## 11. Ordem de construção (fazer nesta sequência, aprovando cada etapa)

1. Estrutura do projeto + conexão com o Firebase (Firestore + Auth).
2. Cadastro e lista de Clientes.
3. Cadastro e lista de Autorizações (sem PDF ainda).
4. Numeração automática da PR.
5. Importação do histórico via CSV.
6. Geração do PDF da autorização.
7. Painel inicial com os totais.
8. Login multiusuário + regras de segurança do Firestore.
9. Publicar no Firebase Hosting.
