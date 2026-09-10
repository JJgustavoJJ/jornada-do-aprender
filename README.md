# A Jornada do Aprender

Jogo educativo infantil para explorar as fases da escrita de forma lúdica e interativa. O projeto foi convertido para React + TypeScript + Vite e mantém a proposta original do código fornecido.

## Recursos

- Oito níveis pedagógicos, do treino de letras à escrita de palavras.
- Atividades de desenho em canvas com guias pontilhadas.
- Questões de múltipla escolha e respostas digitadas.
- Leitura das instruções em português usando Speech Synthesis.
- Feedback visual, confetes e progressão automática após acertos.
- Painel do professor com acertos, erros, tempo por nível e maior dificuldade.
- Persistência do histórico no `localStorage` do navegador.
- Layout responsivo para desktop, tablet e celular.

## Desenvolvimento local

```bash
pnpm install
pnpm run dev
```

Depois, abra o endereço exibido pelo Vite no navegador.

## Verificações

```bash
pnpm run check
pnpm run build
```

A senha padrão do painel do professor é `12345678`.

## Estrutura

A interface principal está em `client/src/pages/Home.tsx`, os estilos globais estão em `client/src/index.css` e o ponto de entrada HTML está em `client/index.html`.

## Licença

Projeto criado a partir do código fornecido pelo usuário para fins educacionais.
