let game;
let cellSize = 40;

function setup() {
  let canvas = createCanvas(401, 401);
  canvas.parent("canvas-container");

  // Setup initial game
  game = new Game(width, height, cellSize);
  updateGameInfo();

  // Event listener for difficulty change
  document.getElementById("difficulty").addEventListener("change", (e) => {
    cellSize = parseInt(e.target.value);
    restartGame();
  });

  // Event listener for restart button
  document
    .getElementById("restart-button")
    .addEventListener("click", restartGame);
}

function restartGame() {
  game = new Game(width, height, cellSize);
  document.getElementById("game-feedback").innerText = "";
  updateGameInfo();
}

function updateGameInfo() {
  document.getElementById("total-mines").innerText = game.totalMines;
  document.getElementById("flags-placed").innerText = 0;
}

function mousePressed() {
  game.cellClick([mouseX, mouseY], mouseButton);
}

function draw() {
  game.render();
  document.getElementById("flags-placed").innerText = game.flagsPlaced;
}
