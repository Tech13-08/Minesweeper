class Game {
  constructor(width, height, w) {
    this.cols = floor(width / w);
    this.rows = floor(height / w);
    this.grid = this.make2DArray(this.cols, this.rows);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j] = new Cell(i, j, w);
      }
    }
    this.totalMines = floor(0.125 * (this.cols * this.rows));
    this.minesSet = false;
    this.running = true;
    this.won = false;
    this.revealedCells = 0;
    this.flagsPlaced = 0;
    this.charTileImages = [nijikaTile, ryoTile, kitaTile, bocchiTile];
    this.dialogueState = "idle";
    this.currentDialogue = "";
    this.currentImage = "bocchiIdle";
    this.imageTime = 0;
    this.idleDialogue = [
      "I wonder if I can clear this minefield...",
      "Let's do our best!",
      "Minesweeper is all about strategy, right?",
      "I hope I don't mess this up...",
    ];
    this.nervousDialogue = [
      "Eep! That was close!",
      "My heart's racing...",
      "I'm not sure about this one...",
      "Deep breaths, deep breaths...",
    ];
    this.defeatedDialogue = [
      "Oh no! I hit a mine!",
      "I guess I'm not cut out for this...",
      "That didn't go well at all...",
      "Maybe next time...",
    ];
    this.victoryDialogue = [
      "We did it! We cleared the minefield!",
      "I can't believe I actually won!",
      "That was nerve-wracking, but fun!",
      "Victory feels amazing!",
    ];
  }

  make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  setMines(mouseI, mouseJ) {
    this.removeFlags();
    let options = [];
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        options.push([i, j]);
      }
    }
    for (let xoff = -1; xoff <= 1; xoff++) {
      let i = mouseI + xoff;
      if (i < 0 || i >= this.cols) continue;
      for (let yoff = -1; yoff <= 1; yoff++) {
        let j = mouseJ + yoff;
        if (j < 0 || j >= this.rows) continue;
        options.splice(
          options.findIndex((option) => option[0] === i && option[1] === j),
          1
        );
      }
    }
    for (let n = 0; n < this.totalMines; n++) {
      let index = floor(random(options.length));
      let choice = options[index];
      let i = choice[0];
      let j = choice[1];
      options.splice(index, 1);
      this.grid[i][j].mine = true;
    }
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.countMines(i, j);
      }
    }
    this.minesSet = true;
  }

  countMines(i, j) {
    let cell = this.grid[i][j];
    if (cell.mine) {
      cell.neighborCount = -1;
      return;
    }
    let total = 0;
    for (var xoff = -1; xoff <= 1; xoff++) {
      let neighborI = i + xoff;
      if (neighborI < 0 || neighborI >= this.cols) continue;
      for (let yoff = -1; yoff <= 1; yoff++) {
        let neighborJ = j + yoff;
        if (neighborJ < 0 || neighborJ >= this.rows) continue;
        let neighbor = this.grid[neighborI][neighborJ];
        if (neighbor.mine) total++;
      }
    }
    cell.neighborCount = total;
  }

  cellClick(mouseCoord, mouseBtn) {
    if (this.running) {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          let cell = this.grid[i][j];
          if (
            mouseBtn != RIGHT &&
            mouseBtn != CENTER &&
            cell.contains(mouseCoord[0], mouseCoord[1])
          ) {
            if (flagMode) {
              cell.toggleFlag();
              if (cell.flagged) this.flagsPlaced++;
              else this.flagsPlaced--;
              this.updateDialogue("nervous");
              continue;
            }
            if (cell.flagged) {
              continue;
            }
            if (!this.minesSet) this.setMines(i, j);
            this.reveal(i, j);
            if (cell.mine) {
              this.gameOver();
              this.updateDialogue("defeated");
            } else {
              this.updateDialogue("nervous");
            }
            if (this.revealedCells == this.cols * this.rows - this.totalMines) {
              this.gameWon();
              this.updateDialogue("victory");
            }
          }
        }
      }
    }
  }

  updateDialogue(state) {
    this.imageTime = 0;
    this.dialogueState = state;
    let dialogueArray;
    switch (state) {
      case "idle":
        dialogueArray = this.idleDialogue;
        this.currentImage = "bocchiIdle";
        break;
      case "nervous":
        dialogueArray = this.nervousDialogue;
        this.currentImage = "bocchiNervous";
        break;
      case "defeated":
        dialogueArray = this.defeatedDialogue;
        this.currentImage = "bocchiLost";
        break;
      case "victory":
        dialogueArray = this.victoryDialogue;
        this.currentImage = "bocchiWin";
        break;
    }
    this.currentDialogue =
      dialogueArray[Math.floor(Math.random() * dialogueArray.length)];
    this.updateDialogueUI();
  }

  updateDialogueUI() {
    document.getElementById(
      "character-image"
    ).src = `Assets/Images/${this.currentImage}.png`;
    document.getElementById("dialogue-text").innerText = this.currentDialogue;
  }

  render() {
    background(255);
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.show(i, j);
      }
    }
  }

  show(i, j) {
    let cell = this.grid[i][j];
    stroke(0);
    image(unrevealedTile, cell.x, cell.y, cell.w, cell.w);

    if (cell.flagged) {
      image(flagTile, cell.x, cell.y, cell.w, cell.w);
    } else if (cell.revealed) {
      if (cell.mine) {
        image(mineTile, cell.x, cell.y, cell.w, cell.w);
      } else {
        cell.image =
          cell.image == unrevealedTile
            ? this.charTileImages[
                Math.floor(Math.random() * this.charTileImages.length)
              ]
            : cell.image;

        image(cell.image, cell.x, cell.y, cell.w, cell.w);
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(cell.w * 0.5);
        text(
          cell.neighborCount > 0 ? cell.neighborCount : "",
          cell.x + cell.w * 0.5,
          cell.y + cell.w * 0.5
        );
      }
    }
  }

  reveal(i, j) {
    let cell = this.grid[i][j];
    if (!cell.flagged) {
      cell.revealed = true;
      this.revealedCells++;
      if (cell.neighborCount == 0) this.revealNeighbors(i, j);
    }
  }

  revealNeighbors(i, j) {
    for (let xoff = -1; xoff <= 1; xoff++) {
      let neighborI = i + xoff;
      if (neighborI < 0 || neighborI >= this.cols) continue;
      for (let yoff = -1; yoff <= 1; yoff++) {
        let neighborJ = j + yoff;
        if (neighborJ < 0 || neighborJ >= this.rows) continue;
        let neighbor = this.grid[neighborI][neighborJ];
        if (!neighbor.revealed) this.reveal(neighborI, neighborJ);
      }
    }
  }

  gameOver() {
    this.running = false;
    document.getElementById("game-feedback").innerText = "Game Over!";
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].revealed = true;
        this.grid[i][j].flagged = false;
      }
    }
  }

  gameWon() {
    this.running = false;
    document.getElementById("game-feedback").innerText = "You Win!";
    this.removeFlags();
  }

  removeFlags() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].flagged = false;
      }
    }
  }
}
