// ════════════════════════════════════════════════════════════
//  pdf.js — Geração de PDF das Autorizações de Veiculação
// ════════════════════════════════════════════════════════════

// ── Catálogo de Produtos ─────────────────────────────────────
const _PRODUTOS = {
  '1': {
    nome: 'PUBLIEDITORIAL',
    blocos: [
      { titulo: 'Objetivo', texto: 'divulgar informações institucionais, lançamentos, campanhas e comunicados de forma clara, confiável e contextualizada.' },
      { texto: 'Publicação de conteúdo fornecido pelo cliente, em formato de texto e imagens, no portal Tribuna de Jundiaí. O material passa por revisão editorial, garantindo clareza, correção ortográfica, adequação à linha editorial do portal e aplicação de boas práticas de SEO editorial, favorecendo a leitura contínua e a organização do conteúdo para mecanismos de busca.' },
      { texto: 'Além da publicação no portal, o conteúdo será divulgado nas redes sociais oficiais da Tribuna de Jundiaí, incluindo 1 postagem + 1 repost do mesmo conteúdo no Instagram e no Facebook, em formatos de feed e stories.' },
      { titulo: 'Resultado esperado', texto: 'visibilidade qualificada, credibilidade editorial e direcionamento de tráfego para o conteúdo publicado.' },
      { titulo: 'Destaque na Home (opcional)', texto: 'O conteúdo poderá ser exibido como a primeira notícia da Home, ampliando significativamente o impacto visual e a taxa de leitura entre os usuários que acessam o portal.\nPlataformas: desktop e mobile\nPeríodo de exposição: 5 dias' },
      { titulo: 'Observações importantes', lista: ['A publicação do conteúdo é permanente no portal Tribuna de Jundiaí.', 'O material é identificado com a tag "Conteúdo Patrocinado", garantindo transparência ao leitor.', 'Todo o conteúdo deve estar em conformidade com o Código de Ética e Conduta da Tribuna de Jundiaí.'] },
    ]
  },
  '2': {
    nome: 'CONTEÚDO PERSONALIZADO (BRANDED CONTENT)',
    blocos: [
      { titulo: 'Objetivo', texto: 'posicionamento de marca, storytelling e construção de autoridade.' },
      { texto: 'Neste formato, a produção do conteúdo é realizada integralmente pela equipe da Tribuna de Jundiaí, com desenvolvimento de texto exclusivo, abordagem jornalística e construção narrativa alinhada à identidade, aos valores e aos objetivos da marca. A linguagem é adaptada ao perfil da audiência local, garantindo leitura fluida, contextualização e conexão com o público.' },
      { texto: 'O conteúdo é estruturado com boas práticas de SEO editorial, priorizando organização, escaneabilidade e relevância do texto, favorecendo a leitura contínua e a visibilidade orgânica ao longo do tempo.' },
      { texto: 'Além da publicação permanente no portal Tribuna de Jundiaí, o conteúdo será divulgado nas redes sociais oficiais da Tribuna, incluindo 1 postagem no Instagram e no Facebook, em formatos de feed e stories.' },
      { titulo: 'Resultado esperado', texto: 'fortalecimento institucional, percepção positiva da marca, aumento de autoridade e presença digital duradoura em ambiente editorial de credibilidade.' },
      { titulo: 'Destaque na Home (opcional)', texto: 'O conteúdo poderá ser exibido como a primeira notícia da Home, ampliando significativamente o impacto visual e a taxa de leitura entre os usuários que acessam o portal.\nPlataformas: desktop e mobile\nPeríodo de exposição: 5 dias' },
      { titulo: 'Observações importantes', lista: ['A publicação do conteúdo é permanente no portal Tribuna de Jundiaí.', 'A produção do texto é de responsabilidade da equipe da Tribuna de Jundiaí, com base em briefing e informações fornecidas pelo cliente.', 'O conteúdo será publicado após aprovação final do cliente, respeitando a linha editorial, os critérios jornalísticos e o Código de Ética e Conduta da Tribuna de Jundiaí.'] },
    ]
  },
  '3': {
    nome: 'CONTEÚDO PERSONALIZADO EM VÍDEO',
    blocos: [
      { titulo: 'Objetivo', texto: 'apresentar marcas, produtos, serviços ou locais por meio de matéria jornalística em vídeo, com foco em entrevistas, contextualização e linguagem editorial.' },
      { texto: 'Produção de matéria jornalística em vídeo realizada pela Tribuna de Jundiaí, com captação e edição de imagens, entrevistas e finalização editorial. O conteúdo pode ser utilizado para entrevistas, apresentação de espaços, produtos ou serviços, sempre com abordagem informativa e contextualizada.' },
      { texto: 'O material será entregue em formato único, definido antes da contratação, podendo ser vertical (9:16) ou horizontal (16:9), com duração máxima de até 3 minutos.' },
      { texto: 'A matéria em vídeo poderá ser publicada no portal Tribuna de Jundiaí, no YouTube (incluindo YouTube Shorts) e nas redes sociais Instagram e Facebook, conforme a estratégia definida e as especificações técnicas escolhidas pelo cliente, respeitando os critérios e limitações técnicas de cada plataforma.' },
      { titulo: 'Resultado esperado', texto: 'alto engajamento, maior tempo de atenção do público e fortalecimento da imagem da marca em ambiente editorial de credibilidade.' },
      { titulo: 'Observações importantes', lista: ['Limitações técnicas das plataformas podem impactar estratégias de impulsionamento ou patrocínio do conteúdo.', 'O conteúdo será publicado após aprovação final do cliente, respeitando a linha editorial e o Código de Ética e Conduta da Tribuna de Jundiaí.', 'Entrega final do vídeo em até 5 dias úteis após a gravação.'] },
    ]
  },
  '4': {
    nome: 'COBERTURA DE EVENTO EM VÍDEO',
    blocos: [
      { titulo: 'Objetivo', texto: 'registrar e divulgar eventos, inaugurações, lançamentos e ações institucionais por meio de matéria jornalística em vídeo, com linguagem editorial e foco informativo.' },
      { texto: 'Produção de matéria jornalística em vídeo para registro dos principais momentos do evento, com contextualização editorial voltada à divulgação institucional.' },
      { titulo: 'Resultado esperado', texto: 'ampliação do alcance do evento, fortalecimento da imagem institucional e geração de visibilidade pós-evento em ambiente editorial de credibilidade.' },
      { titulo: 'Especificações', lista: ['1 matéria jornalística em vídeo por evento', 'Captação e edição de imagens com abordagem editorial', 'Até 3 entrevistas, previamente alinhadas, com representantes da marca, convidados ou especialistas.', 'O vídeo final será entregue em formato vertical (9:16), com duração máxima de até 3 minutos.'] },
      { titulo: 'Observações importantes', lista: ['A publicação seguirá os critérios técnicos e editoriais de cada plataforma.', 'O conteúdo será publicado após aprovação final do cliente, respeitando a linha editorial e o Código de Ética e Conduta da Tribuna de Jundiaí.', 'Entrega final do vídeo em até 5 dias úteis após a gravação.'] },
      { titulo: 'Formato Adicional (Opcional)', texto: 'Matéria no Portal — Adaptação do vídeo para o formato texto/imagem, para publicação no portal Tribuna de Jundiaí.' },
    ]
  },
  '5': {
    nome: 'POSTAGEM MÍDIAS SOCIAIS',
    blocos: [
      { titulo: 'Objetivo', texto: 'ampliar o alcance de campanhas promocionais ou institucionais por meio dos perfis oficiais da Tribuna de Jundiaí.' },
      { texto: 'Publicação de conteúdo promocional ou institucional nas mídias sociais oficiais da Tribuna de Jundiaí, utilizando formatos que potencializam alcance e visibilidade dentro de cada plataforma.' },
      { titulo: 'Formatos possíveis', lista: ['Feed (Facebook e Instagram): publicação em imagem única, carrossel de imagens ou vídeo.', 'Reels (Instagram e Facebook): vídeos curtos e verticais.', 'Stories (Facebook e Instagram): complemento obrigatório da postagem, acompanhando tanto publicações de feed quanto de reels.'] },
      { titulo: 'Publicação', texto: 'Cada contratação contempla 1 postagem e 1 repostagem do mesmo conteúdo, garantindo maior exposição.\nA veiculação será sempre combinada em mais de um formato — feed + stories ou reels + stories — de acordo com o material fornecido pelo cliente. Essa estratégia amplia o alcance e aproveita os diferentes recursos disponíveis em cada plataforma.' },
      { titulo: 'Resultado esperado', texto: 'aumento de alcance, presença ativa nas redes sociais e reforço da comunicação junto ao público da Tribuna de Jundiaí.' },
      { titulo: 'Observações importantes', lista: ['O envio do conteúdo final (arte, vídeo e texto) é de responsabilidade do cliente.', 'O material é exclusivo para redes sociais e não será publicado no portal Tribuna de Jundiaí.', 'A veiculação em cada plataforma será definida de acordo com o formato do material, respeitando os critérios técnicos de cada canal.', 'Todo o conteúdo passa por revisão e deve estar em conformidade com o Código de Ética e Conduta da Tribuna de Jundiaí.', 'O material deverá ser enviado com no mínimo 1 dia de antecedência da data prevista para publicação.'] },
    ]
  },
  '6': {
    nome: 'POSTAGEM CARROSSEL DE CONTEÚDO',
    blocos: [
      { titulo: 'Objetivo', texto: 'ampliar o alcance de campanhas promocionais ou institucionais por meio dos perfis oficiais da Tribuna de Jundiaí.' },
      { texto: 'Criação e publicação de conteúdo promocional ou institucional nas redes sociais, composto por múltiplas artes (cards), cada uma com texto informativo combinado a imagens. Produção realizada pela equipe técnica da Tribuna de Jundiaí. O material também pode incluir vídeo complementar.' },
      { titulo: 'Formato possível', lista: ['Feed (Facebook e Instagram)'] },
      { titulo: 'Resultado esperado', texto: 'maior retenção de atenção do público, aumento do tempo de permanência na postagem e ampliação da relevância do conteúdo, fatores que contribuem para melhor distribuição orgânica pelas plataformas.' },
      { titulo: 'Especificações', lista: ['1 carrossel de conteúdo por contratação', 'Criação dos cards realizada pela equipe da Tribuna de Jundiaí, a partir de briefing fornecido pelo cliente', 'Quantidade de cards definida conforme a necessidade do conteúdo, limitada a até 12 artes.'] },
      { titulo: 'Observações', lista: ['O briefing do conteúdo é de responsabilidade do cliente.', 'O material deverá ser enviado com até 5 dias de antecedência da publicação.', 'O conteúdo é exclusivo para redes sociais, não será publicado no portal Tribuna de Jundiaí.', 'A produção de vídeo não está inclusa na proposta.'] },
    ]
  },
  '8': {
    nome: 'PACOTE TRIBUNA 1 (1 PUBLI + 4 POSTAGENS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'oferecer presença integrada no portal e nas redes sociais da Tribuna de Jundiaí, combinando conteúdo editorial com distribuição em mídias sociais, garantindo maior visibilidade e consistência de comunicação.' },
      { texto: 'O Pacote Tribuna 1 reúne publicação no portal e postagens nas redes sociais oficiais da Tribuna de Jundiaí, sendo indicado para marcas e instituições que buscam divulgação estruturada, com melhor custo-benefício.' },
      { titulo: 'Resultado esperado', texto: 'aumento de visibilidade, reforço de credibilidade editorial e presença ativa nas redes sociais da Tribuna.' },
      { titulo: 'Itens inclusos — Publieditorial', lista: ['1 conteúdo fornecido pelo cliente, em formato de texto e imagens.', 'Publicação permanente no portal Tribuna de Jundiaí.', 'Revisão editorial e adequação à linha editorial do portal.', 'Divulgação nas redes sociais (1 postagem + 1 repost).'] },
      { titulo: 'Itens inclusos — Postagens em Mídias Sociais', lista: ['4 publicações nos perfis oficiais da Tribuna de Jundiaí.', 'Combinação de formatos: feed + stories ou reels + stories.', 'Conteúdo (arte, vídeo e texto) fornecido pelo cliente.'] },
      { titulo: 'Condições do pacote', lista: ['Os conteúdos poderão ser veiculados de forma distribuída, conforme alinhamento prévio.', 'O pacote deverá ser utilizado no prazo máximo de 3 meses a partir da contratação.', 'As publicações seguem os critérios técnicos e editoriais de cada plataforma.', 'Todo o conteúdo será publicado após aprovação final do cliente, respeitando o Código de Ética e Conduta da Tribuna de Jundiaí.'] },
    ]
  },
  '9': {
    nome: 'PACOTE TRIBUNA 2 (4 POSTAGENS NAS MÍDIAS SOCIAIS)',
    blocos: [
      { texto: 'Publicação de 4 conteúdos promocionais ou institucionais nas mídias sociais oficiais da Tribuna de Jundiaí.' },
      { titulo: 'Formatos', lista: ['Vídeo — Facebook e Instagram (reels e Stories).', 'Imagens e textos — Facebook e Instagram (Feed e Stories).'] },
      { titulo: 'Ativações para ampliar alcance e engajamento', lista: ['Collab no Instagram: publicação em parceria entre o perfil do Tribuna e o perfil do cliente.', 'Impulsionamento com mídia paga: investimento a ser definido à parte, conforme estratégia e orçamento.'] },
      { titulo: 'Observações', lista: ['O envio do conteúdo final (arte, vídeo e texto) é de responsabilidade do cliente.', 'O material não será publicado no portal da Tribuna de Jundiaí, sendo exclusivo para redes sociais.', 'A veiculação em cada plataforma será definida de acordo com o formato e duração do vídeo, respeitando os critérios técnicos de cada canal.', 'O material deverá ser enviado com até 1 dia de antecedência da publicação.'] },
    ]
  },
  '10': {
    nome: 'DIVULGAÇÃO DE VAGA DE EMPREGO',
    blocos: [
      { titulo: 'Objetivo', texto: 'ampliar o alcance das oportunidades de emprego e acelerar a divulgação das vagas junto ao público local e regional.' },
      { texto: 'Veiculação de conteúdo informativo sobre vagas de emprego na editoria Empregos do portal Tribuna de Jundiaí, com distribuição integrada nas plataformas digitais do veículo, potencializando o alcance da oportunidade.' },
      { titulo: 'Resultado esperado', texto: 'maior visibilidade das vagas, aumento do número de candidatos e agilidade no processo de divulgação.' },
      { titulo: 'Canais de divulgação', lista: ['Publicação na editoria Empregos do portal Tribuna de Jundiaí.', 'Postagens nos perfis oficiais da Tribuna de Jundiaí no Facebook e Instagram (feed).', 'Divulgação nos 5 grupos exclusivos de WhatsApp do portal, voltados para oportunidades de emprego.'] },
      { titulo: 'Observações importantes', lista: ['O valor da divulgação é por publicação, independentemente da quantidade de vagas ofertadas.', 'Todo o conteúdo é de responsabilidade do cliente.', 'A publicação seguirá os critérios editoriais e o Código de Ética e Conduta da Tribuna de Jundiaí.'] },
    ]
  },
  '11': {
    nome: 'PUBLICIDADE LEGAL',
    blocos: [
      { titulo: 'Objetivo', texto: 'realizar a publicação de editais, comunicados e avisos legais em ambiente digital oficial, garantindo visibilidade, transparência e acesso público à informação.' },
      { texto: 'Publicação de conteúdo legal fornecido pelo cliente na área específica de Publicidade Legal do portal Tribuna de Jundiaí, com divulgação complementar nas redes sociais oficiais da Tribuna de Jundiaí.' },
      { titulo: 'Resultado esperado', texto: 'atendimento às exigências legais de publicidade, ampla visibilidade regional e fácil acesso público ao conteúdo publicado.' },
      { titulo: 'Especificações', lista: ['Publicação de 1 conteúdo por contratação', 'Área específica do portal: www.tribunadejundiai.com.br/publicidadelegal', 'Formatos aceitos: texto ou imagem'] },
      { titulo: 'Observações importantes', lista: ['Todo o conteúdo é de responsabilidade do cliente.', 'A publicação seguirá os critérios técnicos e editoriais do portal Tribuna de Jundiaí.'] },
    ]
  },
};

// ── Sub-opções do produto 7 (Veiculação de Banner) ───────────
const _BANNERS = {
  '7a': {
    nome: 'VEICULAÇÃO DE BANNER – HEADER (HOME)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir máxima visibilidade e impacto imediato, posicionando a marca no topo do portal Tribuna de Jundiaí, com alta taxa de viewability no primeiro carregamento da página.' },
      { texto: 'O banner Header é a posição premium da Home, exibido logo abaixo do logotipo da Tribuna de Jundiaí, proporcionando grande volume de impressões qualificadas e forte destaque institucional.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: topo do site (Home), logo abaixo do logotipo', 'Desktop: 728 × 90 px (Leaderboard) ou 970 × 90 px (Super Leaderboard)', 'Mobile: 300 × 100 px ou 320 × 100 px', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para desktop e um para mobile.', 'É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7b': {
    nome: 'VEICULAÇÃO DE BANNER – MIDDLE PAGE (HOME)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir alta visibilidade durante o fluxo de navegação na Home, impactando o usuário no scroll inicial da página.' },
      { texto: 'O banner Middle Page é uma posição estratégica da Home do portal Tribuna de Jundiaí, exibido entre os principais blocos de conteúdo, proporcionando forte exposição ao longo da navegação.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: Home, entre as seções da página (Últimas Notícias, Entretenimento, Vídeos, Política, Educação, entre outras)', 'Banner rotativo: até 5 posições (conforme disponibilidade)', 'Desktop: 728 × 90 px (Leaderboard) ou 970 × 250 px (Billboard)', 'Mobile: 300 × 250 px (Retângulo Médio)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para desktop (entre as opções disponíveis).', 'É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7c': {
    nome: 'VEICULAÇÃO BANNER ASIDE (HOME)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir visibilidade contínua durante a navegação, mantendo a marca presente ao longo da leitura da página inicial do portal.' },
      { texto: 'O banner Aside é uma posição fixa na barra lateral da Home do portal Tribuna de Jundiaí, proporcionando exposição constante enquanto o usuário percorre o conteúdo.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: barra lateral esquerda da Home', 'Formato disponível (desktop): 300 × 250 px (Retângulo Médio) ou 300 × 600 px (Half Page)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG', 'Versão mobile: não disponível'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para desktop (entre as opções disponíveis).', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7d': {
    nome: 'VEICULAÇÃO DE BANNER – HEADER (EDITORIAS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir destaque e impacto imediato dentro do contexto editorial, posicionando a marca no topo das páginas de editorias do portal Tribuna de Jundiaí.' },
      { texto: 'O banner Header é a posição premium das páginas de editorias, exibido logo abaixo do logotipo, oferecendo alta taxa de viewability no primeiro carregamento da página e forte exposição qualificada junto ao público segmentado por tema.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: topo das páginas de editorias, logo abaixo do logotipo', 'Desktop: 728 × 90 px (Leaderboard) ou 970 × 90 px (Super Leaderboard)', 'Mobile: 300 × 100 px ou 320 × 100 px', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para desktop e um para mobile.', 'É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7e': {
    nome: 'VEICULAÇÃO DE BANNER – IN-FEED (EDITORIAS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'impactar o público durante o consumo de conteúdos editoriais, integrando a marca ao fluxo natural de leitura das editorias.' },
      { texto: 'O banner In-Feed é exibido de forma intercalada na listagem de matérias das editorias do portal Tribuna de Jundiaí, garantindo alta visualização e inserção contextual junto ao conteúdo consumido pelo usuário.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: listagem de matérias das editorias', 'Posição: até 2 espaços por editoria', 'Desktop: 728 × 90 px (Leaderboard)', 'Mobile: 300 × 250 px (Retângulo Médio)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7f': {
    nome: 'VEICULAÇÃO BANNER ASIDE (EDITORIAS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir visibilidade contínua em contexto editorial segmentado, mantendo a marca presente durante a navegação do usuário pelas editorias do portal.' },
      { texto: 'O banner Aside é uma posição fixa na barra lateral das páginas de editorias do portal Tribuna de Jundiaí, proporcionando exposição constante ao longo da leitura.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: barra lateral esquerda das páginas de editorias', 'Formato disponível (desktop): 300 × 250 px (Retângulo Médio) ou 300 × 600 px (Half Page)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG', 'Versão mobile: não disponível'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para veiculação.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7g': {
    nome: 'VEICULAÇÃO BANNER HEADER (MATÉRIA)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir destaque e impacto imediato no início da leitura das matérias, posicionando a marca em área de alta atenção do usuário.' },
      { texto: 'O banner Header é a posição premium no topo das páginas de matérias do portal Tribuna de Jundiaí, exibido logo abaixo do logotipo, proporcionando alta taxa de viewability no primeiro carregamento da página.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: topo das páginas de todas as matérias, logo abaixo do logotipo da Tribuna de Jundiaí', 'Desktop: 728 × 90 px (Leaderboard) ou 970 × 90 px (Super Leaderboard)', 'Mobile: 300 × 100 px (Mobile Banner) ou 320 × 100 px (Large Mobile Banner)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para desktop e um para mobile.', 'É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7h': {
    nome: 'VEICULAÇÃO DE BANNER – IN-TEXT (MATÉRIAS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'alcançar grande volume de impressões durante a leitura das matérias, aproveitando momentos de alta atenção do usuário.' },
      { texto: 'O banner In-Text é exibido de forma integrada ao corpo das matérias publicadas no portal Tribuna de Jundiaí, garantindo amplo alcance e excelente desempenho em campanhas de grande exposição.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: corpo de todas as matérias, em todas as editorias', 'Posições disponíveis: até 2 posições por matéria', 'Desktop: 728 × 90 px (Leaderboard)', 'Mobile: 300 × 250 px (Retângulo Médio)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Observações importantes', lista: ['É obrigatória a entrega das artes nos formatos selecionados para desktop e mobile.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7i': {
    nome: 'VEICULAÇÃO DE BANNER – ASIDE (MATÉRIAS)',
    blocos: [
      { titulo: 'Objetivo', texto: 'garantir visibilidade contínua durante a navegação, mantendo a marca presente enquanto o usuário percorre a página da matéria.' },
      { texto: 'O banner Aside é uma posição fixa na barra lateral das páginas de matérias do portal Tribuna de Jundiaí, proporcionando exposição constante ao longo da leitura.' },
      { titulo: 'Especificações técnicas', lista: ['Localização: barra lateral esquerda das páginas de matérias', 'Formato disponível (desktop): 300 × 250 px (Retângulo Médio) ou 300 × 600 px (Half Page)', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG', 'Versão mobile: não disponível'] },
      { titulo: 'Observações importantes', lista: ['O cliente deverá escolher apenas um formato para veiculação.', 'O material deverá ser enviado com mínimo de 1 dia útil de antecedência à data de início da veiculação.'] },
      { titulo: 'Comercialização', lista: ['Contratação preferencial no formato mensal.', 'A veiculação por diária está disponível para ações pontuais e considera acréscimo de 20% sobre o valor proporcional mensal.'] },
    ]
  },
  '7j': {
    nome: 'BANNER POR CPM',
    blocos: [
      { titulo: 'Objetivo', texto: 'maximizar alcance e volume de impressões com controle de entrega, indicado para campanhas de alta exposição.' },
      { texto: 'Veiculação de banner publicitário no portal Tribuna de Jundiaí, em formatos desktop e mobile, com entrega baseada no volume de impressões contratadas (CPM), distribuídas em Home e ROS (Run of Site).' },
      { titulo: 'Especificações técnicas', lista: ['Localização: Home e ROS', 'Peso máximo: 150 kb', 'Formato do arquivo: GIF ou JPEG'] },
      { titulo: 'Formatos disponíveis', lista: ['Desktop: 300 × 600 px (Half Page) / 728 × 90 px (Leaderboard) / 970 × 90 px (Super Leaderboard) / 970 × 250 px (Billboard)'] },
      { titulo: 'Entrega de criativos (obrigatória)', lista: ['É obrigatório o envio de 1 criativo no formato 300 × 250 px (Retângulo Médio).', 'Além disso, o cliente poderá enviar até 2 criativos no formato desktop adicionais, escolhendo os formatos dentre a listagem de opções informada acima.'] },
      { titulo: 'Observações importantes', lista: ['Os materiais devem ser enviados com mínimo de 1 dia útil de antecedência da data de início da veiculação.', 'O comprovante de publicação e o relatório de entrega do Ad Manager serão disponibilizados após o término da campanha ou quando o volume total de impressões contratadas for integralmente entregue.', 'A compra de mídia é realizada exclusivamente por impressões, portanto não é permitida a escolha de posições específicas no portal.'] },
    ]
  },
};

// ── Sobre a Tribuna ───────────────────────────────────────────
const _SOBRE_TRIBUNA = {
  nome: 'SOBRE A TRIBUNA',
  isSobre: true,
  blocos: [
    { texto: '**Tribuna de Jundiaí** – Conectando pessoas, histórias e marcas com propósito!' },
    { texto: 'A Tribuna de Jundiaí é hoje o maior e mais influente portal de notícias da Região Metropolitana de Jundiaí, consolidada como referência em jornalismo regional de qualidade, credibilidade e forte conexão com a comunidade local.' },
    { texto: 'Em 2025, a Tribuna de Jundiaí foi eleita **Melhor Site de Notícias do Estado de São Paulo** pelo **Brasil Publisher Awards**, reconhecimento nacional que reforça a excelência editorial, a relevância digital e a confiança do público no nosso trabalho.' },
    { texto: 'Nosso propósito é informar, inspirar e fortalecer o senso de pertencimento da população, valorizando as histórias, eventos, marcas e iniciativas que fazem a região crescer. Para anunciantes e instituições, isso se traduz em **visibilidade qualificada, contexto editorial confiável e impacto real de comunicação.**' },
    { texto: 'Atualmente, a Tribuna de Jundiaí registra **mais de 4 milhões de pageviews mensais no portal**, além de um **alcance superior a 2,6 milhões de pessoas e mais de 21 milhões de visualizações mensais nas redes sociais.** Esses números refletem não apenas volume, mas **atenção, recorrência e engajamento**, fatores essenciais para campanhas institucionais, promocionais e de posicionamento de marca.' },
    { texto: 'Anunciar ou produzir conteúdo com a Tribuna de Jundiaí significa inserir sua marca em um ambiente editorial premiado, relevante e respeitado, potencializando resultados de comunicação de forma ética e estratégica.' },
  ]
};

// ── Geração de PDF com produtos já definidos na proposta ──────
function _selecionarContatoEGerar(id, proposta) {
  const conteudo = `
    <p style="font-size:13px;color:#64748b;margin-bottom:12px">
      ${proposta.produtosSelecionados.length} produto(s) selecionado(s) na proposta.
    </p>
    <div style="padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
      <p style="font-size:12px;font-weight:600;margin-bottom:8px;color:#374151">Contato no PDF:</p>
      <label class="banner-pdf-check">
        <input type="checkbox" name="pdf-contato-prop" value="agencia" checked> Agência de Propaganda
      </label>
      <label class="banner-pdf-check">
        <input type="checkbox" name="pdf-contato-prop" value="principal"> Principal
      </label>
    </div>`;

  const rodape = `
    <button class="btn btn-outline" onclick="fecharModal('pdf-contato-prop')">Cancelar</button>
    <button class="btn btn-primario" onclick="_gerarPDFComProdutosSalvos('${id}')">Gerar PDF</button>`;

  criarModal('pdf-contato-prop', 'Gerar PDF', conteudo, rodape);
}

function _gerarPDFComProdutosSalvos(id) {
  const proposta = (_propostasCache || []).find(x => x.id === id);
  if (!proposta) return;

  const contatosSel = [...document.querySelectorAll('input[name="pdf-contato-prop"]:checked')]
    .map(c => c.value);

  fecharModal('pdf-contato-prop');

  const itens = proposta.produtosSelecionados.map(item => ({
    nome:   item.nome,
    blocos: JSON.parse(JSON.stringify(item.blocos)),
  }));

  if (proposta.incluirSobre) {
    itens.unshift({
      nome:    _SOBRE_TRIBUNA.nome,
      isSobre: true,
      blocos:  JSON.parse(JSON.stringify(_SOBRE_TRIBUNA.blocos)),
    });
  }

  gerarPDFAutorizacao(id, null, null, contatosSel, itens);
}

// ── Modal de seleção de produto ───────────────────────────────
function selecionarProdutoPDF(id) {
  // Propostas: seleção de produto feita na aba Produto da proposta
  const reg = (_propostasCache || []).find(x => x.id === id);
  if (reg) {
    if (!reg.produtosSelecionados || !reg.produtosSelecionados.length) {
      mostrarToast('Edite a proposta e selecione os produtos na aba Produto.', 'aviso');
      return;
    }
    _selecionarContatoEGerar(id, reg);
    return;
  }

  const produtos = [
    { k: '1',  label: '1 — Publieditorial' },
    { k: '2',  label: '2 — Conteúdo Personalizado (Branded Content)' },
    { k: '3',  label: '3 — Conteúdo Personalizado em Vídeo' },
    { k: '4',  label: '4 — Cobertura de Evento em Vídeo' },
    { k: '5',  label: '5 — Postagem Mídias Sociais' },
    { k: '6',  label: '6 — Postagem Carrossel de Conteúdo' },
    { k: '7',  label: '7 — Veiculação de Banner' },
    { k: '8',  label: '8 — Pacote Tribuna 1 (1 Publi + 4 Postagens)' },
    { k: '9',  label: '9 — Pacote Tribuna 2 (4 Postagens)' },
    { k: '10', label: '10 — Divulgação de Vaga de Emprego' },
    { k: '11', label: '11 — Publicidade Legal' },
  ];

  const subBanners = [
    { k: '7a', label: 'Header (Home)' },
    { k: '7b', label: 'Middle Page (Home)' },
    { k: '7c', label: 'Aside (Home)' },
    { k: '7d', label: 'Header (Editorias)' },
    { k: '7e', label: 'In-Feed (Editorias)' },
    { k: '7f', label: 'Aside (Editorias)' },
    { k: '7g', label: 'Header (Matéria)' },
    { k: '7h', label: 'In-Text (Matérias)' },
    { k: '7i', label: 'Aside (Matérias)' },
    { k: '7j', label: 'Banner por CPM' },
  ];

  const checksHtml = produtos.map(p => `
    <label class="produto-pdf-radio">
      <input type="checkbox" name="produto-pdf" value="${p.k}"> ${p.label}
    </label>`).join('');

  const bannersHtml = subBanners.map(b => `
    <label class="banner-pdf-check">
      <input type="checkbox" name="banner-pdf-sub" value="${b.k}"> ${b.label}
    </label>`).join('');

  const conteudo = `
    <p style="margin-bottom:12px;font-size:13px;color:#64748b">Selecione um ou mais produtos para este PDF:</p>
    <div class="lista-produtos-pdf">${checksHtml}</div>
    <div id="banner-sub-pdf" style="display:none;margin-top:12px;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
      <p style="font-size:12px;font-weight:600;margin-bottom:8px;color:#374151">Selecione as posições de banner (uma ou mais):</p>
      <div class="lista-banners-pdf">${bannersHtml}</div>
    </div>
    <div style="margin-top:14px;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
      <p style="font-size:12px;font-weight:600;margin-bottom:8px;color:#374151">Contato no PDF:</p>
      <label class="banner-pdf-check">
        <input type="checkbox" name="pdf-contato" value="agencia" checked> Agência de Propaganda
      </label>
      <label class="banner-pdf-check">
        <input type="checkbox" name="pdf-contato" value="principal"> Principal
      </label>
    </div>
    <div style="margin-top:14px;padding:12px;background:#fff8f0;border-radius:8px;border:1px solid #fed7aa">
      <label class="banner-pdf-check">
        <input type="checkbox" name="pdf-sobre" value="1"> Incluir <strong>Sobre a Tribuna</strong> antes dos produtos
      </label>
    </div>`;

  const rodape = `
    <button class="btn btn-outline" onclick="fecharModal('pdf-produto')">Cancelar</button>
    <button class="btn btn-primario" onclick="_confirmarGerarPDF('${id}')">Gerar PDF</button>`;

  criarModal('pdf-produto', 'Selecionar Produto', conteudo, rodape);

  document.querySelector('input[name="produto-pdf"][value="7"]')
    .addEventListener('change', function() {
      document.getElementById('banner-sub-pdf').style.display = this.checked ? 'block' : 'none';
    });
}

let _pdfEditorState = null;

function _confirmarGerarPDF(id) {
  const selecionados = [...document.querySelectorAll('input[name="produto-pdf"]:checked')]
    .map(c => c.value);
  if (!selecionados.length) { mostrarToast('Selecione pelo menos um produto.', 'aviso'); return; }

  let subOpcoes = [];
  if (selecionados.includes('7')) {
    subOpcoes = [...document.querySelectorAll('input[name="banner-pdf-sub"]:checked')]
      .map(c => c.value);
    if (!subOpcoes.length) { mostrarToast('Selecione pelo menos uma posição de banner.', 'aviso'); return; }
  }

  const contatosSel   = [...document.querySelectorAll('input[name="pdf-contato"]:checked')]
    .map(c => c.value);
  const incluirSobre  = !!document.querySelector('input[name="pdf-sobre"]:checked');

  fecharModal('pdf-produto');
  _abrirEditorPDF(id, selecionados, subOpcoes, contatosSel, incluirSobre);
}

function _construirItens(produto, subOpcoes) {
  const itens = [];
  produto.forEach(k => {
    if (k === '7') {
      (subOpcoes || []).forEach(sk => {
        const b = _BANNERS[sk];
        if (b) itens.push({ nome: b.nome, blocos: JSON.parse(JSON.stringify(b.blocos)) });
      });
    } else {
      const p = _PRODUTOS[k];
      if (p) itens.push({ nome: p.nome, blocos: JSON.parse(JSON.stringify(p.blocos)) });
    }
  });
  return itens;
}

function _abrirEditorPDF(id, produtos, subOpcoes, contatosSel, incluirSobre) {
  const itens = _construirItens(produtos, subOpcoes);
  if (incluirSobre) {
    itens.unshift({
      nome: _SOBRE_TRIBUNA.nome,
      isSobre: true,
      blocos: JSON.parse(JSON.stringify(_SOBRE_TRIBUNA.blocos))
    });
  }
  _pdfEditorState = { id, contatosSel, itens };

  let editorHtml = '<p style="margin-bottom:16px;font-size:13px;color:#64748b">Edite o conteúdo antes de gerar. As alterações valem apenas para este PDF.</p>';

  itens.forEach((item, i) => {
    editorHtml += `
      <div style="margin-bottom:20px;padding:12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
        <h4 style="font-weight:700;margin-bottom:12px;color:#1e40af;font-size:13px">${escapeHtml(item.nome)}</h4>
        <div class="form-grid">`;

    item.blocos.forEach((bloco, j) => {
      if ('titulo' in bloco) {
        editorHtml += `<div class="campo">
          <label style="font-size:11px">Título do bloco</label>
          <input type="text" id="pdf-ed-${i}-${j}-titulo" value="${escapeHtml(bloco.titulo || '')}">
        </div>`;
      }
      if ('texto' in bloco) {
        editorHtml += `<div class="campo campo-full">
          <label style="font-size:11px">Texto</label>
          <textarea id="pdf-ed-${i}-${j}-texto" rows="3" style="font-size:12px">${escapeHtml(bloco.texto || '')}</textarea>
        </div>`;
      }
      if (bloco.lista) {
        editorHtml += `<div class="campo campo-full">
          <label style="font-size:11px">Lista (um item por linha)</label>
          <textarea id="pdf-ed-${i}-${j}-lista" rows="${Math.min(bloco.lista.length + 1, 6)}" style="font-size:12px">${escapeHtml(bloco.lista.join('\n'))}</textarea>
        </div>`;
      }
    });

    editorHtml += '</div></div>';
  });

  const conteudo = `
    <div style="max-height:65vh;overflow-y:auto;padding-right:8px">
      <form id="form-pdf-editor">${editorHtml}</form>
    </div>`;

  const rodape = `
    <button class="btn btn-secundario" onclick="fecharModal('pdf-editor')">Cancelar</button>
    <button class="btn btn-primario" onclick="_confirmarPDFEditado()">Gerar PDF</button>`;

  criarModal('pdf-editor', 'Revisar conteúdo do PDF', conteudo, rodape, false);
}

function _confirmarPDFEditado() {
  const { id, contatosSel, itens } = _pdfEditorState;

  itens.forEach((item, i) => {
    item.blocos.forEach((bloco, j) => {
      const tituloEl = document.getElementById(`pdf-ed-${i}-${j}-titulo`);
      const textoEl  = document.getElementById(`pdf-ed-${i}-${j}-texto`);
      const listaEl  = document.getElementById(`pdf-ed-${i}-${j}-lista`);
      if (tituloEl !== null) bloco.titulo = tituloEl.value;
      if (textoEl  !== null) bloco.texto  = textoEl.value;
      if (listaEl  !== null) bloco.lista  = listaEl.value.split('\n').filter(s => s.trim());
    });
  });

  fecharModal('pdf-editor');
  gerarPDFAutorizacao(id, null, null, contatosSel, itens);
}

// ── Geração do PDF ───────────────────────────────────────────
function gerarPDFAutorizacao(id, produto, subOpcoes, contatosSel, itensEditados) {
  if (!itensEditados) {
    produto   = Array.isArray(produto) ? produto : [produto || '1'];
    subOpcoes = subOpcoes || [];
  }
  contatosSel = contatosSel || ['agencia', 'principal'];

  const a = _autorizacoesCache.find(x => x.id === id)
         || (_propostasCache || []).find(x => x.id === id);
  if (!a) { mostrarToast('Registro não encontrado.', 'erro'); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W  = 210;
  const mg = 18;
  const mr = W - mg;
  const cw = mr - mg + 5;
  let   y  = 14;

  const LARANJA = [229, 90,  0];
  const PRETO   = [30,  30,  30];
  const CINZA   = [90,  90,  90];
  const CINZA_L = [190, 190, 190];
  const BRANCO  = [255, 255, 255];

  // ── helpers ──
  const tx = (txt, x, yy, opts = {}) => {
    doc.setFontSize(opts.size || 9);
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setTextColor(...(opts.color || PRETO));
    doc.text(String(txt ?? ''), x, yy, { align: opts.align || 'left' });
  };

  const hr = (yy, cor = [0,0,0], lw = 0.3) => {
    doc.setDrawColor(...cor);
    doc.setLineWidth(lw);
    doc.line(mg - 5, yy, mr + 5, yy);
  };

  const fmt = {
    moeda: v => (v != null && !isNaN(v)) ? Number(v).toLocaleString('pt-BR', { style:'currency', currency:'BRL' }) : '—',
    data:  ts => { if (!ts) return null; const d = ts.toDate ? ts.toDate() : new Date(ts); return isNaN(d) ? null : d.toLocaleDateString('pt-BR'); },
    str:   v  => (v && String(v).trim()) ? String(v).trim() : null,
  };

  // ── logo ──
  let _logoB64 = null, _lW = 42, _lH = 22;
  const logoImg = document.getElementById('logo-pdf');
  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    try {
      const cv = document.createElement('canvas');
      cv.width = logoImg.naturalWidth; cv.height = logoImg.naturalHeight;
      cv.getContext('2d').drawImage(logoImg, 0, 0);
      _logoB64 = cv.toDataURL('image/png');
      _lH = Math.round(_lW * logoImg.naturalHeight / logoImg.naturalWidth);
    } catch(e) {}
  }

  // ── cabeçalho de página ──
  function cabecalho(yy) {
    if (_logoB64) {
      doc.addImage(_logoB64, 'PNG', mg - 5, yy, _lW, _lH);
    } else {
      tx('TRIBUNA',    mg - 5, yy + 8,  { bold: true, size: 22, color: LARANJA });
      tx('DE JUNDIAÍ', mg - 5, yy + 18, { bold: true, size: 14, color: LARANJA });
    }
    tx('Tribuna de Jundiaí',                  mr, yy + 4,  { bold: true, size: 9,   color: PRETO, align: 'right' });
    tx('Evodia Comunicação Ltda',              mr, yy + 9,  { size: 7.5, color: CINZA, align: 'right' });
    tx('CNPJ:12.551.543/0001-86 / IE:Isenta', mr, yy + 13, { size: 7,   color: CINZA, align: 'right' });
    return yy + _lH + 4;
  }

  // ── quebra de página ──
  function checkPg(yy, needed) {
    needed = needed || 15;
    if (yy + needed > 275) {
      doc.addPage();
      yy = 14;
      yy = cabecalho(yy);
      yy += 4;
    }
    return yy;
  }

  // ── renderizar texto com trechos em negrito (**texto**) ──
  function renderTextoMisto(texto, yy, xInicio, largura) {
    xInicio = xInicio || mg - 5;
    largura = largura || cw;

    // Quebra o texto em segmentos bold/normal
    const segs = [];
    const re = /\*\*(.*?)\*\*/g;
    let idx = 0, m;
    while ((m = re.exec(texto)) !== null) {
      if (m.index > idx) segs.push({ t: texto.slice(idx, m.index), b: false });
      segs.push({ t: m[1], b: true });
      idx = m.index + m[0].length;
    }
    if (idx < texto.length) segs.push({ t: texto.slice(idx), b: false });

    // Converte em tokens (palavras + espaços) com flag bold
    const tokens = [];
    segs.forEach(function(s) {
      s.t.split(/(\s+)/).forEach(function(tok) {
        if (tok) tokens.push({ t: tok, b: s.b });
      });
    });

    // Monta linhas respeitando largura
    const linhas = [];
    let linha = [], lineW = 0;
    tokens.forEach(function(tok) {
      doc.setFont('helvetica', tok.b ? 'bold' : 'normal');
      doc.setFontSize(9);
      const w = doc.getTextWidth(tok.t);
      const eEspaco = /^\s+$/.test(tok.t);
      if (!eEspaco && lineW + w > largura + 0.5 && linha.length > 0) {
        linhas.push(linha);
        linha = [{ t: tok.t, b: tok.b, w }];
        lineW = w;
      } else {
        if (eEspaco && linha.length === 0) return;
        linha.push({ t: tok.t, b: tok.b, w });
        lineW += w;
      }
    });
    if (linha.length) linhas.push(linha);

    yy = checkPg(yy, linhas.length * 4.5 + 3);
    linhas.forEach(function(ln) {
      let cx = xInicio;
      ln.forEach(function(tok) {
        doc.setFont('helvetica', tok.b ? 'bold' : 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...PRETO);
        doc.text(tok.t, cx, yy);
        cx += tok.w;
      });
      yy += 4.5;
    });
    return yy + 1.5;
  }

  // ── renderizar blocos de conteúdo ──
  function renderBlocos(blocos, yy) {
    blocos.forEach(function(b) {
      if (b.espaco) {
        yy += b.espaco;
        return;
      }
      if (b.titulo) {
        yy = checkPg(yy, 10);
        tx(b.titulo + ':', mg - 5, yy, { bold: true, size: 9, color: PRETO });
        yy += 5;
      }
      if (b.texto !== undefined) {
        if (b.texto.includes('**')) {
          yy = renderTextoMisto(b.texto, yy);
          yy += 2.5;
        } else {
          const linhas = doc.splitTextToSize(b.texto, cw);
          yy = checkPg(yy, linhas.length * 4.5 + 3);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...PRETO);
          doc.text(linhas, mg - 5, yy);
          yy += linhas.length * 4.5 + 4;
        }
      }
      if (b.lista) {
        b.lista.forEach(function(item) {
          const linhas = doc.splitTextToSize('- ' + item, cw - 4);
          yy = checkPg(yy, linhas.length * 4.5 + 2);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...PRETO);
          doc.text(linhas, mg - 2, yy);
          yy += linhas.length * 4.5 + 1.5;
        });
        yy += 2;
      }
    });
    return yy;
  }

  // ══ Página 1 ══════════════════════════════════════════════

  // cabeçalho
  y = cabecalho(y);

  // nº proposta + data
  const prLabel = a.numeroPR
    ? 'Proposta nº ' + a.numeroPR.replace(/^PR\s*/i, '')
    : 'Sem número';
  const dataDoc = fmt.data(a.dataReferencia) || fmt.data(a.data) || fmt.data(a.criadoEm) || fmt.data(a.dataCriacao) || '—';
  tx(prLabel, mg - 5, y, { bold: true, size: 11, color: PRETO });
  tx(dataDoc,  mr,     y, { size: 10, color: PRETO, align: 'right' });
  y += 4;
  hr(y);
  y += 7;

  // busca dados completos do cliente
  const colL = mg - 5;
  const colV = mg + 18;
  const cli = (typeof _clientesCache !== 'undefined' && _clientesCache.find(c => c.id === a.clienteId)) || {};

  // ── bloco cliente ──
  tx('Cliente', colL, y, { bold: true, size: 10.5 });
  tx(a.clienteNome || '—', colV, y, { bold: true, size: 10.5 });
  y += 5;
  if (fmt.str(cli.razaoSocial)) { tx(cli.razaoSocial, colV, y, { size: 8.5 }); y += 4.5; }
  if (fmt.str(cli.cnpj))        { tx(cli.cnpj,        colV, y, { size: 8.5 }); y += 4.5; }

  // endereço: logradouro + complemento, cidade/estado/cep
  const endParte1 = [cli.endereco, cli.complemento].filter(Boolean).join(', ');
  const endParte2 = [cli.cidade, cli.estado].filter(Boolean).join(' / ') + (cli.cep ? ' - CEP ' + cli.cep : '');
  if (fmt.str(endParte1)) {
    const ls = doc.splitTextToSize(endParte1, mr - colV);
    doc.setFontSize(8.5); doc.setFont('helvetica','normal'); doc.setTextColor(...PRETO);
    doc.text(ls, colV, y);
    y += ls.length * 4.5;
  }
  if (fmt.str(endParte2.trim().replace(/^\/\s*/, ''))) {
    tx(endParte2.trim().replace(/^\/\s*/, ''), colV, y, { size: 8.5 }); y += 4.5;
  }
  y += 4;

  // ── bloco contato ──
  const usaAgencia  = contatosSel.includes('agencia');
  const usaPrincipal = contatosSel.includes('principal');

  const cNome    = (usaAgencia  && fmt.str(cli.agenciaContato)) || (usaPrincipal && fmt.str(cli.propNome))    || null;
  const cEmpresa = (usaAgencia  && fmt.str(cli.agenciaNome))    || null;
  const cTel     = (usaAgencia  && fmt.str(cli.agenciaCelular)) || (usaPrincipal && fmt.str(cli.propCelular)) || null;
  const cEmail   = (usaAgencia  && fmt.str(cli.agenciaEmail))   || (usaPrincipal && fmt.str(cli.propEmail))   || null;

  if (cNome || cEmpresa) {
    tx('Contato', colL, y, { bold: true, size: 10.5 });
    const ctLabel = cEmpresa ? (cNome ? cNome + ' / ' + cEmpresa : cEmpresa) : cNome;
    tx(ctLabel, colV, y, { size: 10.5 });
    y += 5;
    if (cTel)   { tx(cTel,   colV, y, { size: 8.5, color: CINZA }); y += 4.5; }
    if (cEmail) { tx(cEmail, colV, y, { size: 8.5, color: CINZA }); y += 4.5; }
    y += 3;
  }

  hr(y);
  y += 9;

  // ref
  const piRef = a.piPoAf ? ' - ' + a.piPoAf : '';
  const refLabel = 'Ref. Proposta de Divulgação' + piRef + ' -';
  tx(refLabel, colL, y, { size: 12, color: LARANJA });
  if (fmt.str(a.descricao)) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const larguraRef = doc.getTextWidth(refLabel + '  ');
    tx(a.descricao, colL + larguraRef, y, { bold: true, size: 12 });
  }
  y += 8;

  // ── seção de itens ──
  const itensParaPDF = itensEditados || _construirItens(produto, subOpcoes);
  let itemIdx = 1;
  itensParaPDF.forEach(function(item, pi) {
    if (item.isSobre) {
      // Seção "Sobre a Tribuna" — sem numeração, com separador após
      y = checkPg(y, 20);
      doc.setFillColor(...LARANJA);
      doc.rect(colL, y, 2, 8, 'F');
      tx(item.nome, colL + 4, y + 6, { bold: true, size: 10.5, color: LARANJA });
      y += 14;
      y = renderBlocos(item.blocos, y);
      y = checkPg(y, 10);
      hr(y, CINZA_L, 0.2);
      y += 10;
    } else {
      if (pi > 0 && !itensParaPDF[pi - 1].isSobre) {
        y = checkPg(y, 8); hr(y, CINZA_L, 0.2); y += 8;
      }
      y = checkPg(y, 20);
      doc.setFillColor(...LARANJA);
      doc.rect(colL, y, 2, 8, 'F');
      tx(itemIdx + ' - ' + item.nome, colL + 4, y + 6, { bold: true, size: 10.5 });
      y += 14;
      y = renderBlocos(item.blocos, y);
      itemIdx++;
    }
  });

  // ── investimento ──
  y = checkPg(y, 20);
  y += 4;
  hr(y, CINZA_L, 0.2);
  y += 8;

  const temB = a.valorBruto != null && !isNaN(a.valorBruto);
  const temL = a.valor      != null && !isNaN(a.valor);

  const valorExibir = (a.valorProposta != null && !isNaN(Number(a.valorProposta)))
    ? a.valorProposta
    : (a.valor || a.valorBruto);

  if (temB && temL && Number(a.valorBruto) !== Number(a.valor)) {
    tx('Investimento Bruto Total: ' + fmt.moeda(a.valorBruto), colL, y, { bold: true, size: 10.5 });
    y += 6;
    tx('Investimento Líquido: ' + fmt.moeda(a.valor), colL, y, { bold: true, size: 10.5 });
    y += 6;
  } else {
    tx('Investimento: ' + fmt.moeda(valorExibir), colL, y, { bold: true, size: 10.5 });
    y += 6;
  }
  if (fmt.data(a.dataPagamento)) {
    tx('Data de Pagamento: ' + fmt.data(a.dataPagamento), colL, y, { size: 8.5, color: CINZA });
    y += 5;
  }

  // ── assinatura ──
  y = checkPg(y, 30);
  y += 8;
  tx('Atenciosamente,',                       colL, y,     { size: 9 }); y += 7;
  tx(fmt.str(a.responsavel) || 'Alexandra Simões', colL, y, { size: 9 }); y += 5;
  tx('Head de Negócios',                      colL, y,     { size: 9, color: CINZA }); y += 4.5;
  tx('comercial@tribunadejundiai.com.br',     colL, y,     { size: 9, color: CINZA }); y += 4.5;
  tx('(11) 99807-0672',                       colL, y,     { size: 9, color: CINZA });

  // ── salvar localmente + Google Drive ──
  const nomeCliente = (a.clienteNome || 'cliente')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9\-_]/g, '_');
  const nomeArquivo = (a.numeroPR || a.id).replace(/\s+/g, '-').replace(/\//g, '-') + '_' + nomeCliente + '.pdf';

  const blob = doc.output('blob');

  // download local
  const _url = URL.createObjectURL(blob);
  const _lnk = document.createElement('a');
  _lnk.href = _url; _lnk.download = nomeArquivo; _lnk.click();
  URL.revokeObjectURL(_url);

  // salvar no Drive (pede autorização na primeira vez)
  if (typeof salvarNoDrive === 'function') salvarNoDrive(blob, nomeArquivo);

  mostrarToast('PDF gerado com sucesso!', 'sucesso');
}
