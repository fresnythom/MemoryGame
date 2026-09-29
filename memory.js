
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


const images = [];
for (let i = imgStart; i <= imgStart + 7; i++) {
  images.push(`https://picsum.photos/seed/${i}/${dimension}/${dimension}`);
}
cards = [...images, ...images];

// 4. Le mélange des cartes (Fisher-Yates)
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // On échange les deux places
  }
}


/

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
    card.dataset.value = imgUrl; 

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

  revealCard(card); // Tout est bon, on affiche l'image de la carte

  if (!firstCard) {
    firstCard = card; // C'est la première carte du tour
    return;
  }

  secondCard = card;
  lockBoard = true; // On bloque le plateau le temps de vérifier
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


function checkMatch() {
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedCount += 2;
    resetTurn();
    checkVictory();
  } else {
    // On attend 0.8 seconde avant de cacher les images
    setTimeout(() => {
      firstCard.innerHTML = "";
      secondCard.innerHTML = "";
      resetTurn(); // On débloque le plateau pour le coup suivant
    }, 800);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function checkVictory() {
  if (matchedCount === cards.length) {
    stopTimer();
    resultDisplay.textContent = `🎉 Victoire ! Coups : ${moves} | Temps : ${formatTime(seconds)}`;
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Temps : ${formatTime(seconds)}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(sec) {
  const min = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${min}:${s}`;
}


restartBtn.addEventListener("click", initGame);
initGame();