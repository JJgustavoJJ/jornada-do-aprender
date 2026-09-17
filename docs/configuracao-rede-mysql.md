# Configuração do MySQL e da rede local

Este guia configura um computador como servidor do jogo. Os demais computadores devem acessar o endereço IP desse servidor; eles não devem iniciar uma cópia própria do servidor nem usar `localhost`.

## 1. Computador servidor

No computador principal, instale Node.js LTS, Git, pnpm e MySQL. Depois clone o projeto e instale as dependências:

```bat
git clone https://github.com/JJgustavoJJ/jornada-do-aprender.git
cd jornada-do-aprender
pnpm.cmd install
```

Para automatizar a criação do banco, do usuário, do arquivo `.env` e das tabelas, execute no PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\setup-mysql-windows.ps1
```

O script solicitará a senha `root` do MySQL e uma nova senha para o usuário do jogo. As senhas ficam somente no `.env` local e não são versionadas.

Crie um arquivo `.env` na raiz, que **não deve ser enviado ao GitHub**, com este conteúdo:

```env
DATABASE_URL=mysql://jornada_user:SUA_SENHA_AQUI@127.0.0.1:3306/jornada_aprender
PORT=3000
NODE_ENV=development
```

Troque `SUA_SENHA_AQUI` pela senha escolhida no MySQL. Se a senha tiver caracteres especiais como `@`, `#`, `:`, `/` ou `%`, use uma senha sem esses caracteres ou faça o URL encoding correto.

## 2. Criar banco e usuário

Abra o MySQL como administrador e execute:

```sql
CREATE DATABASE IF NOT EXISTS jornada_aprender
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'jornada_user'@'localhost' IDENTIFIED BY 'SUA_SENHA_AQUI';
GRANT ALL PRIVILEGES ON jornada_aprender.* TO 'jornada_user'@'localhost';
FLUSH PRIVILEGES;
```

Em seguida, dentro da pasta do projeto, crie as tabelas:

```bat
pnpm.cmd db:push
pnpm.cmd run diagnose
```

O diagnóstico deve informar que o banco está conectado e que a porta 3000 está disponível.

## 3. Iniciar na porta fixa

```bat
pnpm.cmd run dev
```

O terminal deve informar `Server running on http://localhost:3000/`. Se ele informar outra porta, encerre o processo que está usando a 3000 ou defina `PORT` corretamente no `.env`.

No Windows, libere a porta como Administrador:

```powershell
netsh advfirewall firewall add rule name="Jornada do Aprender 3000" dir=in action=allow protocol=TCP localport=3000
```

Descubra o IPv4 do adaptador Wi-Fi com `ipconfig`. O endereço correto normalmente começa com `192.168.` ou `10.`. `192.168.56.1` costuma ser um adaptador virtual; não use esse endereço se os outros computadores não estiverem nessa mesma rede virtual.

## 4. Outros computadores

Todos devem estar na mesma rede Wi-Fi ou Ethernet. Eles devem abrir o IP do computador servidor, por exemplo:

```text
http://10.137.11.215:3000
```

Não use `http://localhost:3000` nos computadores dos alunos: `localhost` sempre aponta para o próprio computador.

## 5. Verificação dos resultados

1. No computador do aluno, abra o endereço do servidor e responda uma atividade.
2. No computador do professor, abra o mesmo endereço do servidor.
3. Entre no painel com a senha `12345678`.
4. O painel consulta o MySQL compartilhado e atualiza a cada 5 segundos.
5. Se aparecer “Tentando conectar ao banco compartilhado”, o servidor não encontrou o MySQL ou o painel está em uma cópia diferente do servidor.

Os computadores dos alunos não precisam ter MySQL instalado. Apenas o computador servidor precisa ter o `.env`, o MySQL e o processo `pnpm.cmd run dev` ativo. O servidor agora usa exatamente a porta `3000`; se ela estiver ocupada, ele informa o erro em vez de mudar para `3001`, evitando que os outros computadores usem um endereço errado.
