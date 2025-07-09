class Model {
	constructor(layers) {
		this.layers = layers;
	}

	forward(x) {
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

	train(predQ, targetQ, action, lr = 0.001) {
		const error = predQ[action] - targetQ;

		const gradOutput = new Array(predQ.length).fill(0);

		// Derivative of MSE loss w.r.t output Q-value for 'action'
		gradOutput[action] = 2 * error;

		this.backward(gradOutput);

		this.update(lr);
	}

	save() {
		let result = [];
		for (const layer of this.layers) {
			result.push(layer.getParameters());
		}
		return result;
	}

	load(data) {
		console.log(data);
		for (let i = 0; i < data.length; i++) {
			this.layers[i].load(data[i]);
		}
	}
}
