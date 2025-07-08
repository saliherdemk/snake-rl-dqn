class Agent {
	constructor(
		model,
		gamma = 0.99,
		epsilon = 1.0,
		epsilonDecay = 0.995,
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
		let totalPredQ = 0;
		let totalTargetQ = 0;

		for (const { state, action, reward, nextState, done } of batch) {
			const predQ = this.model.forward(state);
			const nextQ = this.model.forward(nextState);
			const maxNextQ = done ? 0 : Math.max(...nextQ);
			const targetQ = reward + this.gamma * maxNextQ;

			const error = predQ[action] - targetQ;
			const loss = error ** 2;

			totalLoss += loss;
			totalPredQ += predQ[action];
			totalTargetQ += targetQ;

			this.model.train(state, action, targetQ);
		}

		const avgLoss = totalLoss / batch.length;
		const avgPredQ = totalPredQ / batch.length;
		const avgTargetQ = totalTargetQ / batch.length;

		console.log(
			`[Train] Loss: ${avgLoss.toFixed(4)} | Q: ${avgPredQ.toFixed(2)} -> ${avgTargetQ.toFixed(2)} | ε: ${this.epsilon.toFixed(3)}`,
		);

		this.epsilon = Math.max(
			this.minEpsilon,
			this.epsilon * this.epsilonDecay,
		);
	}
}
