const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const restartBtn = document.getElementById("restart-btn");


let dimension = 150;
let imgStart = Math.floor(Math.random() * 100) + 1;

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;
let seconds = 0;
let timerInterval = null;



let images = [];
for (let i = imgStart; i < imgStart + 7; i++) {
  images.push(`https://picsum.photos/id/${i}/${dimension}/${dimension}}`);
}

let cards = [...images, ...images];


function shuffle(array){
    for (let i = array.lenght -1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function initGame() {
  board.innerHTML = "";
  resultDisplay.textContent = "";
  moves = 0;
  matchedCount = 0;
  seconds = 0;
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  movesDisplay.textContent = `Coups : ${moves}`;
  timerDisplay.textContent = `Temps : 00:00`;

  shuffle(cards);

  cards.forEach((imgUrl) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.dataset.value = imgUrl; // On cache l'URL de l'image dans la carte
    board.appendChild(card);

    // Quand on clique, on appelle la fonction de gestion du clic
    card.addEventListener("click", () => handleCardClick(card));
  });

  clearInterval(timerInterval);
  startTimer();
}

function handleCardClick(card) {
  if (lockBoard || card.classList.contains("matched") || card === firstCard || card.firstChild) {
    return; 
  }

  revealCard(card);
  if (!firstCard) {
    firstCard = card; 
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  movesDisplay.textContent = `Coups : ${moves}`;

  checkMatch();
}

function revealCard(card) {
  const img = document.createElement("img");
  img.src = card.dataset.value;
  img.alt = "Image de mémoire";
  card.appendChild(img);
}