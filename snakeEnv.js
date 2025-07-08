class SnakeEnv {
	constructor(p) {
		this.p = p;
		this.game = new GameManager(p);
		this.actionSpace = [0, 1, 2, 3];
		this.simSpeed = 10;
		this.rlMode = "eval";
		this.attachEvents();
		this.lastStepTime = 0;
		this.episodeCount = 0;
		this.initialize();
	}

	initialize() {
		const model = new Model([
			new Dense(this.game.gridSize * this.game.gridSize, 64),
			new Relu(),
			new Dense(64, 32),
			new Relu(),
			new Dense(32, 4),
		]);
		this.agent = new Agent(model);
		this.replayBuffer = new ReplayBuffer();
	}

	reset() {
		this.game.initialize();
		return this.getState();
	}

	step(action) {
		this.setDirection(action);
		this.game.update();

		const state = this.getState();
		const reward = this.getReward();
		const done = this.game.gameOver;

		return { state, reward, done };
	}

	setDirection(action) {
		const directions = [
			[0, -1], // up
			[0, 1], // down
			[-1, 0], // left
			[1, 0], // right
		];

		const [dx, dy] = directions[action];
		this.game.setDirection(dx, dy);
	}

	getState() {
		return this.game.grid.map((row) => row.slice());
	}

	// getReward() {
	// 	if (this.game.gameOver) return -10;
	// 	else if (this.game.justAteFood) return 10;
	// 	else return -0.1;
	// }
	//
	getReward() {
		const head = this.game.snake[this.game.snake.length - 1];
		const food = this.game.foodPosition;

		const dist = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
		const delta =
			this.prevDistance !== undefined ? this.prevDistance - dist : 0;
		this.prevDistance = dist;

		const clippedDelta = Math.max(-1, Math.min(1, delta));

		if (this.game.gameOver) return -10;
		else if (this.game.justAteFood) return 10;
		else return -0.01 + 0.05 * clippedDelta;
	}

	draw() {
		if (this.rlMode == "eval") {
			if (this.game.started) {
				const action = Math.floor(Math.random() * 4);
				this.setDirection(action);
			}
		} else {
			this.train();
		}

		this.game.draw();
	}

	train() {
		const currentState = this.getState();
		const action = this.agent.act(currentState.flat());
		const { state: nextState, reward, done } = this.step(action);

		this.replayBuffer.push({
			state: currentState.flat(),
			action,
			reward,
			nextState: nextState.flat(),
			done,
		});

		if (done) {
			for (let i = 0; i < 5; i++) {
				const batch = this.replayBuffer.sample(32);
				this.agent.train(batch);
			}
			this.episodeCount++;
			this.updateEpisode();
			this.reset();
		}
	}

	startGame() {
		if (this.game.started) return;
		const action = Math.floor(Math.random() * 4);
		this.setDirection(action);
	}

	attachEvents() {
		document.getElementById("mode-toggle").onclick = () => {
			rlMode = this.rlMode === "train" ? "eval" : "train";
			document.getElementById("mode-toggle").innerText =
				`Mode: ${rlMode.charAt(0).toUpperCase() + rlMode.slice(1)}`;

			const inTrainMode = rlMode === "train";
			document.getElementById("speed-slider").disabled = !inTrainMode;
			document.getElementById("speed-label").style.color = inTrainMode
				? "black"
				: "lightgray";
			this.rlMode = rlMode;
			this.reset();
		};

		document.getElementById("speed-slider").oninput = (e) => {
			this.simSpeed = parseInt(e.target.value);
		};
	}

	updateEpisode() {
		document.getElementById("episode-counter").innerText =
			this.episodeCount;
	}
}
