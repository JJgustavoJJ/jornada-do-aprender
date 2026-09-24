# A Jornada do Aprender

> Jogo educativo infantil para praticar letras, palavras, sílabas e escrita por meio de atividades interativas.

## Sobre o projeto

**A Jornada do Aprender** é uma aplicação web educativa com oito níveis de alfabetização. A criança pode praticar o traçado de letras e palavras, responder questões de múltipla escolha e escrever palavras relacionadas às imagens apresentadas.

O jogo registra acertos, erros, tentativas, níveis concluídos, tempo por nível e dificuldades identificadas. O painel do professor apresenta esses dados em uma visão consolidada e permite exportá-los em formato CSV.

### Formas de armazenamento

O sistema funciona em dois modos:

- **Modo compartilhado:** usa MySQL para que os dados sejam acessíveis por todos os computadores que acessam o mesmo servidor.
- **Modo local:** usa `localStorage` no navegador quando o MySQL não está configurado ou está temporariamente indisponível. Nesse modo, o jogo e o painel continuam funcionando, mas os dados permanecem somente naquele dispositivo.

## Funcionalidades

- Oito níveis pedagógicos com dez exercícios cada.
- Atividades de desenho em canvas.
- Questões de múltipla escolha.
- Exercícios de digitação de palavras.
- Imagens locais associadas às palavras dos exercícios.
- Instruções por áudio usando a síntese de voz do navegador.
- Feedback visual para acertos e novas tentativas.
- Registro local e sincronização opcional com MySQL.
- Painel do professor com acertos, erros, tempo por nível e maior dificuldade.
- Exportação dos registros para CSV compatível com planilhas em português.

## Tecnologias

| Tecnologia | Utilização |
| --- | --- |
| React e TypeScript | Interface e lógica do jogo |
| Vite | Servidor de desenvolvimento e build de produção |
| Tailwind CSS | Estilos da aplicação |
| tRPC | Comunicação entre frontend e backend |
| Drizzle ORM | Acesso e migração do banco de dados |
| MySQL | Armazenamento compartilhado do progresso |
| Vitest | Testes automatizados |
| Node.js | Execução do backend |

## Requisitos

Para executar o projeto localmente, instale:

- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/)
- MySQL somente se você quiser compartilhar os dados entre computadores

Instale o pnpm com:

```bash
npm install --global pnpm
```

## Instalação rápida sem MySQL

O MySQL é opcional. Sem ele, o jogo funciona usando o armazenamento local do navegador.

```bash
git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git
cd jornada-do-aprender
pnpm install
pnpm dev
```

Depois, abra no navegador:

```text
http://localhost:3000
```

Esse modo é adequado para testar o jogo em um único computador. Para compartilhar o progresso entre computadores, siga a configuração do MySQL abaixo.

## Configuração do MySQL no Windows

O computador que hospeda o jogo é o único que precisa ter MySQL instalado. Os computadores dos alunos acessam o servidor pelo navegador e não precisam instalar MySQL.

### 1. Instale o MySQL

Baixe o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) e anote a senha definida para o usuário `root` durante a instalação.

Depois clone o projeto e instale as dependências:

```powershell
git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git
cd jornada-do-aprender
pnpm install
```

### 2. Crie o banco automaticamente

O projeto possui um script que cria o banco, o usuário, o arquivo `.env` e as tabelas:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-mysql-windows.ps1
```

O script solicitará a senha do `root` e uma senha para o usuário do jogo. Evite caracteres como `@`, `#`, `:`, `/` e `%` nessa senha, pois eles têm significado especial em URLs de conexão.

### 3. Confira o arquivo `.env`

O arquivo `.env` deve ficar na raiz do projeto, no mesmo nível de `package.json`, e deve conter valores semelhantes a estes:

```env
DATABASE_URL=mysql://jornada_user:SUA_SENHA_AQUI@127.0.0.1:3306/jornada_aprender
PORT=3000
NODE_ENV=development
```

Substitua `SUA_SENHA_AQUI` pela senha do usuário `jornada_user`. Nunca envie o `.env` para o GitHub.

### 4. Crie ou atualize as tabelas

Dentro da pasta do projeto, execute:

```powershell
pnpm db:push
```

Esse comando gera a migração e atualiza o banco conforme o schema atual do projeto.

### 5. Verifique a conexão

Execute:

```powershell
pnpm diagnose
```

O resultado esperado contém:

```text
DATABASE_URL: configurada
MySQL: conexão OK
Porta 3000: disponível em 0.0.0.0
Diagnóstico concluído sem problemas.
```

### 6. Inicie o servidor

```powershell
pnpm dev
```

Mantenha o terminal aberto enquanto o jogo estiver em uso. A aplicação ficará disponível em:

```text
http://localhost:3000
```

Para iniciar uma versão de produção:

```powershell
pnpm build
pnpm start
```

## Configuração manual do MySQL

Se você não quiser usar o script automático, abra o MySQL como `root` e execute:

```sql
CREATE DATABASE IF NOT EXISTS jornada_aprender
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'jornada_user'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

GRANT ALL PRIVILEGES
  ON jornada_aprender.*
  TO 'jornada_user'@'localhost';

FLUSH PRIVILEGES;
```

Depois crie o `.env` e execute:

```powershell
pnpm db:push
pnpm diagnose
pnpm dev
```

## Compartilhar o jogo na rede local

Apenas o computador servidor deve executar `pnpm dev` e conectar ao MySQL. Todos os demais computadores devem acessar o endereço IP desse servidor.

### 1. Libere a porta 3000 no Windows

Abra o PowerShell como Administrador e execute:

```powershell
netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
```

Também é possível usar o script pronto:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\liberar-firewall-windows.ps1
```

### 2. Descubra o endereço IP do servidor

No computador servidor, execute:

```powershell
ipconfig
```

Use o IPv4 do adaptador Wi-Fi ou Ethernet. Ele normalmente começa com `192.168.` ou `10.`.

### 3. Abra o jogo nos outros computadores

Se o servidor tiver o IP `192.168.1.25`, os demais computadores devem abrir:

```text
http://192.168.1.25:3000
```

Não use `localhost:3000` nos computadores dos alunos. `localhost` sempre aponta para o próprio computador onde o navegador está aberto.

Todos os computadores devem estar conectados à mesma rede Wi-Fi ou Ethernet.

O guia detalhado de rede está em [`docs/configuracao-rede-mysql.md`](docs/configuracao-rede-mysql.md).

## Painel do professor

Para abrir o painel:

1. Abra o jogo.
2. Clique em **Painel do Professor**.
3. Informe a senha da aplicação:

```text
12345678
```

Essa senha é diferente da senha do MySQL.

Quando o MySQL estiver funcionando, o painel exibirá **Dados compartilhados pelo MySQL**. Quando o banco não estiver configurado, exibirá **Modo local ativo** e usará os registros salvos naquele navegador.

Use **Exportar CSV** para baixar os dados atuais. O arquivo inclui aluno, acertos, erros, tentativas, níveis concluídos, tempo por nível e erros por nível.

## Comandos de desenvolvimento

```bash
pnpm dev       # inicia o servidor de desenvolvimento
pnpm check     # verifica os tipos TypeScript
pnpm test      # executa os testes automatizados
pnpm build     # gera o build de produção
pnpm start     # inicia o build de produção
pnpm diagnose  # verifica MySQL e disponibilidade da porta
pnpm db:push   # gera e aplica as migrações do banco
```

## Solução de problemas

### `DATABASE_URL: AUSENTE`

O arquivo `.env` não foi encontrado ou está com outro nome. Confirme que ele está na raiz do projeto e que não foi salvo como `.env.txt`.

### `Access denied for user`

A senha do `.env` não corresponde à senha do usuário do MySQL. Como `root`, atualize a senha:

```sql
ALTER USER 'jornada_user'@'localhost'
  IDENTIFIED BY 'SUA_SENHA_AQUI';

FLUSH PRIVILEGES;
```

Depois atualize a mesma senha na variável `DATABASE_URL`.

### `ECONNREFUSED 127.0.0.1:3306`

O serviço do MySQL não está iniciado. No Windows, pressione `Win + R`, execute `services.msc`, procure `MySQL80` ou um serviço semelhante e clique em **Iniciar**.

### Outros computadores não conseguem acessar

Confirme se o servidor está executando `pnpm dev`, se todos estão na mesma rede, se a porta 3000 está liberada no firewall e se o endereço usado é o IPv4 do servidor.

### O painel mostra `Modo local ativo`

O jogo continua funcionando. Essa mensagem significa que o MySQL não está disponível e que os dados estão sendo mantidos somente no navegador atual. Para compartilhar resultados entre computadores, corrija o `.env`, inicie o MySQL e execute `pnpm diagnose` novamente.

## Documentação adicional

- [`docs/configuracao-rede-mysql.md`](docs/configuracao-rede-mysql.md) — configuração detalhada do MySQL e da rede local.

## Links

- [Repositório no GitHub](https://github.com/JJgustavoJJ/jornada-do-aprender)
- [Protótipo no Figma](https://www.figma.com/make/GfBlaowJlofjQVycoYaSf3/Jogo-educativo-interativo?p=f&t=axdve6CL1dtQK3oV-0)

## Integrantes

- Asaf H.
- Gustavo G.
- João A.

## Referências

[1]: https://nodejs.org/ "Node.js"
[2]: https://pnpm.io/ "pnpm"
[3]: https://git-scm.com/ "Git"
[4]: https://dev.mysql.com/downloads/mysql/ "MySQL Community Server"
[5]: https://github.com/JJgustavoJJ/jornada-do-aprender "Repositório A Jornada do Aprender"

Projeto desenvolvido para fins educacionais.
