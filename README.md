A Jornada do Aprender — Documentação do Projeto
1. Arquitetura

O A Jornada do Aprender é um jogo educativo infantil que utiliza atividades interativas para auxiliar o desenvolvimento da aprendizagem.

As tecnologias utilizadas são:

React e TypeScript: desenvolvimento de interfaces dinâmicas e organizadas.

Vite: ferramenta para desenvolvimento e construção do projeto.

HTML, CSS e JavaScript: estrutura, estilo e interatividade das páginas.

tRPC: comunicação entre frontend e backend.

MySQL: armazenamento dos dados dos alunos e seus progressos.

Drizzle ORM: integração entre o código e o banco de dados.

Essas tecnologias foram escolhidas por facilitarem a criação de um sistema interativo, organizado e de fácil manutenção.

2. Regras de negócio

O jogo possui oito níveis pedagógicos com atividades de desenho, questões de múltipla escolha e respostas digitadas.

Pontuação: baseada nos acertos, erros e tentativas do jogador.

Progressão: o jogador avança de fase ao cumprir os critérios de desempenho das atividades.

Recompensas: o jogo oferece feedback visual, como confetes, e prevê a utilização de estrelas, medalhas e itens desbloqueáveis.

Progresso: o desempenho dos alunos é armazenado para acompanhar sua evolução.

Painel do professor: permite consultar informações sobre o desempenho e as dificuldades dos alunos.

A proposta é adaptar as atividades às habilidades de cada criança, respeitando seu ritmo de aprendizagem.

3. Estrutura de documentação

Na raiz do projeto, deve ser criada a pasta /docs, contendo os arquivos:

docs/
├── arquitetura.md
└── regras_de_negocio.md

Esses arquivos apresentarão a arquitetura, as tecnologias utilizadas e as regras de funcionamento do jogo.

4. Instruções de instalação
Requisitos

Node.js

pnpm

Git

MySQL

Passo a passo

Clone o repositório:

git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git

Acesse a pasta:

cd jornada-do-aprender

Instale as dependências:

pnpm install

Configure a variável DATABASE_URL com os dados do banco MySQL.

Execute as migrações:

pnpm drizzle-kit generate
pnpm drizzle-kit migrate

Inicie o projeto:

pnpm run dev

Após a inicialização, acesse no navegador o endereço informado pelo terminal.
