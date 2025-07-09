class Agent {
	constructor(
		model,
		gamma = 0.99,
		epsilon = 1.0,
		epsilonDecay = 0.999,
		minEpsilon = 0.1,
	) {
		this.model = model;
		this.gamma = gamma;
		this.epsilon = epsilon;
		this.epsilonDecay = epsilonDecay;
		this.minEpsilon = minEpsilon;
	}

	act(state) {
		if (Math.random() < this.epsilon) {
			return Math.floor(Math.random() * 4);
		}

		const qValues = this.model.forward(state);
		return qValues.indexOf(Math.max(...qValues));
	}

	// train(batch) {
	// 	for (const { state, action, reward, nextState, done } of batch) {
	// 		const nextQ = this.model.forward(nextState);
	// 		const targetQ = reward + this.gamma * done ? 0 : Math.max(...nextQ);
	// 		this.model.train(state, action, targetQ);
	// 	}
	//
	// 	this.epsilon = Math.max(
	// 		this.minEpsilon,
	// 		this.epsilon * this.epsilonDecay,
	// 	);
	// }

	train(batch) {
		let totalLoss = 0;

		for (const { state, action, reward, nextState, done } of batch) {
			const currentQ = this.model.forward(state);

			const nextQ = this.model.forward(nextState);
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

		console.log(totalLoss / batch.length);
	}
}
