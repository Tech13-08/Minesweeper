let game;
let cellSize = 40;
let flagMode = false;
let imgTile;
let nijikaTile;
let kitaTile;
let ryoTile;
let bocchiTile;
let unrevealedTile;
let flagTile;
let mineTile;

function preload() {
  imgTile = loadImage("assets/images/kessoku.png");
  nijikaTile = loadImage("assets/images/nijikaTile.png");
  kitaTile = loadImage("assets/images/kitaTile.png");
  ryoTile = loadImage("assets/images/ryoTile.png");
  bocchiTile = loadImage("assets/images/bocchiTile.png");
  unrevealedTile = loadImage("assets/images/unrevealedTile.png");
  flagTile = loadImage("assets/images/flagTile.png");
  mineTile = loadImage("assets/images/mineTile.png");
}
function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas-container");

  game = new Game(width, height, cellSize);
  updateGameInfo();

  document.getElementById("difficulty").addEventListener("change", (e) => {
    cellSize = parseInt(e.target.value);
    restartGame();
  });

  document
    .getElementById("flag-button")
    .addEventListener("mouseenter", function () {
      document.getElementById("flag-button").querySelector("img").style.filter =
        "brightness(0.7)";
    });

  document
    .getElementById("flag-button")
    .addEventListener("mouseleave", function () {
      document.getElementById("flag-button").querySelector("img").style.filter =
        flagMode ? "brightness(0.7)" : "brightness(1)";
    });
  document.getElementById("flag-button").addEventListener("click", function () {
    flagMode = !flagMode;
    document.getElementById("flag-button").querySelector("img").style.filter =
      flagMode ? "brightness(0.7)" : "brightness(1)";
  });

  document
    .getElementById("restart-button")
    .addEventListener("click", restartGame);

  setInterval(() => {
    if (game.imageTime > 0 && game.running) {
      game.dialogueState = "idle";
      game.updateDialogue("idle");
    }
    game.imageTime += 1;
  }, 3000);
}

function restartGame() {
  game = new Game(width, height, cellSize);
  document.getElementById("game-feedback").innerText = "";
  game.updateDialogue("idle");
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
