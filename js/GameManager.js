class GameManager {
	constructor(p) {
		this.p = p;
		this.gridSize = 10;
		this.grid;
		this.moveInterval;
		this.lastMoveTime;
		this.foodPosition;
		this.gameOver;
		this.started;
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
		this.directionIndex = 3;
		this.placeFood();
	}

	draw() {
		if (this.gameOver) {
			this.displayGameOver();
			return;
		}

		this.displayGrid();

		let isStarted = this.started;
		if (
			isStarted &&
			this.p.millis() - this.lastMoveTime > this.moveInterval
		) {
			this.update();
			this.lastMoveTime = this.p.millis();
		}

		if (!isStarted) this.displayInstructions();
	}

	update() {
		this.clearGrid();

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
			this.justAteFood = true;
			this.moveInterval = Math.max(this.moveInterval - 5, 40);
		} else {
			this.justAteFood = false;
			this.snake.shift();
		}

		for (let segment of this.snake) {
			this.grid[segment.x][segment.y] = 1;
		}

		if (this.justAteFood) this.placeFood();
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

	getReducedState() {
		// Adopted from https://github.com/vedantgoswami/SnakeGameAI/blob/main/agent.py
		const head = this.snake[this.snake.length - 1];
		const dirIndex = this.directionIndex;

		const dir_up = this.directionIndex == 0 ? 1 : 0;
		const dir_down = this.directionIndex == 1 ? 1 : 0;
		const dir_left = this.directionIndex == 2 ? 1 : 0;
		const dir_right = this.directionIndex == 3 ? 1 : 0;

		const turnLeft = [2, 3, 1, 0];
		const turnRight = [3, 2, 0, 1];

		const leftIndex = turnLeft[dirIndex];
		const rightIndex = turnRight[dirIndex];

		const danger_straight = this.is_collision(head, dirIndex) ? 1 : 0;
		const danger_left = this.is_collision(head, leftIndex) ? 1 : 0;
		const danger_right = this.is_collision(head, rightIndex) ? 1 : 0;

		const foodOnLeft = this.foodPosition.x < head.x;
		const foodOnRight = this.foodPosition.x > head.x;
		const foodOnUp = this.foodPosition.y < head.y;
		const foodOnDown = this.foodPosition.y > head.y;

		return [
			dir_up,
			dir_down,
			dir_left,
			dir_right,
			danger_straight,
			danger_left,
			danger_right,
			foodOnLeft,
			foodOnRight,
			foodOnUp,
			foodOnDown,
		];
	}

	is_collision(head, direction) {
		const newDirection = this.directions[direction];
		const newHead = {
			x: head.x + newDirection.x,
			y: head.y + newDirection.y,
		};
		return this.checkGameOver(newHead);
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

	setDirection(action) {
		const [x, y] = this.directions[action];
		if (!(x === -this.direction.x && y === -this.direction.y)) {
			this.direction = { x, y };
			this.directionIndex = action;
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
		var cellSize = p.width / this.gridSize;
		var grid = this.grid;
		for (let w = 0; w < grid.length; w++) {
			for (let h = 0; h < grid[0].length; h++) {
				let val = grid[w][h];
				if (val == 2) {
					p.fill(255, 0, 0);
				} else if (val == 1) {
					p.fill(255, 255, 0);
				} else {
					p.fill(0);
				}
				p.rect(w * cellSize, h * cellSize, cellSize, cellSize);
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
