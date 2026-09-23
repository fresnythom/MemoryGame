const board = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const resultDisplay = document.getElementById("result");
const restartBtn = document.getElementById("restart-btn");


const dimension = 150;
const imgStart = Math.floor(Math.random() * 100) + 1;

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