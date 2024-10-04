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
let bocchiIdle, bocchiNervous, bocchiLost, bocchiWin;

// Helper function to get the correct path for assets
function getAssetPath(filename) {
  // Check if we're running on GitHub Pages
  const isGitHubPages = window.location.hostname.includes("github.io");
  // If on GitHub Pages, include the repository name in the path
  // Replace 'your-repo-name' with your actual repository name
  const repoPath = isGitHubPages ? "/your-repo-name" : "";
  return `${repoPath}/assets/images/${filename}`;
}

function preload() {
  imgTile = loadImage(getAssetPath("kessoku.png"));
  nijikaTile = loadImage(getAssetPath("nijikaTile.png"));
  kitaTile = loadImage(getAssetPath("kitaTile.png"));
  ryoTile = loadImage(getAssetPath("ryoTile.png"));
  bocchiTile = loadImage(getAssetPath("bocchiTile.png"));
  unrevealedTile = loadImage(getAssetPath("unrevealedTile.png"));
  flagTile = loadImage(getAssetPath("flagTile.png"));
  mineTile = loadImage(getAssetPath("mineTile.png"));
  bocchiIdle = loadImage(getAssetPath("bocchiIdle.png"));
  bocchiNervous = loadImage(getAssetPath("bocchiNervous.png"));
  bocchiLost = loadImage(getAssetPath("bocchiLost.png"));
  bocchiWin = loadImage(getAssetPath("bocchiWin.png"));
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
