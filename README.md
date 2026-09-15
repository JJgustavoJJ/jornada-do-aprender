# 🚀 A Jornada do Aprender

> Um jogo educativo infantil que transforma o aprendizado em uma experiência divertida, interativa e adaptável.

## 📚 Sobre o projeto

**A Jornada do Aprender** é um jogo educativo desenvolvido para auxiliar crianças em diferentes níveis de aprendizagem. Por meio de atividades interativas, o projeto estimula o desenvolvimento de habilidades de escrita, leitura, matemática e raciocínio lógico.

A proposta é respeitar o ritmo de cada criança, oferecendo uma experiência educativa envolvente e acompanhando sua evolução.

## 🏗️ Arquitetura e tecnologias

O projeto utiliza uma arquitetura organizada em frontend, backend e banco de dados.

| Tecnologia                | Utilização                                            |
| ------------------------- | ----------------------------------------------------- |
| ⚛️ React + TypeScript     | Criação de interfaces dinâmicas e organizadas.        |
| ⚡ Vite                    | Desenvolvimento e construção da aplicação.            |
| 🌐 HTML, CSS e JavaScript | Estrutura, estilo e interatividade.                   |
| 🔗 tRPC                   | Comunicação entre frontend e backend.                 |
| 🗄️ MySQL                 | Armazenamento dos dados dos alunos e seus progressos. |
| 📦 Drizzle ORM            | Integração entre o código e o banco de dados.         |

Essas tecnologias foram escolhidas para facilitar o desenvolvimento de um sistema interativo, organizado e de fácil manutenção.

## 🎮 Regras de negócio

O jogo possui oito níveis pedagógicos com atividades de desenho, questões de múltipla escolha e respostas digitadas.

* **⭐ Pontuação:** baseada nos acertos, erros e tentativas do jogador.
* **🚩 Progressão:** o jogador avança de fase ao cumprir os critérios de desempenho das atividades.
* **🏅 Recompensas:** o jogo oferece feedback visual, como confetes, e prevê a utilização de estrelas, medalhas e itens desbloqueáveis.
* **📈 Progresso:** os dados de desempenho são armazenados para acompanhar a evolução dos alunos.
* **👨‍🏫 Painel do professor:** permite consultar informações sobre o desempenho e as dificuldades dos alunos.

A proposta é adaptar as atividades às habilidades de cada criança, respeitando seu ritmo de aprendizagem.

## 📁 Estrutura de documentação

A documentação detalhada está organizada na pasta `docs/`, localizada na raiz do projeto.

```text
jornada-do-aprender/
├── client/
├── server/
├── drizzle/
├── README.md
└── docs/
    ├── arquitetura.md
    └── regras_de_negocio.md
```

### 📄 Arquivos de documentação

* [`arquitetura.md`](docs/arquitetura.md) — tecnologias utilizadas e organização do sistema.
* [`regras_de_negocio.md`](docs/regras_de_negocio.md) — pontuação, progressão, recompensas e funcionamento do jogo.

## 🌐 Acessar o sistema

Confira a versão online do **A Jornada do Aprender**:

👉 [Acessar o jogo](https://3000-ihhqw6v4f8dnsidecznu4-576c12bc.us1.manus.computer/)

## ⚙️ Instruções de instalação

### 📋 Requisitos

Antes de iniciar, instale:

* [Node.js](https://nodejs.org/)
* [pnpm](https://pnpm.io/)
* [Git](https://git-scm.com/)
* MySQL

### 🔧 Passo a passo

```bash
npm install --global pnpm
```

#### 1. Clone o repositório

```bash
git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git
```

#### 2. Acesse a pasta do projeto

```bash
cd jornada-do-aprender
```

#### 3. Instale as dependências

```bash
pnpm install
```

#### 4. Configure o banco de dados

Configure a variável de ambiente `DATABASE_URL` com os dados de conexão do seu banco MySQL.

#### 5. Execute as migrações

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

#### 6. Inicie o projeto

```bash
pnpm run dev
```

Se o Windows bloquear o acesso, abra o PowerShell como administrador e execute:
```bash
netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
```
Após a inicialização, acesse no navegador o endereço informado pelo terminal.

## 🎨 Protótipo no Figma

Confira o protótipo visual e a proposta das telas do jogo:

👉 [Acessar o protótipo no Figma](https://www.figma.com/make/GfBlaowJlofjQVycoYaSf3/Jogo-educativo-interativo?p=f&t=axdve6CL1dtQK3oV-0)

## 👥 Integrantes do projeto

* **Asaf H.**
* **Gustavo G.**
* **João A.**



---

<p align="center">
  🎓 Projeto desenvolvido para fins educacionais.
</p>
