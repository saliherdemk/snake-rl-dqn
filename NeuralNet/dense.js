class Dense {
	constructor(inputSize, outputSize) {
		this.weights = Array.from({ length: outputSize }, () =>
			Array.from({ length: inputSize }, () => Math.random() * 0.2 - 0.1),
		);
		this.biases = Array.from(
			{ length: outputSize },
			() => Math.random() * 0.2 - 0.1,
		);
	}

	forward(x) {
		this.input = x;
		return this.add(this.dot(this.weights, x), this.biases);
	}

	backward(grad_output) {
		this.grad_weights = this.outer(grad_output, this.input);
		this.grad_biases = grad_output.slice();
		return this.dot(this.transpose(this.weights), grad_output);
	}

	update(lr) {
		this.weights = this.sub(
			this.weights,
			this.multiply(this.grad_weights, lr),
		);
		this.biases = this.sub(
			this.biases,
			this.multiply(this.grad_biases, lr),
		);
	}

	dot(matrix, vector) {
		const result = [];
		for (let i = 0; i < matrix.length; i++) {
			let sum = 0;
			for (let j = 0; j < vector.length; j++) {
				sum += matrix[i][j] * vector[j];
			}
			result.push(sum);
		}
		return result;
	}

	add(vec1, vec2) {
		return vec1.map((v, i) => v + vec2[i]);
	}

	sub(vec1, vec2) {
		if (Array.isArray(vec1[0])) {
			return vec1.map((row, i) => row.map((v, j) => v - vec2[i][j]));
		} else {
			return vec1.map((v, i) => v - vec2[i]);
		}
	}

	multiply(vecOrMat, scalar) {
		if (Array.isArray(vecOrMat[0])) {
			return vecOrMat.map((row) => row.map((v) => v * scalar));
		} else {
			return vecOrMat.map((v) => v * scalar);
		}
	}

	outer(vec1, vec2) {
		const result = [];
		for (let i = 0; i < vec1.length; i++) {
			const row = [];
			for (let j = 0; j < vec2.length; j++) {
				row.push(vec1[i] * vec2[j]);
			}
			result.push(row);
		}
		return result;
	}

	transpose(matrix) {
		const rows = matrix.length;
		const cols = matrix[0].length;
		const result = Array.from({ length: cols }, () => Array(rows));
		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				result[j][i] = matrix[i][j];
			}
		}
		return result;
	}
}
