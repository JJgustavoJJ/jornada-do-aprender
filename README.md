# A Jornada do Aprender

**A Jornada do Aprender** é um jogo educativo infantil para explorar as fases da escrita de forma lúdica e interativa. O projeto foi convertido para React + TypeScript + Vite e agora utiliza um servidor tRPC com MySQL para preservar o progresso dos alunos entre computadores.

## Recursos

O jogo reúne oito níveis pedagógicos, atividades de desenho em canvas com guias pontilhadas, questões de múltipla escolha, respostas digitadas, leitura das instruções em português usando Speech Synthesis, feedback visual com confetes e progressão automática após os acertos. O painel do professor mostra acertos, erros, tempo por nível e maior dificuldade de cada aluno.

Ao iniciar uma jornada, o snapshot do aluno é salvo na tabela `student_progress` do MySQL. O navegador mantém também um cache local para que as atividades continuem funcionando durante uma indisponibilidade breve da API. Quando o aluno volta a usar o mesmo nome em outro computador, o registro salvo no servidor é carregado e continua a ser atualizado.

## Painel do professor

O acesso começa pelo botão **Painel do Professor** e pela senha de aplicação `12345678`. Em seguida, o professor autentica-se pelo Manus OAuth. A leitura do painel exige uma sessão autenticada, e os dados são carregados pela procedure tRPC `studentProgress.list`. A limpeza do histórico é uma operação administrativa: ela aparece apenas para a conta com role `admin`, normalmente a conta proprietária configurada no ambiente.

A senha exibida no frontend é uma barreira de navegação compatível com o código original; a proteção efetiva do painel e da operação de limpeza é feita no servidor por autenticação e autorização. Em produção, a senha deve ser substituída por uma configuração segura caso seja necessário um controle adicional.

## Banco de dados

A tabela `student_progress` armazena um registro único por nome de aluno. Os contadores de acertos, erros e tentativas ficam em colunas numéricas; o detalhamento por nível fica em colunas JSON (`levelsDone`, `levelHits`, `levelErrors` e `timePerLevel`). A tabela `users` é usada pelo fluxo de autenticação Manus OAuth.

A variável `DATABASE_URL` é fornecida pelo ambiente WebDev e não deve ser commitada. Para atualizar o schema localmente, use:

```bash
pnpm install
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

A migração aplicada neste projeto está em `drizzle/0000_smooth_dreadnoughts.sql`.

## Desenvolvimento local

```bash
pnpm install
pnpm run dev
```

Depois, abra o endereço exibido pelo servidor. Para rodar as verificações:

```bash
pnpm run check
pnpm run test
pnpm run build
```

## Estrutura principal

A experiência do jogo e do painel está em `client/src/pages/Home.tsx`. O schema MySQL está em `drizzle/schema.ts`, os helpers de persistência estão em `server/db.ts` e os contratos tRPC estão em `server/routers.ts`. O cliente tRPC é configurado em `client/src/main.tsx`.

## Licença

Projeto criado a partir do código fornecido pelo usuário para fins educacionais.
