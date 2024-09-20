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
  }

  make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  setMines(mouseI, mouseJ) {
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
            cell.contains(mouseCoord[0], mouseCoord[1])
          ) {
            if (mouseBtn == CENTER) {
              cell.toggleFlag();
              if (cell.flagged) this.flagsPlaced++;
              else this.flagsPlaced--;
              continue;
            }
            if (!this.minesSet) this.setMines(i, j);
            this.reveal(i, j);
            if (cell.mine) this.gameOver();
            if (this.revealedCells == this.cols * this.rows - this.totalMines)
              this.gameWon();
          }
        }
      }
    }
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
    noFill();
    rect(cell.x, cell.y, cell.w, cell.w); // Draw the cell

    if (cell.flagged) {
      fill(127); // Color for flagged cells
      rect(cell.x, cell.y, cell.w, cell.w);
    } else if (cell.revealed) {
      if (cell.mine) {
        fill(255, 0, 0); // Red color for mines
        ellipse(cell.x + cell.w * 0.5, cell.y + cell.w * 0.5, cell.w * 0.5); // Draw a circle for mines
      } else {
        fill(200); // Revealed cell background
        rect(cell.x, cell.y, cell.w, cell.w);

        if (cell.neighborCount > 0) {
          textAlign(CENTER, CENTER);
          fill(0); // Black text for the numbers
          textSize(cell.w * 0.5); // Set text size proportional to the cell size (50% of cell size)
          text(
            cell.neighborCount,
            cell.x + cell.w * 0.5, // Center horizontally
            cell.y + cell.w * 0.5 // Center vertically
          );
        }
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
    this.revealAll();
  }

  gameWon() {
    this.running = false;
    document.getElementById("game-feedback").innerText = "You Win!";
  }

  revealAll() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this.grid[i][j].revealed = true;
        this.grid[i][j].flagged = false;
      }
    }
  }
}
