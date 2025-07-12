class Agent {
	constructor(
		model,
		gamma = 0.99,
		epsilon = 1.0,
		epsilonDecay = 0.999,
		minEpsilon = 0.1,
	) {
		this.model = model;
		this.targetModel = model.clone();
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
		let totalLoss = 0;

		for (const { state, action, reward, nextState, done } of batch) {
			const currentQ = this.model.forward(state);

			const nextQ = this.targetModel.forward(nextState);
			const targetQ =
				reward + (done ? 0 : this.gamma * Math.max(...nextQ));

			const clippedTargetQ = Math.max(-10, Math.min(10, targetQ));

			this.model.train(currentQ, clippedTargetQ, action);

			const error = currentQ[action] - clippedTargetQ;
			totalLoss += error ** 2;
		}

		this.epsilon = Math.max(
			this.minEpsilon,
			this.epsilon * this.epsilonDecay,
		);

		this.steps++;
		if (this.steps % this.targetUpdateFreq === 0) {
			this.targetModel = this.model.clone();
		}

		// console.log(totalLoss / batch.length);
	}

	save() {
		return this.model.save();
	}

	load(data) {
		this.model.load(data);
		this.targetModel = this.model.clone();
	}
}
