# Comandos e banco de dados

Este é o guia operacional do **A Jornada do Aprender**. Ele reúne os comandos para atualizar o projeto, preparar o banco MySQL, carregar os alunos e iniciar o aplicativo sem internet.

## 1. Atualizar o projeto existente

Não execute `git clone` novamente. Use a pasta que já existe:

```powershell
cd C:\Users\Aluno\jornada-do-aprender
git pull origin main
npm install
```

Se houver um servidor aberto, encerre-o antes da atualização com `Ctrl + C`.

## 2. Configurar o arquivo `.env`

Crie ou confira o arquivo `.env` na raiz do projeto, ao lado do `package.json`:

```dotenv
DATABASE_URL=mysql://jornada_user:SUA_SENHA@127.0.0.1:3306/jornada_aprender
PORT=3000
NODE_ENV=production
```

Substitua `SUA_SENHA` pela senha real do usuário `jornada_user`. O arquivo `.env` não deve ser enviado ao GitHub.

Se a senha tiver `@`, `#`, `:`, `/` ou `%`, use URL encoding ou escolha uma senha sem esses caracteres.

## 3. Criar o banco e o usuário MySQL

Abra o MySQL Workbench ou o cliente MySQL como `root` e execute:

```sql
CREATE DATABASE IF NOT EXISTS jornada_aprender
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'jornada_user'@'localhost'
  IDENTIFIED BY 'SUA_SENHA';
CREATE USER IF NOT EXISTS 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'SUA_SENHA';

ALTER USER 'jornada_user'@'localhost'
  IDENTIFIED BY 'SUA_SENHA';
ALTER USER 'jornada_user'@'127.0.0.1'
  IDENTIFIED BY 'SUA_SENHA';

GRANT ALL PRIVILEGES
  ON jornada_aprender.*
  TO 'jornada_user'@'localhost';
GRANT ALL PRIVILEGES
  ON jornada_aprender.*
  TO 'jornada_user'@'127.0.0.1';

FLUSH PRIVILEGES;
```

Troque todas as ocorrências de `SUA_SENHA` pela mesma senha usada no `.env`.

Os avisos abaixo são normais quando o banco ou o usuário já existem:

```text
1007: database exists
1973: user already exists
```

## 4. Criar as tabelas do projeto

Dentro da pasta do projeto, execute:

```powershell
pnpm db:push
```

Esse comando cria ou atualiza as tabelas definidas no schema Drizzle, incluindo:

- `users`
- `students`
- `student_progress`
- `student_answers`

## 5. Cadastrar os 34 alunos

Execute:

```powershell
pnpm db:seed:students
```

O resultado esperado é:

```text
Cadastro atualizado: 34 alunos.
```

Esse comando pode ser executado várias vezes sem duplicar os alunos.

Também existe um arquivo SQL pronto para importar pelo MySQL Workbench:

- [`scripts/alunos.sql`](../scripts/alunos.sql)

O script SQL cria a tabela `students` e cadastra o número, o nome e o sexo dos 34 alunos.

## 6. Testar a conexão

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

Se aparecer `Access denied`, a senha do `.env` não corresponde à senha do MySQL.

Se aparecer `ECONNREFUSED 127.0.0.1:3306`, inicie o serviço do MySQL.

## 7. Gerar o aplicativo para uso offline

O build deve ser gerado depois da instalação ou sempre que o código for atualizado:

```powershell
Remove-Item -Recurse -Force dist
npm run build
```

No Prompt de Comando do Windows, use:

```bat
rmdir /s /q dist
npm run build
```

## 8. Iniciar o aplicativo offline

Depois do build, inicie o servidor com:

```powershell
npm start
```

Abra no computador servidor:

```text
http://localhost:3000
```

O comando `npm start` usa os arquivos locais compilados e não precisa de internet durante a execução.

> Não use `pnpm dev` no computador que ficará disponível para os alunos. Esse comando é somente para desenvolvimento e hot reload.

## 9. Atualizar tudo depois de uma nova alteração no GitHub

Use este fluxo completo:

```powershell
cd C:\Users\Aluno\jornada-do-aprender
git pull origin main
npm install
pnpm db:push
pnpm db:seed:students
Remove-Item -Recurse -Force dist
npm run build
npm start
```

Se o servidor estiver rodando, pressione `Ctrl + C` antes de executar os comandos.

## 10. Acesso por outros computadores

Apenas o computador servidor deve executar `npm start` e acessar o MySQL.

No servidor Windows:

```powershell
ipconfig
```

Localize o IPv4 do Wi-Fi ou Ethernet. Depois, nos outros computadores, abra:

```text
http://IP-DO-SERVIDOR:3000
```

Exemplo:

```text
http://192.168.1.25:3000
```

Se o firewall bloquear a conexão, execute o PowerShell como administrador:

```powershell
netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
```

Não use `localhost` nos computadores dos alunos. Nesse caso, `localhost` aponta para o próprio computador do aluno.

## 11. Verificar os alunos no painel

1. Inicie o servidor com `npm start`.
2. Abra o jogo pelo endereço do servidor.
3. Acesse o **Painel do Professor**.
4. Informe a senha do painel: `12345678`.
5. Clique em **Atualizar dados**.
6. Confira os 34 alunos cadastrados.

Alunos que ainda não fizeram atividades aparecem com zero acertos, zero tentativas e sem tempo registrado. Quando o aluno jogar, o progresso será atualizado na tabela `student_progress` e cada tentativa será salva na tabela `student_answers`.

A tabela `student_answers` mantém respostas certas, erradas e novas tentativas separadamente, com aluno, nível, exercício, tipo de atividade, resposta enviada, resposta esperada e data.

## 12. Consultas úteis no MySQL

Ver todos os alunos:

```sql
USE jornada_aprender;
SELECT studentNumber, name, sex
FROM students
ORDER BY studentNumber;
```

Contar os alunos:

```sql
SELECT COUNT(*) AS total_alunos
FROM students;
```

Ver os progressos registrados:

```sql
SELECT studentName, hits, errors, attempts, updatedAt
FROM student_progress
ORDER BY studentName;
```

Ver as respostas individuais:

```sql
SELECT
  studentName,
  level,
  exercise,
  activityType,
  question,
  answer,
  expectedAnswer,
  IF(isCorrect = 1, 'Acertou', 'Errou') AS resultado,
  createdAt
FROM student_answers
ORDER BY createdAt DESC;
```

Ver as respostas de um aluno específico:

```sql
SELECT *
FROM student_answers
WHERE studentName = 'Nome do aluno'
ORDER BY createdAt;
```

Ver alunos ainda sem progresso:

```sql
SELECT s.studentNumber, s.name, s.sex
FROM students AS s
LEFT JOIN student_progress AS p
  ON p.studentName = s.name
WHERE p.id IS NULL
ORDER BY s.studentNumber;
```

> Não execute `DROP DATABASE`, `DROP TABLE` ou `DELETE FROM student_progress` sem fazer backup. Esses comandos podem apagar dados do painel.
