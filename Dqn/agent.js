class Agent {
	constructor(
		gamma = 0.99,
		epsilon = 1.0,
		epsilonDecay = 0.999,
		minEpsilon = 0.1,
	) {
		this.model = new Model([
			new Dense(14, 32),
			new Relu(),
			new Dense(32, 16),
			new Relu(),
			new Dense(16, 3),
		]);
		this.targetModel = this.model.clone();
		this.targetUpdateFreq = 100;
		this.steps = 0;
		this.gamma = gamma;
		this.epsilon = epsilon;
		this.epsilonDecay = epsilonDecay;
		this.minEpsilon = minEpsilon;
	}

	act(state, isEval = false) {
		if (Math.random() < this.epsilon && !isEval) {
			return Math.floor(Math.random() * 3);
		}

		const qValues = this.model.forward(state);
		return qValues.indexOf(Math.max(...qValues));
	}

	train(batch) {
		for (const { state, action, reward, nextState, done } of batch) {
			const currentQ = this.model.forward(state);

			const nextQ = this.targetModel.forward(nextState);
			const targetQ =
				reward + (done ? 0 : this.gamma * Math.max(...nextQ));

			const clippedTargetQ = Math.max(-10, Math.min(10, targetQ));

			this.model.train(currentQ, clippedTargetQ, action);
		}

		this.epsilon = Math.max(
			this.minEpsilon,
			this.epsilon * this.epsilonDecay,
		);

		this.steps++;
		if (this.steps % this.targetUpdateFreq === 0) {
			this.targetModel = this.model.clone();
		}
	}

	save() {
		return this.model.save();
	}

	load(data) {
		this.model.load(data);
		this.targetModel = this.model.clone();
	}
}
