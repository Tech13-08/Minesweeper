class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.mine = false;
    this.flagged = false;
    this.revealed = false;
    this.neighborCount = 0;
    this.image = unrevealedTile;
  }

  contains(x, y) {
    return (
      x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w
    );
  }

  toggleFlag() {
    if (!this.revealed) {
      this.flagged = !this.flagged;
    }
  }
}
