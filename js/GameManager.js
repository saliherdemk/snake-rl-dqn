class GameManager {
	constructor(p) {
		this.p = p;
		this.gridSize = 20;
		this.directions = [
			[0, -1], // up
			[0, 1], // down
			[-1, 0], // left
			[1, 0], // right
		];
		this.initialize();
	}

	initialize() {
		this.grid = Array.from({ length: this.gridSize }, () =>
			Array(this.gridSize).fill(0),
		);
		this.gameOver = false;
		this.started = false;
		this.moveInterval = 100;
		this.lastMoveTime = 0;

		let snakePos = this.getRandomCell();
		this.snake = [snakePos];
		this.grid[snakePos.x][snakePos.y] = 1;
		this.direction = { x: 1, y: 0 };
		this.directionChanged = false;
		this.directionIndex = 3;
		this.placeFood();
	}

	draw() {
		if (this.gameOver) return this.displayGameOver();
		this.displayGrid();
		if (
			this.started &&
			this.p.millis() - this.lastMoveTime > this.moveInterval
		) {
			this.update();
			this.lastMoveTime = this.p.millis();
		}
		if (!this.started) this.displayInstructions();
	}

	update() {
		this.clearGrid();
		const snake = this.snake;
		const head = snake[snake.length - 1];
		const newHead = {
			x: head.x + this.direction.x,
			y: head.y + this.direction.y,
		};

		if (this.checkGameOver(newHead)) return (this.gameOver = true);

		snake.push(newHead);
		if (
			newHead.x === this.foodPosition.x &&
			newHead.y === this.foodPosition.y
		) {
			this.justAteFood = true;
			this.moveInterval = Math.max(this.moveInterval - 5, 40);
		} else {
			this.justAteFood = false;
			snake.shift();
		}

		for (let s of snake) this.grid[s.x][s.y] = 1;
		if (this.justAteFood) this.placeFood();
		this.directionChanged = false;
	}

	checkGameOver(newHead) {
		if (
			newHead.x < 0 ||
			newHead.x >= this.gridSize ||
			newHead.y < 0 ||
			newHead.y >= this.gridSize
		)
			return true;

		for (let s of this.snake) {
			if (s.x === newHead.x && s.y === newHead.y) return true;
		}
		return false;
	}

	clearGrid() {
		for (let x = 0; x < this.gridSize; x++) {
			for (let y = 0; y < this.gridSize; y++) {
				if (this.grid[x][y] === 1) this.grid[x][y] = 0;
			}
		}
	}

	setDirection(actionIndex) {
		const [x, y] = this.directions[actionIndex];
		if (
			!this.directionChanged &&
			!(x === -this.direction.x && y === -this.direction.y)
		) {
			this.direction = { x, y };
			this.directionIndex = actionIndex;
			this.directionChanged = true;
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
		while (this.grid[x][y] !== 0) ({ x, y } = this.getRandomCell());
		this.grid[x][y] = 2;
		this.foodPosition = { x, y };
	}

	displayGameOver() {
		let p = this.p;
		p.fill(255, 0, 0);
		p.textAlign(p.CENTER, p.CENTER);
		p.textSize(32);
		p.text("GAME OVER", p.width / 2, p.height / 4);
		p.text(
			"Your Score: " + this.snake.length,
			p.width / 2,
			p.height / 2 + 50,
		);
	}

	displayGrid() {
		let p = this.p;
		let s = p.width / this.gridSize;
		for (let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[0].length; y++) {
				p.fill(
					this.grid[x][y] === 2
						? [255, 0, 0]
						: this.grid[x][y] === 1
							? [255, 255, 0]
							: 0,
				);
				p.rect(x * s, y * s, s, s);
			}
		}
	}

	displayInstructions() {
		let p = this.p;
		p.fill(255);
		p.textSize(18);
		p.textAlign(p.CENTER, p.CENTER);
		p.text("Press an arrow key to start", p.width / 2, p.height / 2);
	}
}
