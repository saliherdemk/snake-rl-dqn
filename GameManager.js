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
		}
	}

	start() {
		if (this.started) return;
		this.started = true;
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

	displayGrid() {
		let p = this.p;
		let s = p.width / this.gridSize;
		for (let x = 0; x < this.grid.length; x++) {
			for (let y = 0; y < this.grid[0].length; y++) {
				const val = this.grid[x][y];
				if (val == 2) {
					p.fill("#ff00c8");
				} else if (val == 1) {
					p.fill("#1de9b6");
				} else {
					p.fill("#0b0f2e");
				}

				p.rect(x * s, y * s, s, s);
			}
		}
	}

	displayGameOver() {
		let p = this.p;

		p.push();
		p.noStroke();
		p.fill(11, 15, 46, 200);
		p.rect(0, 0, p.width, p.height);
		p.pop();

		p.push();
		p.textAlign(p.CENTER, p.CENTER);
		p.textSize(48);
		p.fill("#ff1744");
		p.stroke("#ff1744");
		p.strokeWeight(2);

		p.drawingContext.shadowBlur = 25;
		p.drawingContext.shadowColor = "#ff1744";
		p.text("GAME OVER", p.width / 2, p.height / 3);
		p.pop();

		p.push();
		p.textAlign(p.CENTER, p.CENTER);
		p.textSize(24);
		p.fill("#00f0ff");
		p.noStroke();
		p.drawingContext.shadowBlur = 10;
		p.drawingContext.shadowColor = "#00f0ff";
		p.text("Your Score: " + this.getScore(), p.width / 2, p.height / 2);
		p.pop();

		p.push();
		p.textAlign(p.CENTER, p.CENTER);
		p.textSize(18);
		p.fill("rgba(255, 255, 255, 0.6)");
		p.noStroke();
		p.text("Press R to restart", p.width / 2, p.height / 2 + 40);
		p.pop();
	}

	getScore() {
		return this.snake.length;
	}
}
