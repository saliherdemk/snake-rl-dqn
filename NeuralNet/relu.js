class Relu {
	forward(x) {
		this.input = x.slice();
		return x.map((v) => Math.max(0, v));
	}

	backward(grad_output) {
		const grad_input = [];
		for (let i = 0; i < grad_output.length; i++) {
			grad_input.push(this.input[i] > 0 ? grad_output[i] : 0);
		}
		return grad_input;
	}
}
