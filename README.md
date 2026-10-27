# A Jornada do Aprender

Jogo educativo infantil para atividades de leitura, escrita e raciocínio lógico. A aplicação possui uma interface web, uma API em tRPC e um banco MySQL para salvar o progresso dos alunos e exibir os resultados no painel do professor.

## Tecnologias

- React + TypeScript
- Vite
- Express + tRPC
- MySQL + Drizzle ORM
- Tailwind CSS
- Vitest

## Pré-requisitos

No computador que funcionará como servidor, instale:

- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- [pnpm](https://pnpm.io/installation/)

Os computadores dos alunos e do professor não precisam instalar Node.js, pnpm ou MySQL. Eles apenas acessam o endereço do computador servidor pelo navegador.

> Os comandos de instalação e banco usam pnpm porque o projeto fixa essa versão no lockfile. Depois que o projeto estiver instalado e compilado, a execução offline deve ser feita com `npm start`.

## Instalação rápida

### 1. Baixe o projeto

```bash
git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git
cd jornada-do-aprender
```

### 2. Instale o pnpm e as dependências

Se o comando `pnpm` já existir, instale as dependências:

```bash
pnpm install
```

Se `pnpm` não for reconhecido, habilite o gerenciador incluído no Node.js:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
pnpm install
```

No Windows, a alternativa é:

```powershell
npm install --global pnpm
pnpm install
```

### 3. Configure o MySQL

Inicie o serviço do MySQL. No Windows, pressione `Win + R`, execute `services.msc` e inicie o serviço `MySQL80` (ou o nome correspondente à versão instalada).

Abra o cliente do MySQL como `root`:

```bash
mysql -u root -p
```

Crie o banco e o usuário da aplicação. Substitua `SUA_SENHA` por uma senha sua:

```sql
CREATE DATABASE IF NOT EXISTS jornada_aprender
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'jornada_user'@'localhost'
  IDENTIFIED BY 'SUA_SENHA';
CREATE USER IF NOT EXISTS 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'SUA_SENHA';

ALTER USER 'jornada_user'@'localhost' IDENTIFIED BY 'SUA_SENHA';
ALTER USER 'jornada_user'@'127.0.0.1' IDENTIFIED BY 'SUA_SENHA';

GRANT ALL PRIVILEGES ON jornada_aprender.* TO 'jornada_user'@'localhost';
GRANT ALL PRIVILEGES ON jornada_aprender.* TO 'jornada_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

Saia do cliente:

```sql
exit;
```

Teste a conexão com o usuário da aplicação:

```bash
mysql -h 127.0.0.1 -u jornada_user -p jornada_aprender
```

Se aparecer `mysql>`, a conexão está funcionando. Saia novamente com `exit;`.

### 4. Crie o arquivo `.env`

Na raiz do projeto, no mesmo diretório de `package.json`, crie um arquivo chamado exatamente `.env`:

```dotenv
DATABASE_URL=mysql://jornada_user:SUA_SENHA@127.0.0.1:3306/jornada_aprender
PORT=3000
NODE_ENV=development
```

Troque `SUA_SENHA` pela senha usada no MySQL. Se a senha tiver caracteres como `@`, `#`, `:`, `/` ou `%`, faça URL encoding ou prefira uma senha sem esses caracteres para evitar erro na URL.

O arquivo `.env` está no `.gitignore` e não deve ser enviado ao GitHub.

### 5. Crie as tabelas e execute o diagnóstico

```bash
pnpm db:push
pnpm diagnose
```

O comando `db:push` gera e aplica as migrações do Drizzle. O diagnóstico testa a conexão com o MySQL e verifica a porta configurada.

O resultado deve conter:

```text
DATABASE_URL: configurada
MySQL: conexão OK
Porta 3000: disponível em 0.0.0.0
Diagnóstico concluído sem problemas.
```

### 6. Gere o build e inicie a aplicação offline

O build precisa ser gerado uma vez enquanto as dependências já estão instaladas. Depois disso, o servidor pode funcionar sem conexão com a internet:

```bash
npm run build
npm start
```

Quando o servidor iniciar, abra no computador servidor:

```text
http://localhost:3000
```

O terminal também exibirá o endereço que deve ser usado pelos outros computadores da rede.

Para encerrar o servidor, pressione `Ctrl + C` no terminal em que `npm start` está rodando.

> `pnpm dev` é destinado somente ao desenvolvimento e ao hot reload. Não use esse comando no computador que ficará disponível para os alunos.

## Configuração automática no Windows

Depois de instalar o projeto e o MySQL, o script abaixo cria o banco, cria o usuário, grava o `.env`, aplica as tabelas e executa o diagnóstico. Essa etapa é feita uma vez, durante a configuração inicial:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-mysql-windows.ps1
```

O script solicitará a senha do `root` e uma senha para `jornada_user`. Depois da conclusão, gere o build e inicie o jogo em modo offline:

```powershell
npm run build
npm start
```

Para as próximas inicializações offline, também é possível executar:

```powershell
.\scripts\iniciar-servidor-windows.bat
```

Esse arquivo executa o diagnóstico antes de iniciar o servidor.

## Usar em vários computadores na mesma rede

Apenas o computador servidor deve executar `npm start` e acessar o MySQL. Os demais computadores devem abrir o endereço do servidor no navegador.

1. Garanta que todos os computadores estejam na mesma rede Wi-Fi ou Ethernet.
2. No servidor Windows, execute `ipconfig`.
3. Localize o IPv4 do adaptador Wi-Fi ou Ethernet. Normalmente ele começa com `192.168.` ou `10.`.
4. Se o firewall bloquear o acesso, abra o PowerShell como administrador e execute:

   ```powershell
   netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
   ```

5. Nos outros computadores, abra o endereço neste formato:

   ```text
   http://IP-DO-SERVIDOR:3000
   ```

   Por exemplo: `http://192.168.1.25:3000`.

Não use `localhost` nos computadores dos alunos. `localhost` sempre aponta para o próprio computador em que o navegador está aberto.

Veja também o [guia detalhado de configuração de rede e MySQL](docs/configuracao-rede-mysql.md).

## Verificar o salvamento dos resultados

1. Abra o jogo pelo endereço do servidor.
2. Informe o nome de um aluno e responda uma atividade.
3. Abra o **Painel do Professor** no mesmo endereço do servidor.
4. Informe a senha atual do painel: `12345678`.
5. Confira o registro do aluno e os resultados.
6. Use **Exportar CSV ↓** para baixar os resultados.

A senha do painel está definida no código atual. Em um ambiente real, altere essa senha antes de disponibilizar a aplicação.

## Solução de problemas

### `pnpm` não é reconhecido

Instale ou habilite o pnpm e abra um novo terminal:

```bash
corepack enable
corepack prepare pnpm@10.4.1 --activate
```

No Windows, também é possível usar `npm install --global pnpm`.

### `DATABASE_URL is required` ou `DATABASE_URL: AUSENTE`

Verifique se o arquivo se chama `.env`, está na raiz do projeto e contém `DATABASE_URL`. No Windows, confirme que ele não foi salvo como `.env.txt`.

### `Access denied for user`

A senha do `.env` não corresponde à senha de `jornada_user`. Entre no MySQL como `root`, execute novamente os comandos `ALTER USER` deste guia e atualize a URL do `.env`.

### `ECONNREFUSED 127.0.0.1:3306`

O MySQL não está em execução, está usando outra porta ou está bloqueando conexões TCP. Inicie o serviço, confirme a porta configurada e execute `pnpm diagnose` novamente.

### A porta 3000 já está em uso

Encerre o processo que está usando a porta ou altere `PORT` no `.env`. Se alterar a porta, use a nova porta também no firewall e no endereço acessado pelos outros computadores.

### O painel mostra “Tentando conectar ao banco compartilhado”

Confirme que o painel foi aberto pelo endereço do computador servidor, que o servidor está ativo e que `pnpm diagnose` informa `MySQL: conexão OK`. Se o build tiver sido criado antes, a execução com `npm start` não precisa de internet. Os computadores dos alunos não devem iniciar uma segunda cópia do servidor.

## Desenvolvimento, build e testes

Os comandos abaixo são usados durante a preparação ou manutenção do projeto:

```bash
pnpm check
pnpm test
pnpm run build
```

Para executar a versão compilada sem internet:

```bash
npm start
```

Para formatar os arquivos:

```bash
pnpm format
```

## Estrutura principal

```text
jornada-do-aprender/
├── client/       # Interface React
├── server/       # API tRPC e servidor Express
├── drizzle/      # Schema e migrações do MySQL
├── scripts/      # Diagnóstico e automações para Windows
├── docs/         # Guias complementares
├── package.json
└── README.md
```

## Protótipo visual

[Ver o protótipo no Figma](https://www.figma.com/make/GfBlaowJlofjQVycoYaSf3/Jogo-educativo-interativo?p=f&t=axdve6CL1dtQK3oV-0)

## Integrantes

- Asaf H.
- Gustavo G.
- João A.

Projeto desenvolvido para fins educacionais.
