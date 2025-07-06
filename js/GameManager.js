class GameManager {
  constructor() {
    this.gridSize = 20;
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0),
    );

    this.moveInterval = 100;
    this.lastMoveTime = 0;
    this.foodPosition;
    this.gameOver = false;
    this.started = false;
    this.initialize();
  }

  initialize() {
    let snakePos = this.getRandomCell();
    this.snake = [snakePos];
    this.grid[snakePos.x][snakePos.y] = 1;
    this.direction = { x: 1, y: 0 };
    this.placeFood();
  }

  restart() {
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0),
    );
    this.gameOver = false;
    this.started = false;
    this.lastMoveTime = 0;
    this.initialize();
  }

  draw() {
    if (this.gameOver) {
      fill(255, 0, 0);
      textAlign(CENTER, CENTER);
      textSize(32);
      text("GAME OVER", width / 2, height / 4);
      text("Your Score: " + this.snake.length, width / 2, height / 2 + 50);
      return;
    }

    var cellSize = width / this.gridSize;
    var grid = this.grid;
    for (let w = 0; w < grid.length; w++) {
      for (let h = 0; h < grid[0].length; h++) {
        let val = grid[w][h];
        if (val == 2) {
          fill(255, 0, 0);
        } else if (val == 1) {
          fill(0);
        } else {
          fill(255);
        }
        rect(w * cellSize, h * cellSize, cellSize, cellSize);
      }
    }

    if (this.started && millis() - this.lastMoveTime > this.moveInterval) {
      this.update();
      this.lastMoveTime = millis();
    }

    if (!this.started) {
      fill(0);
      textSize(18);
      textAlign(CENTER, CENTER);
      text("Press an arrow key to start", width / 2, height / 2);
    }
  }

  update() {
    const head = this.snake[this.snake.length - 1];
    const newHead = {
      x: head.x + this.direction.x,
      y: head.y + this.direction.y,
    };

    this.gameOver = this.checkGameOver(newHead);
    if (this.gameOver) return;
    this.snake.push(newHead);

    if (
      newHead.x === this.foodPosition.x &&
      newHead.y === this.foodPosition.y
    ) {
      this.placeFood();
      this.moveInterval = Math.max(this.moveInterval - 5, 40);
    } else {
      this.snake.shift();
    }

    this.clearGrid();

    for (let segment of this.snake) {
      this.grid[segment.x][segment.y] = 1;
    }
  }

  checkGameOver(newHead) {
    if (
      newHead.x < 0 ||
      newHead.x >= this.gridSize ||
      newHead.y < 0 ||
      newHead.y >= this.gridSize
    ) {
      return true;
    }

    for (let segment of this.snake) {
      if (segment.x === newHead.x && segment.y === newHead.y) {
        return true;
      }
    }
    return false;
  }

  clearGrid() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (this.grid[x][y] === 1) {
          this.grid[x][y] = 0;
        }
      }
    }
  }

  setDirection(x, y) {
    if (!(x === -this.direction.x && y === -this.direction.y)) {
      this.direction = { x, y };
      this.started = true;
    }
  }

  getRandomCell() {
    let x = Math.floor(Math.random() * this.gridSize);
    let y = Math.floor(Math.random() * this.gridSize);
    return { x, y };
  }

  placeFood() {
    let { x, y } = this.getRandomCell();

    while (this.grid[x][y] !== 0) {
      let cell = this.getRandomCell();
      x = cell.x;
      y = cell.y;
    }
    this.grid[x][y] = 2;
    this.foodPosition = { x, y };
  }
}
