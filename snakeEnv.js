class SnakeEnv {
	constructor(p) {
		this.game = new GameManager(p);
		this.rlMode = "eval";
		this.episodeCount = 0;
		this.initialize();
	}

	initialize() {
		const model = new Model([
			new Dense(14, 32),
			new Relu(),
			new Dense(32, 16),
			new Relu(),
			new Dense(16, 3),
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

		const state = this.getReducedState();
		const reward = this.getReward();
		const done = this.game.gameOver;

		return { state, reward, done };
	}

	setDirection(action) {
		this.game.setDirection(action);
	}

	getAbsDirFromRelative(relativeAction) {
		const turnLeft = [2, 3, 1, 0];
		const turnRight = [3, 2, 0, 1];

		let newDirIndex = this.game.directionIndex;

		if (relativeAction === 1) {
			newDirIndex = turnLeft[this.game.directionIndex];
		} else if (relativeAction === 2) {
			newDirIndex = turnRight[this.game.directionIndex];
		}

		return newDirIndex;
	}

	getReward() {
		if (this.game.gameOver) return -1;
		else if (this.game.justAteFood) return 1;
		else return -0.005;
	}

	draw() {
		if (this.rlMode == "eval") {
			if (this.game.started) {
				const currentstate = this.getReducedState();
				const relativeAction = this.agent.act(currentstate, true);
				const absAction = this.getAbsDirFromRelative(relativeAction);
				this.setDirection(absAction);
			}
		} else {
			this.train();
		}

		this.game.draw();
	}

	train() {
		const currentState = this.getReducedState();
		const relativeAction = this.agent.act(currentState);
		const absAction = this.getAbsDirFromRelative(relativeAction);
		const { state: nextState, reward, done } = this.step(absAction);

		this.replayBuffer.push({
			state: currentState,
			action: relativeAction,
			reward,
			nextState: nextState,
			done,
		});

		if (this.replayBuffer.size() > 64) {
			const batch = this.replayBuffer.sample(64);
			this.agent.train(batch);
		}

		if (done) {
			for (let i = 0; i < 5; i++) {
				const batch = this.replayBuffer.sample(64);
				this.agent.train(batch);
			}
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

	getEpisodeCount() {
		return this.episodeCount;
	}

	getReducedState() {
		return StateExtractor.getReducedState(this.game);
	}
}
