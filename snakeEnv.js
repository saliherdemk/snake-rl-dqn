class SnakeEnv {
	constructor(p) {
		this.p = p;
		this.game = new GameManager(p);
		this.actionSpace = [0, 1, 2, 3];
		this.rlMode = "eval";
		this.lastStepTime = 0;
		this.episodeCount = 0;
		this.initialize();
	}

	initialize() {
		const model = new Model([
			new Dense(11, 32),
			new Relu(),
			new Dense(32, 16),
			new Relu(),
			new Dense(16, 4),
		]);
		this.agent = new Agent(model);
		this.replayBuffer = new ReplayBuffer();
	}

	reset() {
		this.game.initialize();
	}

	step(action) {
		this.setDirection(action);
		this.game.update();

		const state = this.game.getReducedState();
		const reward = this.getReward();
		const done = this.game.gameOver;

		return { state, reward, done };
	}

	setDirection(action) {
		this.game.setDirection(action);
	}

	getReward() {
		if (this.game.gameOver) return -1;
		else if (this.game.justAteFood) return 1;
		else return -0.005;
	}

	// getReward() {
	// 	const game = this.game;
	// 	const head = game.snake[game.snake.length - 1];
	// 	const food = game.foodPosition;
	// 	const dist = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
	//
	// 	if (game.gameOver) return -2; // Less extreme penalty
	// 	if (game.justAteFood) return 1 + 1 / dist; // Distance bonus
	// 	if (game.starvationTimer > game.snake.length * 2) return -0.1; // Hunger penalty
	// 	return -0.001; // Tiny step penalty
	// }

	draw() {
		if (this.rlMode == "eval") {
			if (this.game.started) {
				const currentstate = this.game.getReducedState();
				const action = this.agent.act(currentstate, true);
				this.setDirection(action);
			}
		} else {
			this.train();
		}

		this.game.draw();
	}

	train() {
		const currentState = this.game.getReducedState();
		const action = this.agent.act(currentState);
		const { state: nextState, reward, done } = this.step(action);

		this.replayBuffer.push({
			state: currentState,
			action,
			reward,
			nextState: nextState,
			done,
		});

		if (this.replayBuffer.size() > 64) {
			const batch = this.replayBuffer.sample(64);
			this.agent.train(batch);
		}

		if (done) {
			// for (let i = 0; i < 5; i++) {
			// 	const batch = this.replayBuffer.sample(32);
			// 	this.agent.train(batch);
			// }
			this.episodeCount++;
			updateEpisodeLabel(this.episodeCount);
			this.reset();
		}
	}

	startGame() {
		if (this.game.started) return;
		const action = Math.floor(Math.random() * 4);
		this.setDirection(action);
	}

	toggleMode() {
		const rlMode = this.rlMode === "train" ? "eval" : "train";
		changeModeButtonText(
			`Mode: ${rlMode.charAt(0).toUpperCase() + rlMode.slice(1)}`,
		);
		this.rlMode = rlMode;
		this.reset();
	}
}
