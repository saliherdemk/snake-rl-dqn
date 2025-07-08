class Model {
	constructor(layers) {
		this.layers = layers;
	}

	forward(x) {
		x = x.map((v) => v / 2);

		for (const layer of this.layers) {
			x = layer.forward(x);
		}
		return x;
	}

	backward(grad_output) {
		for (let i = this.layers.length - 1; i >= 0; i--) {
			grad_output = this.layers[i].backward(grad_output);
		}
		return grad_output;
	}

	update(lr) {
		for (const layer of this.layers) {
			if (typeof layer.update === "function") {
				layer.update(lr);
			}
		}
	}

	train(state, action, targetQ, lr = 0.001) {
		const predictedQs = this.forward(state);

		const error = predictedQs[action] - targetQ;

		const gradOutput = new Array(predictedQs.length).fill(0);

		// Derivative of MSE loss w.r.t output Q-value for 'action'
		gradOutput[action] = 2 * error;

		this.backward(gradOutput);

		this.update(lr);
	}
}
