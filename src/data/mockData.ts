/**
 * mockData.ts - Dados mock para desenvolvimento
 * 
 * Este arquivo contém dados fictícios usados durante o desenvolvimento.
 * Em produção, estes dados virão de uma API.
 * 
 * As imagens são carregadas da pasta assets/xd exportadas do Adobe XD.
 */

import { AnimePack } from '../types';

/**
 * Tipo para item de anime no catálogo
 * Usado no SearchScreen para o grid de animes
 */
export interface AnimeItem {
  id: string;
  title: string;
  image: any; // require() retorna 'any' no React Native
  package?: string;
  author?: string;
  description?: string;
  stickers?: any[];
}

/**
 * MOCK_STICKERS - Stickers de exemplo para preview
 * Usado no HomeScreen e StickerCard
 * **DEFINIDO NO INÍCIO para garantir que esteja disponível para ANIME_PACKS**
 */
export const MOCK_STICKERS = [
  require('../assets/xd/ComponentTMP_2-image.png'),
  require('../assets/xd/ComponentTMP_2-image2.png'),
  require('../assets/xd/ComponentTMP_2-image3.png'),
  require('../assets/xd/ComponentTMP_2-image4.png'),
  require('../assets/xd/ComponentTMP_2-image5.png'),
  require('../assets/xd/ComponentTMP_2-image6.png'),
];

/**
 * MOCK_COVERS - Capas de exemplo
 */
export const MOCK_COVERS = {
  animeCover: require('../assets/xd/ComponentTMP_1-image6.jpg'),
  mainIcon: require('../assets/xd/ComponentTMP_0-image.jpg'),
  avatar: require('../assets/xd/ComponentTMP_2-image.png'), // Generic maker avatar
};

/**
 * ANIME_PACKS - Pacotes de stickers mock
 * Usados no HomeScreen e DownloadsScreen
 */
export const ANIME_PACKS: AnimePack[] = [
  {
    id: '1',
    title: 'Kaguya-sama wa Kokurasetai',
    description: 'Shinomiya Kaguya e Miyuki Shirogane são membros do Concelho Estudantil da Academia Shuchi\'in. Ambos são gênios entre os gênios e estão apaixonados um pelo outro, mas seu orgulho não permite que confessem seus sentimentos! O primeiro a se declarar perde nessa guerra psicológica de amor. Acompanhe as batalhas diárias hilarantes e estratégicas enquanto eles tentam forçar o outro a se declarar primeiro, usando esquemas elaborados, jogos mentais e a ajuda (ou atrapalho) da secretária Chika Fujiwara e do tesoureiro Ishigami. Quem sairá vitorioso nesta batalha de intelecto e romance?',
    author: 'Kaguya Fan',
    package: 'Kaguya-sama: Love is War - Ultra Romantic Pack',
    image: require('../assets/xd/ComponentTMP_1-image6.jpg'),
    stickers: [
      ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS
    ].slice(0, 28) // 28 stickers
  },
  {
    id: '2',
    title: 'Kobayashi-san Chi no Maid Dragon',
    description: 'Kobayashi vive sozinha em um apartamento até que um dia ela salva a vida de uma dragoa ferida. A dragoa, chamada Tohru, tem a capacidade de se transformar em uma adorável garota humana (com chifres e cauda!) e decide fazer qualquer coisa para pagar sua dívida de gratidão, quer Kobayashi goste ou não. Com uma dragoa muito persistente e amorosa como colega de quarto, nada é fácil, e a vida normal de Kobayashi está prestes a sair dos trilhos! Outros dragões e seres míticos começam a aparecer, tornando o cotidiano ainda mais caótico e divertido.',
    author: 'Dragon Maid',
    package: 'Dragon Pack', // SMALL
    image: require('../assets/xd/ComponentTMP_1-image7.jpg'),
    stickers: [
      ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS
    ].slice(0, 22), // 22 stickers
    isAnimated: true
  },
  {
    id: '3',
    title: 'Classroom of the Elite',
    description: 'Ayanokouji Kiyotaka acaba de se matricular no Colégio Tokyo Koudo Ikusei, onde dizem que 100% dos alunos entram na faculdade ou arranjam emprego. Mas ele termina na Classe 1-D, que está cheia de todas as crianças problemáticas da escola. Além disso, todo mês, a escola concede pontos aos alunos com valor em dinheiro, e as classes empregam uma política de laissez-faire na qual falar, dormir e até sabotar são permitidos durante a aula. Ayanokouji, juntamente com Horikita Suzune e Kushida Kikyou, começa a descobrir a verdade obscura sobre o sistema da escola e a lutar pela sobrevivência e ascensão de sua classe.',
    author: 'Ayanokouji',
    package: 'Classroom of the Elite: Special Test Edition',
    image: require('../assets/xd/ComponentTMP_1-image9.jpg'),
    stickers: [
      ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS, ...MOCK_STICKERS
    ].slice(0, 30) // 30 stickers
  },
  {
    id: '4',
    title: 'Spy x Family',
    description: 'O habilidoso espião Twilight recebe uma missão difícil: ele deve se infiltrar em uma escola de elite para se aproximar de um alvo político importante. Para isso, ele precisa de uma família de fachada. Ele adota Anya, uma garotinha que secretamente é uma telepata, e se casa com Yor, uma assassina profissional que também busca um disfarce. Nenhum deles sabe o segredo do outro, exceto Anya! Juntos, eles tentam viver como uma família normal enquanto lidam com crises mundiais, provas escolares e tentativas de assassinato, tudo isso mantendo as aparências de uma família perfeita e amorosa.',
    author: 'Forger Family',
    package: 'Spy x Family: Forger Family Daily Life',
    image: require('../assets/xd/ComponentTMP_1-image10.jpg'),
    stickers: [
      require('../assets/xd/ComponentTMP_2-image16.png'),
      require('../assets/xd/ComponentTMP_2-image17.png'),
      require('../assets/xd/ComponentTMP_2-image18.png'),
      require('../assets/xd/ComponentTMP_2-image19.png'),
      require('../assets/xd/ComponentTMP_2-image20.png'),
    ],
    isAnimated: true
  },
  {
    id: '5',
    title: 'Death Note',
    description: 'Light Yagami é um estudante genial que encontra o Death Note, um caderno sobrenatural que pertence ao Shinigami Ryuk. O caderno tem o poder de matar qualquer pessoa cujo nome seja escrito nele. Decidido a livrar o mundo do mal, Light começa a matar criminosos e fica conhecido como "Kira". Seus atos chamam a atenção do maior detetive do mundo, conhecido apenas como L. Começa então um jogo de gato e rato de inteligência suprema, onde cada movimento é calculado e qualquer erro pode significar a morte ou a prisão. Quem é a verdadeira justiça: Kira ou L?',
    author: 'Kira',
    package: 'Death Note: The Kira Investigation - L Edition',
    image: require('../assets/xd/ComponentTMP_1-image11.jpg'),
    stickers: [
      require('../assets/xd/ComponentTMP_2-image21.png'),
      require('../assets/xd/ComponentTMP_2-image22.png'),
      require('../assets/xd/ComponentTMP_2-image23.png'),
      require('../assets/xd/ComponentTMP_2-image24.png'),
      require('../assets/xd/ComponentTMP_2-image25.png'),
    ]
  },
  {
    id: '6',
    title: 'Demon Slayer',
    description: 'Tanjirou Kamado vive uma vida pacífica vendendo carvão, até que sua família é massacrada por demônios. A única sobrevivente, sua irmã Nezuko, transformou-se em um demônio, mas surpreendentemente ainda mostra sinais de emoção humana.',
    author: 'TanjiroMaster',
    package: 'Zenitsu Pack', // SMALL
    image: require('../assets/xd/ComponentTMP_1-image14.jpg'),
    stickers: MOCK_STICKERS.slice(0, 5)
  },
  {
    id: '7',
    title: 'Jujutsu Kaisen',
    description: 'Itadori Yuuji é um estudante do ensino médio que possui excelentes capacidades físicas. No entanto, ele não tem interesse em esportes e prefere passar seu tempo com o Clube de Ocorrências Ocultas de sua escola.',
    author: 'GojoFan',
    package: 'Jujutsu Kaisen: Cursed Technique & Domain Expansion Mega Pack Collection', // LARGE
    image: require('../assets/xd/ComponentTMP_1-image13.jpg'),
    stickers: MOCK_STICKERS.slice(1, 6)
  },
  {
    id: '8',
    title: 'One Piece',
    description: 'Gol D. Roger era conhecido como o "Rei dos Piratas", o ser mais forte e infame que já navegou na Grand Line.',
    author: 'LuffyKing',
    package: 'One Piece: Straw Hat Crew Adventures', // SMALL
    image: require('../assets/xd/ComponentTMP_1-image12.jpg'),
    stickers: MOCK_STICKERS.slice(2, 6)
  },
  {
    id: '9',
    title: 'Naruto Shippuden',
    description: 'Naruto Uzumaki quer ser o melhor ninja da terra. Ele fez progressos, mas com a ameaça da Akatsuki, ele sabe que deve treinar mais forte.',
    author: 'Dattebayo',
    package: 'Naruto vs Sasuke: The Final Battle Legacy Collection', // LARGE
    image: require('../assets/xd/ComponentTMP_1-image15.jpg'),
    stickers: MOCK_STICKERS.slice(0, 4)
  },
  {
    id: '10',
    title: 'Huge Pack Example',
    description: 'Um pacote gigante contendo mais de 30 stickers para demonstrar a capacidade de rolagem e visualização em grade.',
    author: 'Tester',
    package: 'Mega Sticker Pack Ultimate Edition - 30 Items',
    image: require('../assets/xd/ComponentTMP_1-image12.jpg'),
    stickers: Array(30).fill(null).map((_, i) => MOCK_STICKERS[i % MOCK_STICKERS.length])
  },
  {
    id: '11',
    title: 'Bocchi the Rock!',
    description: 'Hitori Gotoh, apelidada de "Bocchi-chan", é uma garota extremamente introvertida e com ansiedade social que sonha em fazer amigos e tocar em uma banda.',
    author: 'GuitarHero',
    package: 'Bocchi Faces Collection - 20 Stickers',
    image: require('../assets/xd/ComponentTMP_4-image8.jpg'), // Usando imagem de Sakura CC temporariamente
    stickers: Array(20).fill(null).map((_, i) => MOCK_STICKERS[i % MOCK_STICKERS.length]),
    isAnimated: true
  },
  {
    id: '12',
    title: 'Chainsaw Man',
    description: 'Denji é um adolescente que vive com Pochita, o Demônio da Motosserra. Por causa das dívidas que herdou de seu pai, ele vive na miséria.',
    author: 'MakimaSimp',
    package: 'Public Safety Devil Hunters - 25 Stickers',
    image: require('../assets/xd/ComponentTMP_4-image9.jpg'), // Usando imagem de Samurai Champloo temporariamente
    stickers: Array(25).fill(null).map((_, i) => MOCK_STICKERS[i % MOCK_STICKERS.length])
  }
];

/**
 * ANIME_CATALOG - Catálogo de animes para busca A-Z
 * Usado no SearchScreen para o grid alfabético
 */
export const ANIME_CATALOG: AnimeItem[] = [
  // Animes que começam com A
  { id: '101', title: 'Absolute Duo', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), description: 'Estudantes com poderes especiais chamados "Blaze" são pareados para lutar. Nesta escola, os parceiros devem compartilhar tudo, até mesmo o quarto! Tor e Julie formam uma dupla improvável, cada um com seus próprios segredos e motivos para lutar. Enquanto enfrentam batalhas emocionantes e desafios escolares, eles descobrem que sua conexão, o "Duo", é a chave para liberar seu verdadeiro potencial. Uma história de ação, comédia e laços inquebráveis.' },
  { id: '102', title: "A Record of a Mortal's Journey", image: require('../assets/xd/ComponentTMP_4-image5.jpg'), description: 'Um menino pobre e comum de uma vila entra em uma pequena seita em Jiang Hu e se torna um Discípulo Não Oficial por acaso. Sem talento ou recursos, ele deve navegar pelo mundo perigoso do cultivo imortal, enfrentando demônios, bestas antigas e cultivadores rivais. Com astúcia e determinação, ele busca superar sua mortalidade e alcançar o reino dos deuses, provando que até mesmo um mortal comum pode desafiar os céus.' },
  { id: '103', title: 'AIKa ZERO', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), description: 'Prequel de AIKa R-16, mostrando as origens de Aika como uma agente de recuperação. Acompanhe suas primeiras missões, onde ela aprende a dominar suas habilidades e enfrenta organizações criminosas em busca de artefatos perdidos. Com ação subaquática, combates aéreos e muito fanservice clássico dos anos 2000, esta série explora o passado da icônica heroína antes de se tornar a lenda que conhecemos.' },
  { id: '104', title: 'Attack on Titan', image: require('../assets/xd/ComponentTMP_1-image12.jpg'), description: 'A humanidade vive cercada por enormes muralhas para se proteger de criaturas gigantescas, os Titãs, que devoram humanos sem motivo aparente. Eren Yeager, um jovem determinado, jura eliminar todos os Titãs após ter sua cidade destruída e sua mãe morta por um deles. Ele se junta à Tropa de Exploração, a elite militar que combate os Titãs fora das muralhas, e descobre segredos aterrorizantes sobre a origem das criaturas e a própria história da humanidade.' },
  
  // Animes que começam com B
  { id: '105', title: 'B Gata H Kei', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), description: 'Yamada é uma garota do ensino médio bonita e popular, mas com um segredo: seu sonho é ter relações com 100 parceiros diferentes! No entanto, ela decide começar com o garoto mais comum e desinteressante da classe, Kosuda, pensando que será fácil. Mas suas tentativas de sedução sempre acabam em situações hilárias e constrangedoras, e ela começa a desenvolver sentimentos reais por ele, complicando seu plano original.' },
  { id: '106', title: 'Bakuman', image: require('../assets/xd/ComponentTMP_4-image8.jpg'), description: 'Moritaka Mashiro, um talentoso desenhista, e Akito Takagi, um escritor genial, decidem se unir para criar mangás de sucesso. Eles sonham em ter um anime de suas obras para que Mashiro possa se casar com sua paixão, Azuki Miho, uma aspirante a dubladora. Juntos, eles enfrentam os prazos brutais da Shonen Jump, rivais competitivos e o desgaste da indústria, aprendendo o verdadeiro significado de dedicação e arte.' },
  { id: '107', title: 'Bakumatsu', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), description: 'Uma história alternativa do período Bakumatsu no Japão, onde o fluxo do tempo é manipulado por um artefato misterioso chamado Cronômetro Infinito. Guerreiros lendários como Sakamoto Ryoma e Takasugi Shinsaku lutam não apenas pelo futuro do Japão, mas contra forças que tentam reescrever a história. Batalhas de espadas, intriga política e elementos de ficção científica se misturam nesta aventura histórica.' },
  { id: '108', title: 'Bleach', image: require('../assets/xd/ComponentTMP_1-image13.jpg'), description: 'Ichigo Kurosaki, um estudante que pode ver fantasmas, acidentalmente absorve os poderes de uma Ceifadora de Almas (Shinigami) chamada Rukia Kuchiki. Agora, ele deve assumir as funções dela, protegendo os humanos de espíritos malignos chamados Hollows e guiando as almas dos mortos para o além. Com sua enorme espada Zanpakuto, Ichigo enfrenta inimigos poderosos e descobre conspirações dentro da própria Sociedade das Almas.' },
  
  // Animes que começam com C
  { id: '201', title: 'C Control', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), description: 'O governo japonês foi resgatado da beira do colapso financeiro pelo Fundo Soberano de Riqueza. Para seus cidadãos, no entanto, a vida não melhorou e o desemprego, o crime e o suicídio aumentaram. Yoga Kimimaro, criado por sua avó materna após o desaparecimento de seu pai e a morte de sua mãe, recebe uma oferta estranha para "vender seu futuro" em troca de dinheiro no Distrito Financeiro, uma dimensão alternativa onde as pessoas batalham com seus ativos.' },
  { id: '203', title: 'Cannon Busters', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), description: 'Acompanhe as aventuras de S.A.M., uma robô de amizade de alta tecnologia, que se une a um robô de manutenção peculiar e a um fora-da-lei mortal. Juntos, eles embarcam em uma jornada inesquecível através de um mundo fantástico e perigoso em busca do melhor amigo de S.A.M., o herdeiro de um reino poderoso sitiado. Uma mistura vibrante de faroeste, fantasia e ficção científica.' },
  { id: '204', title: 'Classroom of the Elite', image: require('../assets/xd/ComponentTMP_1-image9.jpg'), description: 'Ayanokouji Kiyotaka acaba de se matricular no Colégio Tokyo Koudo Ikusei, onde dizem que 100% dos alunos entram na faculdade ou arranjam emprego. Mas ele termina na Classe 1-D, que está cheia de todas as crianças problemáticas da escola. Além disso, todo mês, a escola concede pontos aos alunos com valor em dinheiro, e as classes empregam uma política de laissez-faire na qual falar, dormir e até sabotar são permitidos durante a aula.' },
  
  // Animes que começam com D
  { id: '301', title: 'D.Gray-man', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), description: 'Em um final de século XIX alternativo, Allen Walker se junta à Ordem Negra dos Exorcistas. Eles lutam contra o Conde do Milênio, que planeja destruir o mundo usando Akuma - armas biomecânicas criadas a partir das almas dos mortos. Allen possui um olho amaldiçoado que vê o sofrimento das almas presas nos Akuma e um braço anti-Akuma (Innocence). Juntos com outros exorcistas, eles viajam o mundo para impedir o fim dos tempos.' },
  { id: '302', title: 'Death Note', image: require('../assets/xd/ComponentTMP_1-image11.jpg'), description: 'Light Yagami é um estudante genial que encontra o Death Note, um caderno sobrenatural que pertence ao Shinigami Ryuk. O caderno tem o poder de matar qualquer pessoa cujo nome seja escrito nele. Decidido a livrar o mundo do mal, Light começa a matar criminosos e fica conhecido como "Kira". Seus atos chamam a atenção do maior detetive do mundo, conhecido apenas como L. Começa então um jogo de gato e rato de inteligência suprema.' },
  { id: '303', title: 'Demon Slayer', image: require('../assets/xd/ComponentTMP_1-image14.jpg'), description: 'Tanjirou Kamado vive uma vida pacífica vendendo carvão, até que sua família é massacrada por demônios. A única sobrevivente, sua irmã Nezuko, transformou-se em um demônio, mas surpreendentemente ainda mostra sinais de emoção humana. Tanjirou se torna um Caçador de Demônios para encontrar uma cura para Nezuko e vingar sua família, enfrentando os Doze Kizuki e o criador de todos os demônios, Muzan Kibutsuji.' },
  
  // Animes que começam com K
  { id: '401', title: 'K-On!', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), description: 'Yui Hirasawa entra no clube de música leve sem saber tocar nenhum instrumento. No entanto, ela acaba se tornando a guitarrista de uma banda formada por garotas adoráveis e talentosas. O anime acompanha o dia a dia relaxante e divertido do clube, entre ensaios (raros), muito chá e bolos, apresentações escolares e a amizade que cresce entre elas ao longo do ensino médio.' },
  { id: '402', title: 'Kaguya-sama wa Kokurasetai', image: require('../assets/xd/ComponentTMP_1-image6.jpg'), description: 'Shinomiya Kaguya e Miyuki Shirogane são membros do Concelho Estudantil da Academia Shuchi\'in. Ambos são gênios entre os gênios e estão apaixonados um pelo outro, mas seu orgulho não permite que confessem seus sentimentos! O primeiro a se declarar perde nessa guerra psicológica de amor. Acompanhe as batalhas diárias hilarantes e estratégicas enquanto eles tentam forçar o outro a se declarar primeiro.' },
  { id: '403', title: 'Kobayashi-san Chi no Maid Dragon', image: require('../assets/xd/ComponentTMP_1-image7.jpg'), description: 'Kobayashi vive sozinha em um apartamento até que um dia ela salva a vida de uma dragoa ferida. A dragoa, chamada Tohru, tem a capacidade de se transformar em uma adorável garota humana (com chifres e cauda!) e decide fazer qualquer coisa para pagar sua dívida de gratidão, quer Kobayashi goste ou não. Com uma dragoa muito persistente e amorosa como colega de quarto, nada é fácil.' },
  
  // Animes que começam com N
  { id: '501', title: 'Naruto', image: require('../assets/xd/ComponentTMP_1-image15.jpg'), description: 'Naruto Uzumaki é um jovem ninja rejeitado por sua vila por carregar a Raposa de Nove Caudas selada dentro de si. Seu sonho é se tornar Hokage, o líder da vila, para ser reconhecido e respeitado por todos. Com determinação inabalável, ele forma laços com Sasuke e Sakura no Time 7, enfrenta vilões poderosos como a Akatsuki e descobre o verdadeiro significado da amizade e do sacrifício.' },
  
  // Animes que começam com S
  { id: '601', title: 'Sailor Moon', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), description: 'Usagi Tsukino é uma estudante normal e chorona até encontrar Luna, uma gata falante que lhe dá um broche mágico. Ela se transforma em Sailor Moon, uma guerreira destinada a salvar a Terra das forças do mal. Ao longo de sua jornada, ela encontra outras Sailor Senshi, descobre seu passado como a Princesa da Lua e luta pelo amor e pela justiça contra o Reino das Trevas.' },
  { id: '602', title: 'Saint Seiya', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), description: 'Os Cavaleiros do Zodíaco são cinco jovens guerreiros que juraram proteger a reencarnação da deusa grega Athena. Usando armaduras sagradas baseadas nas constelações, eles lutam contra deuses malignos que ameaçam a Terra. Para salvar Athena, eles devem atravessar as Doze Casas do Santuário, enfrentando os poderosos Cavaleiros de Ouro em batalhas épicas onde queimam seu cosmo até o limite.' },
  { id: '603', title: 'Sakura Card Captor', image: require('../assets/xd/ComponentTMP_4-image8.jpg'), description: 'Sakura Kinomoto, uma garota de 10 anos, acidentalmente libera as Cartas Clow de um livro mágico. Agora ela deve se tornar uma Card Captor e recuperar todas as cartas antes que elas causem desastres no mundo. Com a ajuda de seu amigo Tomoyo e do guardião Kero, Sakura equilibra sua vida escolar, seus sentimentos românticos e suas responsabilidades mágicas.' },
  { id: '604', title: 'Samurai Champloo', image: require('../assets/xd/ComponentTMP_4-image9.jpg'), description: 'Fuu, uma garçonete que trabalha em uma casa de chá, resgata dois mestres espadachins, Mugen e Jin, de serem executados. Ela os convence a ajudá-la a encontrar o "samurai que cheira a girassóis". Mugen é um vagabundo selvagem com um estilo de luta imprevisível, enquanto Jin é um ronin estoico e tradicional. Juntos, o trio improvável embarca em uma jornada pelo Japão feudal cheia de ação e hip-hop.' },
  { id: '605', title: 'School Rumble', image: require('../assets/xd/ComponentTMP_2-image.png'), description: 'Tenma Tsukamoto é uma estudante comum que está apaixonada pelo excêntrico Ooji Karasuma. Kenji Harima é um delinquente que está apaixonado por Tenma. O que resulta é uma comédia romântica cheia de mal-entendidos hilários, tentativas de confissão fracassadas e situações absurdas envolvendo todos os alunos da classe 2-C. Ninguém consegue dizer o que sente, mas todos tentam desesperadamente.' },
  { id: '606', title: 'Seven Deadly Sins', image: require('../assets/xd/ComponentTMP_2-image2.png'), description: 'Os Sete Pecados Capitais são um grupo lendário de cavaleiros que foram acusados de tentar derrubar o Reino de Liones. Anos depois, a princesa Elizabeth sai em busca deles para salvar o reino dos Cavaleiros Sagrados corruptos. Ela encontra Meliodas, o Pecado da Ira, e juntos eles reúnem os outros membros para enfrentar demônios antigos e revelar a verdade sobre a traição.' },
  { id: '607', title: 'Shaman King', image: require('../assets/xd/ComponentTMP_4-image4.jpg'), description: 'Yoh Asakura é um xamã, um médium entre os mundos dos vivos e dos mortos. Ele participa do Shaman Fight, um torneio realizado a cada 500 anos, onde xamãs de todo o mundo competem para se tornar o Shaman King e ganhar o poder de remodelar o mundo. Com seu espírito guardião Amidamaru, Yoh enfrenta adversários poderosos e tenta impedir que seu irmão gêmeo maligno, Hao, vença o torneio.' },
  { id: '608', title: 'Spy x Family', image: require('../assets/xd/ComponentTMP_1-image10.jpg'), description: 'O habilidoso espião Twilight recebe uma missão difícil: ele deve se infiltrar em uma escola de elite para se aproximar de um alvo político importante. Para isso, ele precisa de uma família de fachada. Ele adota Anya, uma garotinha que secretamente é uma telepata, e se casa com Yor, uma assassina profissional que também busca um disfarce.' },
  { id: '609', title: 'Steins;Gate', image: require('../assets/xd/ComponentTMP_4-image6.jpg'), description: 'O autoproclamado cientista louco Rintaro Okabe e seus amigos acidentalmente descobrem uma maneira de enviar mensagens para o passado usando um micro-ondas modificado. Suas experiências com a viagem no tempo começam a alterar o presente, atraindo a atenção de uma organização secreta chamada SERN. Okabe deve lutar através de linhas do tempo divergentes para salvar seus amigos de um destino trágico.' },
  { id: '610', title: 'Sword Art Online', image: require('../assets/xd/ComponentTMP_4-image7.jpg'), description: 'No ano de 2022, milhares de jogadores entram no VRMMORPG Sword Art Online, apenas para descobrir que não podem sair. O criador do jogo os prendeu lá, e a morte no jogo significa morte na vida real. Kirito, um jogador solo habilidoso, deve lutar pelos 100 andares de Aincrad para vencer o jogo e libertar a todos, enfrentando chefes mortais e o trauma psicológico de viver em um mundo virtual letal.' },
];

/**
 * SEASONAL_ANIMES - Animes da temporada para o banner da Home
 */
export const SEASONAL_ANIMES = [
  { id: 's1', title: 'Classroom of the Elite', image: require('../assets/xd/ComponentTMP_1-image9.jpg') },
  { id: 's2', title: 'Spy x Family', image: require('../assets/xd/ComponentTMP_1-image10.jpg') },
  { id: 's3', title: 'Demon Slayer', image: require('../assets/xd/ComponentTMP_1-image14.jpg') },
  { id: 's4', title: 'Jujutsu Kaisen', image: require('../assets/xd/ComponentTMP_1-image13.jpg') },
  { id: 's5', title: 'Naruto Shippuden', image: require('../assets/xd/ComponentTMP_1-image15.jpg') },
];

/**
 * getAnimeByTitle - Busca um anime pelo título
 */
export const getAnimeByTitle = (title: string): AnimeItem | undefined => {
  return ANIME_CATALOG.find(anime => anime.title === title);
};

/**
 * getPacksByAnimeTitle - Busca pacotes de um anime pelo título
 * Em produção, faria uma chamada à API
 */
export const getPacksByAnimeTitle = (title: string): AnimePack[] => {
  return ANIME_PACKS.filter(pack => pack.title === title);
};
