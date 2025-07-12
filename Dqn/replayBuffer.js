class ReplayBuffer {
	constructor(capacity = 1000) {
		this.capacity = capacity;
		this.buffer = [];
	}

	push(experience) {
		if (this.buffer.length >= this.capacity) this.buffer.shift();
		this.buffer.push(experience);
	}

	sample(batchSize) {
		const batch = [];
		while (batch.length < batchSize) {
			const i = Math.floor(Math.random() * this.buffer.length);
			batch.push(this.buffer[i]);
		}
		return batch;
	}

	size() {
		return this.buffer.length;
	}
}
