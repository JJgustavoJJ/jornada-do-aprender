import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

// Tipagem dos exercícios
interface ExerciseItem {
  guide?: string;
  speech: string;
  instruction: string;
  img?: string;
  options?: string[];
  correct?: number;
  correctAnswer?: string;
}

interface LevelData {
  title: string;
  type: "draw" | "choice" | "input";
  items: ExerciseItem[];
}

interface TeacherRecord {
  hits: number;
  errors: number;
  attempts: number;
  levelsDone: Record<string, boolean>;
  levelHits: Record<string, number>;
  levelErrors: Record<string, number>;
  timePerLevel: Record<string, number>;
}

// Mensagens alegres
const successMessages = [
  { title: "SENSACIONAL! 🎉", subtitle: "Você acertou! Indo para o próximo desafio..." },
  { title: "INCRÍVEL! 🌟", subtitle: "Que inteligência! Vamos para o próximo nível!" },
  { title: "MUITO BEM! 🚀", subtitle: "Você mandou super bem! Avançando..." },
  { title: "PARABÉNS! 🏆", subtitle: "Sua dedicação é maravilhosa! Próximo exercício..." },
  { title: "FANTÁSTICO! 🎈", subtitle: "Você acertou em cheio! Continuando..." }
];

const errorMessages = [
  { title: "QUASE LÁ! 💡", subtitle: "Tente novamente! Você consegue!" },
  { title: "VAMOS DE NOVO! 🎯", subtitle: "Dê mais uma olhada e tente mais uma vez!" },
  { title: "EU CONFIO EM VOCÊ! ✏️", subtitle: "Respira fundo e tente de novo!" },
  { title: "CHEGOU PERTO! 🔍", subtitle: "Observe com calma e tente outra resposta!" }
];

const levelNames: Record<number, string> = {
  1: "Nível 1 (Letras e Palavras)",
  2: "Nível 2 (Garatuja)",
  3: "Nível 3 (Pré-Silábico)",
  4: "Nível 4 (Silábico)",
  5: "Nível 5 (Silábico s/ Valor)",
  6: "Nível 6 (Silábico c/ Valor)",
  7: "Nível 7 (Silábico-Alfabético)",
  8: "Nível 8 (Alfabético)"
};

// Banco de dados completo de exercícios
const exercisesDatabase: Record<number, LevelData> = {
  1: {
    title: "Nível 1: Treino as letras e palavras!",
    type: "draw",
    items: [
      { guide: "A", speech: "Cubra a letra A!", instruction: "Cubra a letra A no pontilhado!" },
      { guide: "E", speech: "Cubra a letra E!", instruction: "Cubra a letra E no pontilhado!" },
      { guide: "I", speech: "Cubra a letra I!", instruction: "Cubra a letra I no pontilhado!" },
      { guide: "O", speech: "Cubra a letra O!", instruction: "Cubra a letra O no pontilhado!" },
      { guide: "U", speech: "Cubra a letra U!", instruction: "Cubra a letra U no pontilhado!" },
      { guide: "B", speech: "Cubra a letra B!", instruction: "Siga o pontilhado da letra B!" },
      { guide: "F", speech: "Cubra a letra F!", instruction: "Cubra a letra F por cima do pontilhado!" },
      { guide: "M", speech: "Cubra a letra M!", instruction: "Cubra a letra M por cima do pontilhado!" },
      { guide: "P", speech: "Cubra a letra P!", instruction: "Cubra a letra P por cima do pontilhado!" },
      { guide: "LUA", speech: "Cubra a palavra LUA!", instruction: "Treine a escrita da palavra LUA!" }
    ]
  },
  2: {
    title: "Nível 2: Escrevo do meu jeito!",
    type: "draw",
    items: [
      { instruction: "Desenhe uma maçã 🍎 do seu jeito no quadro!", speech: "Desenhe uma maçã do seu jeito!", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe um sol ☀️ bem brilhante!", speech: "Desenhe um sol bem bonito!", img: "/manus-storage/sun_573be81f.jpg" },
      { instruction: "Desenhe uma casa 🏠 do seu jeito!", speech: "Desenhe uma casa do seu jeito!", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe uma estrela ⭐️ no quadro!", speech: "Desenhe uma estrela brilhante!", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe uma flor 🌸 colorida!", speech: "Desenhe uma flor do seu jeito!", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe uma árvore 🌳 grande!", speech: "Desenhe uma árvore bem bonita!", img: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe um peixinho 🐟 nadando!", speech: "Desenhe um peixinho nadando!", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe uma bola ⚽ para brincar!", speech: "Desenhe uma bola para brincar!", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe um carrinho 🚗 no quadro!", speech: "Desenhe um carrinho bem legal!", img: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80" },
      { instruction: "Desenhe um sorvete 🍦 gostoso!", speech: "Desenhe um sorvete bem gostoso!", img: "/manus-storage/ice-cream_5572c8a4.jpg" }
    ]
  },
  3: {
    title: "Nível 3: Conheço letras!",
    type: "choice",
    items: [
      { instruction: "Qual opção tem apenas letras para BOLA?", speech: "Qual opção tem apenas letras?", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", options: ["1 2 3 4 5", "A O E I", "# $ % *"], correct: 1 },
      { instruction: "Qual opção tem letras para escrever GATO?", speech: "Qual opção tem letras para escrever GATO?", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", options: ["@ & ! ?", "G A T O", "9 8 7 6"], correct: 1 },
      { instruction: "Encontre as letras para escrever FLOR:", speech: "Encontre o grupo de letras para FLOR.", img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=400&q=80", options: ["F L O R", "5 4 3 2", "+ - = /"], correct: 0 },
      { instruction: "Qual das opções contém letras da palavra CASA?", speech: "Qual opção tem apenas letras?", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80", options: ["7 4 1 0", "C A S A", "△ ◯ □ ☆"], correct: 1 },
      { instruction: "Marque o conjunto que possui apenas letras:", speech: "Marque o conjunto que possui letras.", img: "/manus-storage/sun_573be81f.jpg", options: ["1 3 5 7", "9 8 2 4", "S O L"], correct: 2 },
      { instruction: "Qual grupo tem letras para a palavra PEIXE?", speech: "Qual grupo tem apenas letras?", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", options: ["P E I X E", "8 4 2 1", "# @ ! &"], correct: 0 },
      { instruction: "Marque a opção com letras verdadeiras:", speech: "Qual grupo é formado por letras?", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", options: ["3 7 9 0", "B A N A N A", "* % $ @"], correct: 1 },
      { instruction: "Aonde estão as letras para LUA?", speech: "Encontre as letras da palavra LUA.", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80", options: ["5 6 7", "L U A", "! ? #"], correct: 1 },
      { instruction: "Qual opção é usada para escrever DADO?", speech: "Escolha o grupo de letras.", img: "/manus-storage/dice_19ee8745.jpg", options: ["D A D O", "1 9 3 2", "◯ □ △"], correct: 0 },
      { instruction: "Identifique o conjunto de letras:", speech: "Qual conjunto traz apenas letras?", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", options: ["# % &", "9 2 4", "M A C A C O"], correct: 2 }
    ]
  },
  4: {
    title: "Nível 4: Conto as sílabas!",
    type: "choice",
    items: [
      { instruction: "Quantas sílabas tem a palavra CA-VA-LO?", speech: "Quantas sílabas tem a palavra CAVALO?", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "3 sílabas", "5 sílabas"], correct: 1 },
      { instruction: "Quantas sílabas tem a palavra BO-LA?", speech: "Quantas sílabas tem a palavra BOLA?", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "4 sílabas", "1 sílaba"], correct: 0 },
      { instruction: "Quantas sílabas tem a palavra PI-PO-CA?", speech: "Quantas sílabas tem a palavra PIPOCA?", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80", options: ["1 sílaba", "4 sílabas", "3 sílabas"], correct: 2 },
      { instruction: "Quantas sílabas tem a palavra SOL?", speech: "Quantas sílabas tem a palavra SOL?", img: "/manus-storage/sun_573be81f.jpg", options: ["1 sílaba", "2 sílabas", "3 sílabas"], correct: 0 },
      { instruction: "Quantas sílabas tem a palavra MA-CA-CO?", speech: "Quantas sílabas tem a palavra MACACO?", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "3 sílabas", "4 sílabas"], correct: 1 },
      { instruction: "Quantas sílabas tem a palavra BO-NE-CA?", speech: "Quantas sílabas tem a palavra BONECA?", img: "/manus-storage/doll_e3cb17ec.jpg", options: ["3 sílabas", "2 sílabas", "1 sílaba"], correct: 0 },
      { instruction: "Quantas sílabas tem a palavra GA-TO?", speech: "Quantas sílabas tem a palavra GATO?", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "1 sílaba", "3 sílabas"], correct: 0 },
      { instruction: "Quantas sílabas tem a palavra BA-NA-NA?", speech: "Quantas sílabas tem a palavra BANANA?", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "3 sílabas", "4 sílabas"], correct: 1 },
      { instruction: "Quantas sílabas tem a palavra PEI-XE?", speech: "Quantas sílabas tem a palavra PEIXE?", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", options: ["2 sílabas", "3 sílabas", "1 sílaba"], correct: 0 },
      { instruction: "Quantas sílabas tem a palavra SA-PA-TO?", speech: "Quantas sílabas tem a palavra SAPATO?", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", options: ["4 sílabas", "2 sílabas", "3 sílabas"], correct: 2 }
    ]
  },
  5: {
    title: "Nível 5: Uma letra por sílaba!",
    type: "choice",
    items: [
      { instruction: "Para GATO (2 sílabas), qual opção usa 2 letras?", speech: "Para GATO, qual opção usa duas letras?", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", options: ["X T P", "M O", "B R L K"], correct: 1 },
      { instruction: "Para PIPOCA (3 sílabas), qual opção usa 3 letras?", speech: "Para PIPOCA, qual opção usa três letras?", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80", options: ["P P C", "P C", "P I P O C A"], correct: 0 },
      { instruction: "Para BONECA (3 sílabas), escolha a opção de 3 letras:", speech: "Para BONECA, escolha a opção com três letras.", img: "/manus-storage/doll_e3cb17ec.jpg", options: ["B N C", "B N", "B O N E C A"], correct: 0 },
      { instruction: "Para CAVALO (3 sílabas), escolha a opção de 3 letras:", speech: "Para CAVALO, escolha a opção com três letras.", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", options: ["C V L", "C V", "C A V A L O"], correct: 0 },
      { instruction: "Para BOLA (2 sílabas), escolha a opção de 2 letras:", speech: "Para BOLA, escolha a opção com duas letras.", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", options: ["B L", "B O L A", "B L X Y"], correct: 0 },
      { instruction: "Para MACACO (3 sílabas), escolha 3 letras:", speech: "Para MACACO, escolha a opção com três letras.", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", options: ["M C K", "M C", "M A C A C O"], correct: 0 },
      { instruction: "Para BANANA (3 sílabas), escolha 3 letras:", speech: "Para BANANA, escolha a opção com três letras.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", options: ["B N N", "B N", "B A N A N A"], correct: 0 },
      { instruction: "Para SAPATO (3 sílabas), escolha 3 letras:", speech: "Para SAPATO, escolha a opção de três letras.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", options: ["S P T", "S P", "S A P A T O"], correct: 0 },
      { instruction: "Para PEIXE (2 sílabas), escolha 2 letras:", speech: "Para PEIXE, escolha a opção de duas letras.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", options: ["P X", "P X O L", "P E I X E"], correct: 0 },
      { instruction: "Para CASA (2 sílabas), escolha 2 letras:", speech: "Para CASA, escolha a opção de duas letras.", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80", options: ["C S", "C S P K", "C A S A"], correct: 0 }
    ]
  },
  6: {
    title: "Nível 6: Ouço o som da vogal!",
    type: "choice",
    items: [
      { instruction: "Para PI-PO-CA, escolha os sons das vogais:", speech: "Para PIPOCA, escolha as vogais certas do som.", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80", options: ["A - E - U", "I - O - A", "E - O - I"], correct: 1 },
      { instruction: "Para CA-VA-LO, escolha os sons das vogais:", speech: "Para CAVALO, escolha as vogais certas do som.", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", options: ["A - A - O", "E - E - U", "I - O - A"], correct: 0 },
      { instruction: "Para GA-TO, escolha as vogais correspondentes:", speech: "Para GATO, escolha as vogais do som.", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", options: ["A - O", "E - I", "U - A"], correct: 0 },
      { instruction: "Para BO-LA, escolha as vogais do som:", speech: "Para BOLA, escolha as vogais.", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", options: ["O - A", "I - E", "U - U"], correct: 0 },
      { instruction: "Para CA-SA, escolha as vogais do som:", speech: "Para CASA, escolha as vogais.", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80", options: ["A - A", "E - O", "I - U"], correct: 0 },
      { instruction: "Para BA-NA-NA, escolha as vogais do som:", speech: "Para BANANA, escolha as vogais.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", options: ["A - A - A", "O - O - O", "I - E - A"], correct: 0 },
      { instruction: "Para SA-PA-TO, escolha as vogais do som:", speech: "Para SAPATO, escolha as vogais.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", options: ["A - A - O", "E - U - I", "O - O - A"], correct: 0 },
      { instruction: "Para BO-NE-CA, escolha as vogais do som:", speech: "Para BONECA, escolha as vogais.", img: "/manus-storage/doll_e3cb17ec.jpg", options: ["O - E - A", "U - I - A", "E - O - U"], correct: 0 },
      { instruction: "Para MA-CA-CO, escolha as vogais do som:", speech: "Para MACACO, escolha as vogais.", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", options: ["A - A - O", "I - U - O", "E - A - I"], correct: 0 },
      { instruction: "Para PEI-XE, escolha as vogais do som:", speech: "Para PEIXE, escolha as vogais.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", options: ["E - E", "A - O", "U - I"], correct: 0 }
    ]
  },
  7: {
    title: "Nível 7: Quase sei escrever tudo!",
    type: "choice",
    items: [
      { instruction: "Complete a palavra CA-VA-LO: CA - _ A - LO", speech: "Complete a palavra CAVALO.", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", options: ["V", "B", "M"], correct: 0 },
      { instruction: "Complete a palavra BO-NE-CA: BO - _ E - CA", speech: "Complete a palavra BONECA.", img: "/manus-storage/doll_e3cb17ec.jpg", options: ["N", "P", "T"], correct: 0 },
      { instruction: "Complete a palavra GA-TO: G _ - TO", speech: "Complete a palavra GATO.", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", options: ["A", "E", "U"], correct: 0 },
      { instruction: "Complete a palavra PI-PO-CA: PI - PO - C _", speech: "Complete a palavra PIPOCA.", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80", options: ["A", "I", "O"], correct: 0 },
      { instruction: "Complete a palavra MA-CA-CO: MA - CA - _ O", speech: "Complete a palavra MACACO.", img: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=400&q=80", options: ["C", "B", "L"], correct: 0 },
      { instruction: "Complete a palavra SA-PA-TO: SA - _ A - TO", speech: "Complete a palavra SAPATO.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", options: ["P", "V", "D"], correct: 0 },
      { instruction: "Complete a palavra BO-LA: BO - _ A", speech: "Complete a palavra BOLA.", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", options: ["L", "M", "R"], correct: 0 },
      { instruction: "Complete a palavra CA-SA: CA - S _", speech: "Complete a palavra CASA.", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80", options: ["A", "O", "E"], correct: 0 },
      { instruction: "Complete a palavra BA-NA-NA: BA - NA - N _", speech: "Complete a palavra BANANA.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", options: ["A", "I", "U"], correct: 0 },
      { instruction: "Complete a palavra PEI-XE: PEI - X _", speech: "Complete a palavra PEIXE.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", options: ["E", "A", "O"], correct: 0 }
    ]
  },
  8: {
    title: "Nível 8: Sei escrever palavras!",
    type: "input",
    items: [
      { instruction: "Escreva o nome deste animal:", speech: "Escreva GATO.", img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80", correctAnswer: "GATO" },
      { instruction: "Escreva o nome deste objeto:", speech: "Escreva BOLA.", img: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=400&q=80", correctAnswer: "BOLA" },
      { instruction: "Escreva o nome desta fruta:", speech: "Escreva MACA.", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80", correctAnswer: "MACA" },
      { instruction: "Escreva o nome deste animal:", speech: "Escreva CAVALO.", img: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=400&q=80", correctAnswer: "CAVALO" },
      { instruction: "Escreva o nome desta fruta:", speech: "Escreva BANANA.", img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80", correctAnswer: "BANANA" },
      { instruction: "Escreva o nome deste calçado:", speech: "Escreva SAPATO.", img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80", correctAnswer: "SAPATO" },
      { instruction: "Escreva o nome deste animal de estimação:", speech: "Escreva PEIXE.", img: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", correctAnswer: "PEIXE" },
      { instruction: "Escreva o nome deste lugar:", speech: "Escreva CASA.", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80", correctAnswer: "CASA" },
      { instruction: "Escreva o nome deste brinquedo:", speech: "Escreva BONECA.", img: "/manus-storage/doll_e3cb17ec.jpg", correctAnswer: "BONECA" },
      { instruction: "Escreva o nome deste alimento gostoso:", speech: "Escreva PIPOCA.", img: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=400&q=80", correctAnswer: "PIPOCA" }
    ]
  }
};

declare global {
  interface Window {
    confetti?: (options?: any) => void;
  }
}

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const trpcUtils = trpc.useUtils();
  const saveProgressMutation = trpc.studentProgress.save.useMutation({
    onSuccess: () => {
      void trpcUtils.studentProgress.list.invalidate();
    },
  });
  const teacherProgressQuery = trpc.studentProgress.list.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 0,
    refetchInterval: isAuthenticated ? 5000 : false,
    refetchOnWindowFocus: true,
  });
  const clearProgressMutation = trpc.studentProgress.clear.useMutation();

  // Telas: 'home' | 'menu' | 'game' | 'teacher'
  const [screen, setScreen] = useState<"home" | "menu" | "game" | "teacher">("home");
  const [studentName, setStudentName] = useState("");
  const [currentStudent, setCurrentStudent] = useState("Aluno Visitante");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Estados do Jogo
  const [currentLevelIdx, setCurrentLevelIdx] = useState<number>(1);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [levelStartTime, setLevelStartTime] = useState<number | null>(null);

  // Feedback do jogo
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; title: string; subtitle: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [imageError, setImageError] = useState(false);

  // Modais
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState("");
  const [authError, setAuthError] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);

  // Cache local para manter o jogo utilizável durante uma indisponibilidade breve da API.
  const [localRecords, setLocalRecords] = useState<Record<string, TeacherRecord>>(() => {
    try {
      const data = localStorage.getItem("teacherRecords");
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  });

  const teacherRecords: Record<string, TeacherRecord> =
    teacherProgressQuery.data && teacherProgressQuery.data.length > 0
      ? Object.fromEntries(teacherProgressQuery.data.map((record) => [record.studentName, record as TeacherRecord]))
      : localRecords;

  // Canvas ref e desenho
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  // Áudio com SpeechSynthesis
  const speak = (text: string) => {
    if (!isAudioEnabled || !text) {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      return;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      if (!next && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      } else if (next && screen === "game") {
        const item = exercisesDatabase[currentLevelIdx]?.items[currentExerciseIndex];
        if (item) speak(item.speech);
      }
      return next;
    });
  };

  const createEmptyTeacherRecord = (): TeacherRecord => ({
    hits: 0,
    errors: 0,
    attempts: 0,
    levelsDone: {},
    levelHits: {},
    levelErrors: {},
    timePerLevel: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
  });

  const toProgressPayload = (student: string, record: TeacherRecord) => ({
    studentName: student,
    hits: record.hits,
    errors: record.errors,
    attempts: record.attempts,
    levelsDone: record.levelsDone,
    levelHits: record.levelHits,
    levelErrors: record.levelErrors,
    timePerLevel: record.timePerLevel,
  });

  const persistRecord = (student: string, record: TeacherRecord) => {
    setLocalRecords((prev) => {
      const updated = { ...prev, [student]: record };
      localStorage.setItem("teacherRecords", JSON.stringify(updated));
      return updated;
    });
    saveProgressMutation.mutate(toProgressPayload(student, record));
  };

  // Acumular tempo gasto no nível atual
  const acumularTempoNivel = () => {
    if (currentLevelIdx && levelStartTime) {
      const tempoDecorrido = Math.floor((Date.now() - levelStartTime) / 1000);
      const currentRecord = localRecords[currentStudent] ?? createEmptyTeacherRecord();
      const updatedRecord: TeacherRecord = {
        ...currentRecord,
        timePerLevel: {
          ...currentRecord.timePerLevel,
          [currentLevelIdx]: (currentRecord.timePerLevel[currentLevelIdx] || 0) + tempoDecorrido,
        },
      };
      persistRecord(currentStudent, updatedRecord);
      setLevelStartTime(null);
    }
  };

  // Iniciar Jornada. O registro existente no MySQL tem prioridade sobre o cache local.
  const startJourney = async () => {
    const nome = studentName.trim() !== "" ? studentName.trim() : "Aluno " + Math.floor(Math.random() * 899 + 100);
    let serverRecord: TeacherRecord | null = null;

    try {
      serverRecord = await trpcUtils.studentProgress.get.fetch({ studentName: nome }) as TeacherRecord | null;
    } catch {
      // Se a API estiver temporariamente indisponível, o cache local continua funcionando.
    }

    const record = serverRecord ?? localRecords[nome] ?? createEmptyTeacherRecord();
    setCurrentStudent(nome);
    setLocalRecords((prev) => {
      const updated = { ...prev, [nome]: record };
      localStorage.setItem("teacherRecords", JSON.stringify(updated));
      return updated;
    });
    if (!serverRecord) saveProgressMutation.mutate(toProgressPayload(nome, record));
    setScreen("menu");
  };

  // Abrir Nível
  const openLevel = (lvl: number) => {
    acumularTempoNivel();
    setCurrentLevelIdx(lvl);
    setCurrentExerciseIndex(0);
    setLevelStartTime(Date.now());
    setFeedback(null);
    setSelectedOption(null);
    setIsOptionDisabled(false);
    setInputVal("");
    setScreen("game");
  };

  const exitLevelToMenu = () => {
    acumularTempoNivel();
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setScreen("menu");
  };

  // Próximo exercício ou nível
  const nextLevelOrExercise = () => {
    const totalItems = exercisesDatabase[currentLevelIdx].items.length;
    const nextIdx = currentExerciseIndex + 1;

    setFeedback(null);
    setSelectedOption(null);
    setIsOptionDisabled(false);
    setInputVal("");

    if (nextIdx >= totalItems) {
      if (currentLevelIdx < 8) {
        setCurrentLevelIdx((prev) => prev + 1);
        setCurrentExerciseIndex(0);
        setLevelStartTime(Date.now());
      } else {
        exitLevelToMenu();
        return;
      }
    } else {
      setCurrentExerciseIndex(nextIdx);
    }
  };

  // Registrar pontuação e enviar o snapshot atualizado para o MySQL.
  const registerScore = (isCorrect: boolean) => {
    const currentRecord = localRecords[currentStudent] ?? createEmptyTeacherRecord();
    const updatedRecord: TeacherRecord = {
      ...currentRecord,
      attempts: currentRecord.attempts + 1,
      hits: currentRecord.hits + (isCorrect ? 1 : 0),
      errors: currentRecord.errors + (isCorrect ? 0 : 1),
      levelsDone: isCorrect ? { ...currentRecord.levelsDone, [currentLevelIdx]: true } : currentRecord.levelsDone,
      levelHits: isCorrect
        ? { ...currentRecord.levelHits, [currentLevelIdx]: (currentRecord.levelHits[currentLevelIdx] || 0) + 1 }
        : currentRecord.levelHits,
      levelErrors: !isCorrect
        ? { ...currentRecord.levelErrors, [currentLevelIdx]: (currentRecord.levelErrors[currentLevelIdx] || 0) + 1 }
        : currentRecord.levelErrors,
    };
    persistRecord(currentStudent, updatedRecord);
  };

  // Exibir sucesso
  const triggerSuccess = () => {
    registerScore(true);
    const randomMsg = successMessages[Math.floor(Math.random() * successMessages.length)];
    setFeedback({ type: "success", title: randomMsg.title, subtitle: randomMsg.subtitle });
    speak(`${randomMsg.title} ${randomMsg.subtitle}`);

    if (typeof window.confetti === "function") {
      window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setTimeout(() => {
      nextLevelOrExercise();
    }, 1500);
  };

  // Exibir erro
  const triggerError = () => {
    registerScore(false);
    const randomMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    setFeedback({ type: "error", title: randomMsg.title, subtitle: randomMsg.subtitle });
    speak(`${randomMsg.title} ${randomMsg.subtitle}`);
  };

  // Tratamento de múltipla escolha
  const handleChoice = (idx: number, correctIdx: number) => {
    setSelectedOption(idx);
    if (idx === correctIdx) {
      setIsOptionDisabled(true);
      triggerSuccess();
    } else {
      triggerError();
    }
  };

  // Tratamento de input
  const handleInputCheck = () => {
    const currentEx = exercisesDatabase[currentLevelIdx].items[currentExerciseIndex];
    const val = inputVal.trim().toUpperCase();
    const correct = currentEx.correctAnswer?.toUpperCase();

    if (val === correct) {
      triggerSuccess();
    } else {
      triggerError();
      setInputVal("");
    }
  };

  // Canvas: Guia pontilhada e interação
  const drawGuideLetter = (ctx: CanvasRenderingContext2D, width: number, height: number, guideText?: string) => {
    if (!guideText) return;
    ctx.save();
    const fontSize = guideText.length > 1 ? 80 : 160;
    ctx.font = `bold ${fontSize}px 'Fredoka', sans-serif`;
    ctx.fillStyle = "rgba(140, 140, 140, 0.25)";
    ctx.strokeStyle = "rgba(120, 120, 120, 0.4)";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 8]);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const x = width / 2;
    const y = height / 2 + (guideText.length > 1 ? 5 : 10);
    ctx.fillText(guideText, x, y);
    ctx.strokeText(guideText, x, y);
    ctx.restore();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentEx = exercisesDatabase[currentLevelIdx]?.items[currentExerciseIndex];
    drawGuideLetter(ctx, canvas.width, canvas.height, currentEx?.guide);
  };

  // Atualização do exercício atual
  useEffect(() => {
    if (screen === "game") {
      const currentEx = exercisesDatabase[currentLevelIdx]?.items[currentExerciseIndex];
      if (currentEx) {
        setImageError(false);
        speak(currentEx.speech);

        if (exercisesDatabase[currentLevelIdx]?.type === "draw") {
          setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                drawGuideLetter(ctx, canvas.width, canvas.height, currentEx.guide);
              }
            }
          }, 50);
        }
      }
    }
  }, [screen, currentLevelIdx, currentExerciseIndex]);

  // Eventos do Canvas para Desenho e Toque
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#8a2be2";
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if ("touches" in e) {
      if (e.cancelable) e.preventDefault();
    }
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  // Formatar tempo
  const formatarTempo = (segundosTotais: number) => {
    if (!segundosTotais || segundosTotais <= 0) return "0s";
    const min = Math.floor(segundosTotais / 60);
    const seg = segundosTotais % 60;
    if (min > 0) {
      return `${min}m ${seg}s`;
    }
    return `${seg}s`;
  };

  const verifyTeacherPassword = () => {
    if (teacherPassword !== "12345678") {
      setAuthError(true);
      return;
    }

    if (!isAuthenticated) {
      sessionStorage.setItem("open-teacher-panel", "1");
      setShowTeacherAuthModal(false);
      startLogin();
      return;
    }

    setShowTeacherAuthModal(false);
    setTeacherPassword("");
    setAuthError(false);
    acumularTempoNivel();
    setScreen("teacher");
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (sessionStorage.getItem("open-teacher-panel") !== "1") return;
    sessionStorage.removeItem("open-teacher-panel");
    setScreen("teacher");
  }, [isAuthenticated]);

  const confirmClearTeacherData = () => {
    clearProgressMutation.mutate(undefined, {
      onSuccess: () => {
        setLocalRecords({});
        localStorage.removeItem("teacherRecords");
        setShowClearDataModal(false);
        void teacherProgressQuery.refetch();
      },
    });
  };

  const currentLevelData = exercisesDatabase[currentLevelIdx];
  const currentExercise = currentLevelData?.items[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#333] font-['Quicksand'] flex justify-center items-start p-4 select-none">
      <div className="w-full max-w-[950px] mx-auto">
        {/* ==================== TELA 1: HOME ==================== */}
        {screen === "home" && (
          <div className="text-center py-6 animate-in fade-in duration-300">
            <div className="flex justify-end mb-2">
              <button
                onClick={toggleAudio}
                className={`w-12 h-12 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center text-xl bg-white hover:bg-gray-50 transition active:scale-95 ${
                  !isAudioEnabled ? "bg-red-50 border-red-300" : ""
                }`}
                title="Ativar/Desativar Som"
              >
                {isAudioEnabled ? "🔊" : "🔇"}
              </button>
            </div>

            <div className="text-7xl mb-2">🗺️</div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#7c2ae8] font-['Fredoka'] tracking-tight">
              A JORNADA DO
            </h1>
            <h1 className="text-5xl md:text-6xl font-extrabold text-[#ff3385] font-['Fredoka'] -mt-2 mb-2 tracking-tight">
              APRENDER!
            </h1>
            <p className="text-gray-600 font-bold text-lg md:text-xl mb-4">
              EXPLORE AS FASES DA ESCRITA! 🚀
            </p>

            {/* Ícones dos Níveis */}
            <div className="flex justify-center gap-3 flex-wrap my-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white bg-[#1e88e5] text-sm">
                abc
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#ff4081]">
                ✏️
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#7c4dff]">
                🌱
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#29b6f6]">
                👏
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#ffa726]">
                📦
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#26a69a]">
                🔊
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#00acc1]">
                🔀
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-md border-2 border-white bg-[#ffb300]">
                🏆
              </div>
            </div>

            <div className="max-w-md mx-auto mb-4">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Digite seu nome aqui! ✏️"
                className="w-full text-center font-bold text-xl py-3 px-4 rounded-3xl border-2 border-[#8a2be2] shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 transition bg-white"
              />
            </div>

            <div className="max-w-md mx-auto">
              <button
                onClick={startJourney}
                className="w-full bg-gradient-to-r from-[#8a2be2] to-[#6b11c9] hover:from-[#7b1dd8] hover:to-[#5c0db5] text-white font-['Fredoka'] text-2xl py-4 px-8 rounded-full shadow-lg shadow-purple-300 transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Começar a Jornada! 🗺️
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={() => {
                  setShowTeacherAuthModal(true);
                  setAuthError(false);
                  setTeacherPassword("");
                }}
                className="text-gray-500 hover:text-purple-700 font-bold tracking-wide transition text-sm flex items-center justify-center gap-1 mx-auto"
              >
                🎓 PAINEL DO PROFESSOR
              </button>
            </div>
          </div>
        )}

        {/* ==================== TELA 2: MENU DE NÍVEIS ==================== */}
        {screen === "menu" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    acumularTempoNivel();
                    setScreen("home");
                  }}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm hover:bg-gray-50 active:scale-95 transition"
                  title="Voltar ao início"
                >
                  🏠
                </button>
                <div>
                  <h2 className="text-2xl font-bold font-['Fredoka'] text-[#7c2ae8] leading-tight">
                    A JORNADA DO APRENDER
                  </h2>
                  <span className="text-gray-500 font-bold text-sm tracking-wide">
                    ESCOLHA SEU NÍVEL!
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleAudio}
                  className={`w-11 h-11 rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-lg bg-white hover:bg-gray-50 transition active:scale-95 ${
                    !isAudioEnabled ? "bg-red-50 border-red-300" : ""
                  }`}
                  title="Ativar/Desativar Som"
                >
                  {isAudioEnabled ? "🔊" : "🔇"}
                </button>
                <span className="bg-purple-600 text-white font-bold px-3 py-1.5 rounded-xl text-sm shadow-sm flex items-center gap-1">
                  👤 {currentStudent}
                </span>
              </div>
            </div>

            {/* Lista dos 8 Níveis */}
            <div className="grid gap-3">
              {[
                { lvl: 1, icon: "abc", isText: true, title: "Treino as letras e palavras!", sub: "Alfabeto e Palavras Simples", border: "border-blue-300 hover:border-blue-500", bgIcon: "bg-blue-600", badgeBg: "bg-blue-100 text-blue-800" },
                { lvl: 2, icon: "✏️", title: "Escrevo do meu jeito!", sub: "Garatuja", border: "border-pink-300 hover:border-pink-500", bgIcon: "bg-pink-500", badgeBg: "bg-pink-100 text-pink-800" },
                { lvl: 3, icon: "🌱", title: "Conheço letras!", sub: "Pré-Silábico", border: "border-purple-300 hover:border-purple-500", bgIcon: "bg-purple-600", badgeBg: "bg-purple-100 text-purple-800" },
                { lvl: 4, icon: "👏", title: "Conto as sílabas!", sub: "Silábico", border: "border-sky-300 hover:border-sky-500", bgIcon: "bg-sky-500", badgeBg: "bg-sky-100 text-sky-800" },
                { lvl: 5, icon: "📦", title: "Uma letra por sílaba!", sub: "Silábico s/ Valor Sonoro", border: "border-amber-300 hover:border-amber-500", bgIcon: "bg-amber-500", badgeBg: "bg-amber-100 text-amber-800" },
                { lvl: 6, icon: "🔊", title: "Ouço o som da vogal!", sub: "Silábico c/ Valor Sonoro", border: "border-teal-300 hover:border-teal-500", bgIcon: "bg-teal-600", badgeBg: "bg-teal-100 text-teal-800" },
                { lvl: 7, icon: "🔀", title: "Quase sei escrever tudo!", sub: "Silábico-Alfabético", border: "border-cyan-300 hover:border-cyan-500", bgIcon: "bg-cyan-600", badgeBg: "bg-cyan-100 text-cyan-800" },
                { lvl: 8, icon: "🏆", title: "Sei escrever palavras!", sub: "Alfabético", border: "border-yellow-300 hover:border-yellow-500", bgIcon: "bg-yellow-500", badgeBg: "bg-yellow-100 text-yellow-800" }
              ].map((item) => (
                <div
                  key={item.lvl}
                  onClick={() => openLevel(item.lvl)}
                  className={`bg-white rounded-3xl p-4 flex items-center shadow-sm hover:shadow-md transition cursor-pointer border-2 ${item.border} transform hover:-translate-y-0.5 active:translate-y-0`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mr-4 shrink-0 shadow-sm ${item.bgIcon}`}>
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg flex items-center gap-1.5 ${item.badgeBg}`}>
                        Nível {item.lvl}
                        <span className="bg-white/80 text-gray-800 px-1 rounded text-[10px]">10 Exercícios</span>
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 font-['Fredoka'] m-0 leading-snug">
                      {item.title}
                    </h3>
                    <div className="text-gray-500 text-sm">{item.sub}</div>
                  </div>
                  <div className="text-gray-400 text-2xl font-bold ml-2">❯</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TELA 3: ÁREA DO JOGO ==================== */}
        {screen === "game" && currentExercise && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={exitLevelToMenu}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm hover:bg-gray-50 active:scale-95 transition"
                  title="Voltar aos Níveis"
                >
                  ⬅️
                </button>
                <div className="font-extrabold text-xl md:text-2xl text-purple-700 font-['Fredoka']">
                  {currentLevelData.title} ({currentExerciseIndex + 1}/10)
                </div>
              </div>

              <button
                onClick={toggleAudio}
                className={`w-11 h-11 rounded-full border border-gray-200 shadow-sm flex items-center justify-center text-lg bg-white hover:bg-gray-50 transition active:scale-95 ${
                  !isAudioEnabled ? "bg-red-50 border-red-300" : ""
                }`}
                title="Ativar/Desativar Som"
              >
                {isAudioEnabled ? "🔊" : "🔇"}
              </button>
            </div>

            {/* Card Principal do Exercício */}
            <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 text-center relative border border-purple-50">
              {/* Imagem Ilustrativa se houver */}
              {currentExercise.img && !imageError && (
                <div className="flex justify-center mb-4">
                  <img
                    src={currentExercise.img}
                    alt={`Imagem correspondente: ${currentExercise.speech.replace(/[!.?]/g, "")}`}
                    className="w-44 h-44 object-cover rounded-2xl shadow-md border-4 border-white"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
              {currentExercise.img && imageError && (
                <div className="flex flex-col items-center justify-center gap-2 mb-4 w-44 h-44 mx-auto rounded-2xl bg-purple-50 border-4 border-white shadow-md text-purple-700">
                  <span className="text-4xl">🖼️</span>
                  <span className="text-xs font-bold">Imagem indisponível</span>
                </div>
              )}

              {/* Instrução e botão de repetir áudio */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <p className="text-2xl md:text-3xl font-extrabold text-gray-800 font-['Fredoka'] m-0">
                  {currentExercise.instruction}
                </p>
                <button
                  onClick={() => speak(currentExercise.speech)}
                  className="w-9 h-9 rounded-full border border-purple-400 text-purple-600 hover:bg-purple-50 flex items-center justify-center transition active:scale-90"
                  title="Ouvir instrução"
                >
                  🔊
                </button>
              </div>

              {/* TIPO: DRAW (DESENHO / PONTILHADO) */}
              {currentLevelData.type === "draw" && (
                <div className="flex flex-col items-center">
                  <div className="w-[340px] h-[240px] mb-4 relative">
                    <canvas
                      ref={canvasRef}
                      width={340}
                      height={240}
                      className="border-4 border-dashed border-[#8a2be2] bg-[#faf8ff] rounded-3xl cursor-crosshair touch-none shadow-inner"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={clearCanvas}
                      className="border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-full transition active:scale-95"
                    >
                      Limpar 🧹
                    </button>
                    <button
                      onClick={triggerSuccess}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-full shadow-md shadow-purple-300 transition active:scale-95"
                    >
                      Concluir Desenho ✨
                    </button>
                  </div>
                </div>
              )}

              {/* TIPO: CHOICE (MÚLTIPLA ESCOLHA) */}
              {currentLevelData.type === "choice" && currentExercise.options && (
                <div className="grid gap-3 max-w-md mx-auto my-4">
                  {currentExercise.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentExercise.correct;
                    let btnClass = "bg-[#fbf7ff] text-[#8a2be2] border-2 border-[#8a2be2] shadow-[0_4px_0_#8a2be2] hover:bg-[#8a2be2] hover:text-white";

                    if (isSelected) {
                      if (isCorrect) {
                        btnClass = "bg-green-600 text-white border-2 border-green-800 shadow-[0_4px_0_#1b5e20] !important";
                      } else {
                        btnClass = "bg-red-500 text-white border-2 border-red-700 shadow-[0_4px_0_#b71c1c] opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isOptionDisabled}
                        onClick={() => handleChoice(idx, currentExercise.correct!)}
                        className={`py-3.5 px-6 rounded-2xl font-bold text-xl md:text-2xl transition transform active:translate-y-1 ${btnClass}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TIPO: INPUT (DIGITAÇÃO) */}
              {currentLevelData.type === "input" && (
                <div className="max-w-md mx-auto my-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleInputCheck();
                      }}
                      placeholder="Digite aqui..."
                      className="w-full text-center font-extrabold text-2xl md:text-3xl py-3 px-4 rounded-3xl border-3 border-[#8a2be2] shadow-sm tracking-[4px] uppercase focus:outline-none focus:ring-4 focus:ring-purple-200 transition bg-white"
                    />
                  </div>
                  <button
                    onClick={handleInputCheck}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-['Fredoka'] text-2xl py-3.5 px-8 rounded-2xl shadow-md shadow-purple-300 transition active:scale-95"
                  >
                    Conferir 🔍
                  </button>
                </div>
              )}

              {/* BANNER DE FEEDBACK ANIMADO */}
              {feedback && (
                <div
                  className={`mt-6 p-4 rounded-2xl animate-in zoom-in-75 duration-300 border-3 ${
                    feedback.type === "success"
                      ? "bg-gradient-to-r from-green-50 to-emerald-100 border-green-500 text-green-900"
                      : "bg-gradient-to-r from-amber-50 to-orange-100 border-amber-500 text-orange-900"
                  }`}
                >
                  <h3 className="font-['Fredoka'] font-extrabold text-2xl mb-1">
                    {feedback.title}
                  </h3>
                  <p className="font-bold text-lg m-0">{feedback.subtitle}</p>
                  {feedback.type === "error" && (
                    <div className="mt-2 font-bold text-sm text-gray-700">
                      Sua vez de tentar de novo! 💪
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TELA 4: PAINEL DO PROFESSOR ==================== */}
        {screen === "teacher" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setScreen("home")}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm hover:bg-gray-50 active:scale-95 transition"
                  title="Voltar ao início"
                >
                  🏠
                </button>
                <h2 className="text-2xl font-bold font-['Fredoka'] text-[#7c2ae8]">
                  🎓 PAINEL DO PROFESSOR
                </h2>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Evolução Detalhada por Aluno
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Acompanhe acertos, tempo em cada nível e pontos de melhoria de cada criança.
                  </p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">☁️ Dados sincronizados entre computadores</p>
                  {teacherProgressQuery.dataUpdatedAt > 0 && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Última atualização: {new Date(teacherProgressQuery.dataUpdatedAt).toLocaleTimeString("pt-BR")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                  <button
                    onClick={() => void teacherProgressQuery.refetch()}
                    disabled={teacherProgressQuery.isFetching}
                    className="border border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50 font-bold px-4 py-2 rounded-full text-sm transition"
                  >
                    {teacherProgressQuery.isFetching ? "Atualizando..." : "Atualizar dados ↻"}
                  </button>
                  {user?.role === "admin" ? (
                    <button
                      onClick={() => setShowClearDataModal(true)}
                      className="border border-red-500 text-red-600 hover:bg-red-50 font-bold px-4 py-2 rounded-full text-sm transition"
                    >
                      {clearProgressMutation.isPending ? "Limpando..." : "Limpar Histórico 🗑️"}
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 font-bold bg-gray-50 px-3 py-2 rounded-full">
                      Histórico protegido
                    </span>
                  )}
                </div>
              </div>

              {teacherProgressQuery.isLoading || authLoading ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-2">☁️</div>
                  <p className="font-bold text-lg">Sincronizando registros...</p>
                  <p className="text-sm">Buscando os dados compartilhados no MySQL.</p>
                </div>
              ) : teacherProgressQuery.error ? (
                <div className="text-center py-12 text-red-500">
                  <div className="text-5xl mb-2">⚠️</div>
                  <p className="font-bold text-lg">Não foi possível carregar o painel.</p>
                  <p className="text-sm mb-4">Verifique sua conta de educador e tente novamente.</p>
                  <button
                    onClick={() => void teacherProgressQuery.refetch()}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-full transition"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : Object.keys(teacherRecords).length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-2">📊</div>
                  <p className="font-bold text-lg">Nenhum registro de aluno encontrado ainda.</p>
                  <p className="text-sm">Inicie a jornada como aluno para gerar relatórios aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm font-bold border-b border-gray-200">
                        <th className="py-3 px-4">Aluno</th>
                        <th className="py-3 px-4 text-center">Quantidade de Acertos</th>
                        <th className="py-3 px-4 text-center">Tempo em Cada Nível ⏱️</th>
                        <th className="py-3 px-4 text-center">Erros por Nível</th>
                        <th className="py-3 px-4 text-center">Maior Dificuldade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {Object.keys(teacherRecords).map((student) => {
                        const rec = teacherRecords[student];
                        const errorsMap = rec.levelErrors || {};
                        const timeMap = rec.timePerLevel || {};
                        const hits = rec.hits || 0;
                        const attempts = rec.attempts || 0;

                        // Tempos
                        const timeList = [];
                        for (let i = 1; i <= 8; i++) {
                          const seg = timeMap[i] || 0;
                          if (seg > 0) {
                            timeList.push({ lvl: i, seg });
                          }
                        }

                        // Erros e Maior Dificuldade
                        const errorLevelKeys = Object.keys(errorsMap).filter(
                          (lvl) => errorsMap[Number(lvl)] > 0
                        );
                        let maxErrorCount = 0;
                        let hardestLevelForStudent = "Nenhum";

                        errorLevelKeys.forEach((lvlStr) => {
                          const lvlNum = Number(lvlStr);
                          const count = errorsMap[lvlNum];
                          if (count > maxErrorCount) {
                            maxErrorCount = count;
                            hardestLevelForStudent = levelNames[lvlNum] || `Nível ${lvlNum}`;
                          }
                        });

                        return (
                          <tr key={student} className="hover:bg-purple-50/30 transition">
                            <td className="py-4 px-4 font-bold text-gray-800 text-base">
                              {student}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className="inline-block bg-green-100 text-green-800 font-bold px-3 py-1 rounded-full text-sm">
                                {hits} acerto(s)
                              </span>
                              <div className="text-xs text-gray-400 mt-1">
                                de {attempts} tentativa(s)
                              </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                              {timeList.length === 0 ? (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                                  Sem tempo registrado
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1 justify-center max-w-xs mx-auto">
                                  {timeList.map((t) => (
                                    <span
                                      key={t.lvl}
                                      className="text-xs bg-cyan-100 text-cyan-800 font-medium px-2 py-0.5 rounded-md"
                                    >
                                      ⏱️ N{t.lvl}: {formatarTempo(t.seg)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {errorLevelKeys.length === 0 ? (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-md">
                                  Sem erros registrados
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-1 justify-center max-w-xs mx-auto">
                                  {errorLevelKeys.map((lvlStr) => (
                                    <span
                                      key={lvlStr}
                                      className="text-xs bg-red-100 text-red-700 font-medium px-2 py-0.5 rounded-md"
                                    >
                                      ⚠️ N{lvlStr}: {errorsMap[Number(lvlStr)]} erro(s)
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {maxErrorCount > 0 ? (
                                <span className="inline-block bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-xs">
                                  🔥 {hardestLevelForStudent} ({maxErrorCount} erros)
                                </span>
                              ) : attempts > 0 ? (
                                <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-xs">
                                  Nenhuma dificuldade! 🎉
                                </span>
                              ) : (
                                <span className="inline-block bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-md text-xs">
                                  Aguardando início
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== MODAL DE SENHA DO PROFESSOR ==================== */}
        {showTeacherAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#faf8ff] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-purple-100 text-center animate-in zoom-in-95 duration-200">
              <div className="text-6xl mb-2">🔑</div>
              <h3 className="text-2xl font-bold font-['Fredoka'] text-[#7c2ae8] mb-1">
                Área do Educador!
              </h3>
              <p className="text-gray-500 font-semibold text-sm mb-4">
                Digite a senha mágica para acompanhar a evolução das crianças 🎓
                {!isAuthenticated && " Na primeira vez, entraremos com sua conta de educador."}
              </p>

              <div className="mb-4">
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") verifyTeacherPassword();
                  }}
                  placeholder="••••••••"
                  autoFocus
                  className="w-3/4 text-center text-3xl font-bold py-2.5 px-4 rounded-2xl border-3 border-[#8a2be2] focus:outline-none focus:ring-4 focus:ring-purple-200 bg-white"
                />
                {authError && (
                  <div className="text-red-500 font-bold text-sm mt-2">
                    🔒 Senha incorreta! Tente novamente.
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowTeacherAuthModal(false)}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-5 py-2.5 rounded-full transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={verifyTeacherPassword}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-full shadow-md shadow-purple-200 transition"
                >
                  Entrar 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== MODAL DE LIMPEZA DE DADOS ==================== */}
        {showClearDataModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fffaf5] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-orange-100 text-center animate-in zoom-in-95 duration-200">
              <div className="text-6xl mb-2">🎒</div>
              <h3 className="text-2xl font-bold font-['Fredoka'] text-[#ff3385] mb-2">
                Reiniciar Diário de Bordo?
              </h3>

              <div className="bg-white p-4 rounded-2xl shadow-xs border border-orange-100 text-left mb-6">
                <p className="font-bold text-gray-800 text-sm mb-1">
                  🗺️ <strong>Atenção, Educador!</strong>
                </p>
                <p className="text-gray-600 text-xs leading-relaxed mb-2">
                  Você está prestes a apagar todos os registros de navegação e as pegadas de aprendizagem dos pequenos exploradores.
                </p>
                <hr className="my-2 border-gray-200" />
                <p className="text-red-600 text-xs font-bold">
                  ⚠️ Todos os acertos, tempo por nível e o histórico de progresso serão apagados.
                </p>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowClearDataModal(false)}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold px-5 py-2 rounded-full text-sm transition"
                >
                  Guardar Registros 📁
                </button>
                <button
                  onClick={confirmClearTeacherData}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-full text-sm shadow-md shadow-red-200 transition"
                >
                  Recomeçar Jornada 🧹
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
