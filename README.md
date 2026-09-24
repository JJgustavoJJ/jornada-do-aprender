# 🚀 A Jornada do Aprender

> Um jogo educativo infantil que transforma o aprendizado em uma experiência divertida, interativa e adaptável.

## 📚 Sobre o projeto

**A Jornada do Aprender** é um jogo educativo desenvolvido para auxiliar crianças em diferentes níveis de aprendizagem. Por meio de atividades interativas, o projeto estimula o desenvolvimento de habilidades de escrita, leitura e raciocínio lógico.

A proposta é respeitar o ritmo de cada criança, oferecendo uma experiência educativa envolvente e acompanhando sua evolução.

## 🏗️ Arquitetura e tecnologias

O projeto utiliza uma arquitetura organizada em frontend, backend e banco de dados.

| Tecnologia | Utilização |
| --- | --- |
| React + TypeScript | Criação da interface e da lógica do jogo. |
| Vite | Desenvolvimento e construção da aplicação. |
| Tailwind CSS | Estilização da interface. |
| tRPC | Comunicação entre frontend e backend. |
| MySQL | Armazenamento dos dados dos alunos e de seus progressos. |
| Drizzle ORM | Integração entre o código e o banco de dados. |
| Vitest | Execução dos testes automatizados. |

## 🎮 Regras de negócio

O jogo possui oito níveis pedagógicos com atividades de desenho, questões de múltipla escolha e respostas digitadas.

- **Pontuação:** baseada nos acertos, erros e tentativas do jogador.
- **Progressão:** o jogador avança pelos exercícios e níveis da jornada.
- **Feedback:** o jogo apresenta mensagens visuais e sonoras para acertos e novas tentativas.
- **Progresso:** os dados de desempenho podem ser armazenados no MySQL para consulta compartilhada.
- **Painel do professor:** permite consultar informações sobre o desempenho e as dificuldades dos alunos.

## 📁 Estrutura do projeto

```text
jornada-do-aprender/
├── client/
├── server/
├── drizzle/
├── scripts/
├── docs/
├── README.md
├── package.json
└── drizzle.config.ts
```

## ⚙️ Requisitos

Antes de iniciar, instale no computador que executará o servidor:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)
- MySQL

Os computadores dos alunos não precisam ter MySQL instalado. Apenas o computador servidor precisa instalar e executar o MySQL.

## 🔧 Conexão com o MySQL passo a passo

### 1. Verifique se o MySQL está instalado

Pressione:

```text
Win + R
```

Digite:

```text
services.msc
```

Procure um serviço chamado:

```text
MySQL80
```

ou um nome parecido.

Se estiver parado:

1. Clique com o botão direito em `MySQL80`.
2. Clique em **Iniciar**.

### 2. Abra o MySQL como administrador

Abra o PowerShell ou o Prompt de Comando e execute:

```powershell
mysql -u root -p
```

Digite a senha que você criou para o usuário `root` durante a instalação do MySQL.

Se aparecer:

```text
mysql>
```

a conexão com o MySQL funcionou.

Se aparecer que `mysql` não é reconhecido, abra pelo menu Iniciar o programa:

```text
MySQL Command Line Client
```

### 3. Crie o banco do jogo

Dentro do prompt `mysql>`, cole:

```sql
CREATE DATABASE IF NOT EXISTS jornada_aprender
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 4. Crie o usuário do jogo

Ainda dentro do MySQL, execute este bloco completo:

```sql
CREATE USER IF NOT EXISTS 'jornada_user'@'localhost'
  IDENTIFIED BY 'JornadaAprender2026';

CREATE USER IF NOT EXISTS 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'JornadaAprender2026';

ALTER USER 'jornada_user'@'localhost'
  IDENTIFIED BY 'JornadaAprender2026';

ALTER USER 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'JornadaAprender2026';
```

A senha deste exemplo é:

```text
JornadaAprender2026
```

Você pode usar outra senha, mas precisa colocar exatamente a mesma senha no arquivo `.env`.

### 5. Dê permissão ao usuário

Execute:

```sql
GRANT ALL PRIVILEGES
  ON jornada_aprender.*
  TO 'jornada_user'@'localhost';

GRANT ALL PRIVILEGES
  ON jornada_aprender.*
  TO 'jornada_user'@'127.0.0.1';

FLUSH PRIVILEGES;
```

Depois saia do MySQL:

```sql
exit;
```

### 6. Teste o usuário do jogo

Agora teste o usuário criado:

```powershell
mysql -h 127.0.0.1 -u jornada_user -p jornada_aprender
```

Quando pedir a senha, digite:

```text
JornadaAprender2026
```

Se aparecer:

```text
mysql>
```

deu certo.

Teste as tabelas com:

```sql
SHOW TABLES;
```

Se ainda não houver tabelas, isso é normal. Elas serão criadas pelo projeto.

Saia:

```sql
exit;
```

### 7. Abra a pasta do projeto

No PowerShell, entre na pasta:

```powershell
cd C:\Users\Aluno\jornada-do-aprender
```

Confira se você está na pasta correta:

```powershell
dir
```

Você deve encontrar arquivos como:

```text
package.json
drizzle.config.ts
client
server
drizzle
```

### 8. Crie o arquivo `.env`

Na pasta:

```text
C:\Users\Aluno\jornada-do-aprender
```

crie um arquivo chamado exatamente:

```text
.env
```

O conteúdo deve ser:

```env
DATABASE_URL=mysql://jornada_user:JornadaAprender2026@127.0.0.1:3306/jornada_aprender
PORT=3000
NODE_ENV=development
```

Atenção:

- O nome deve ser `.env`, não `.env.txt`.
- A senha deve ser exatamente a mesma criada no MySQL.
- Não coloque espaços antes ou depois do `=`.
- Não coloque aspas na URL.

### 9. Instale as dependências

Dentro da pasta do projeto:

```powershell
pnpm install
```

Se o comando `pnpm` não existir:

```powershell
npm install --global pnpm
```

Depois execute novamente:

```powershell
pnpm install
```

### 10. Crie as tabelas do projeto

Execute:

```powershell
pnpm db:push
```

Se tudo estiver correto, o Drizzle criará as tabelas do jogo.

Depois verifique:

```powershell
pnpm diagnose
```

O resultado esperado é:

```text
DATABASE_URL: configurada
MySQL: conexão OK
Porta 3000: disponível em 0.0.0.0
Diagnóstico concluído sem problemas.
```

### 11. Inicie o jogo

Execute:

```powershell
pnpm dev
```

Você deverá ver:

```text
Server running on http://localhost:3000/
```

Abra no navegador:

```text
http://localhost:3000
```

### 12. Verifique se os dados estão sendo salvos

1. Abra o jogo.
2. Digite o nome de um aluno.
3. Resolva uma atividade.
4. Abra o **Painel do Professor**.
5. Digite a senha do painel:

```text
12345678
```

Se o MySQL estiver conectado, os dados do aluno aparecerão no painel.

## ❗ Solução de problemas

### Se aparecer `Access denied`

Esse erro significa que a senha do `.env` não é igual à senha do usuário MySQL.

Entre novamente como `root`:

```powershell
mysql -u root -p
```

Execute:

```sql
ALTER USER 'jornada_user'@'localhost'
  IDENTIFIED BY 'JornadaAprender2026';

ALTER USER 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'JornadaAprender2026';

FLUSH PRIVILEGES;
```

Depois confirme que o `.env` tem exatamente:

```env
DATABASE_URL=mysql://jornada_user:JornadaAprender2026@127.0.0.1:3306/jornada_aprender
```

Teste novamente:

```powershell
mysql -h 127.0.0.1 -u jornada_user -p jornada_aprender
```

### Se aparecer `ECONNREFUSED 127.0.0.1:3306`

Isso significa que o serviço do MySQL não está iniciado.

1. Pressione `Win + R`.
2. Digite `services.msc`.
3. Procure `MySQL80`.
4. Clique com o botão direito.
5. Clique em **Iniciar**.
6. Execute novamente:

```powershell
pnpm diagnose
```

## 🌐 Compartilhar resultados entre computadores

Para que os erros e acertos apareçam no painel do professor, apenas um computador deve executar o servidor e conectar ao MySQL. Os demais computadores devem abrir o IP desse servidor.

No computador servidor, descubra o endereço IPv4 com:

```powershell
ipconfig
```

O endereço normalmente começa com `192.168.` ou `10.`.

No Windows, libere a porta 3000 abrindo o PowerShell como administrador e executando:

```powershell
netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
```

Se o computador servidor tiver o IP `192.168.1.25`, os demais computadores devem acessar:

```text
http://192.168.1.25:3000
```

Não use `http://localhost:3000` nos computadores dos alunos, pois `localhost` sempre aponta para o próprio computador.

Todos os computadores devem estar conectados à mesma rede Wi-Fi ou Ethernet.

Consulte também o [guia de configuração da rede e do MySQL](docs/configuracao-rede-mysql.md).

## 📤 Exportar os resultados

No painel do professor, clique em **Exportar CSV** para baixar os registros atuais. O arquivo inclui aluno, acertos, erros, tentativas, níveis concluídos, tempo por nível e erros por nível.

## 🎨 Protótipo no Figma

Confira o protótipo visual e a proposta das telas do jogo:

[Acessar o protótipo no Figma](https://www.figma.com/make/GfBlaowJlofjQVycoYaSf3/Jogo-educativo-interativo?p=f&t=axdve6CL1dtQK3oV-0)

## 👥 Integrantes do projeto

- **Asaf H.**
- **Gustavo G.**
- **João A.**

---

<p align="center">
  Projeto desenvolvido para fins educacionais.
</p>
