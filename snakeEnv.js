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

	// getReward() {
	// 	if (this.game.gameOver) return -10;
	// 	else if (this.game.justAteFood) return 10;
	// 	else return 0;
	// }

	getReward() {
		if (this.game.gameOver) return -10;
		else if (this.game.justAteFood) return 10;
		else return -0.01;
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
