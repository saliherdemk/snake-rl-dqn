class StateExtractor {
	static getReducedState(game) {
		const head = game.snake[game.snake.length - 1];
		const dirIndex = game.directionIndex;

		const dir_up = dirIndex == 0 ? 1 : 0;
		const dir_down = dirIndex == 1 ? 1 : 0;
		const dir_left = dirIndex == 2 ? 1 : 0;
		const dir_right = dirIndex == 3 ? 1 : 0;

		const turnLeft = [2, 3, 1, 0];
		const turnRight = [3, 2, 0, 1];

		const leftIndex = turnLeft[dirIndex];
		const rightIndex = turnRight[dirIndex];

		const nextStr = this.getNextPosition(game, head, dirIndex);
		const nextLeft = this.getNextPosition(game, head, leftIndex);
		const nextRight = this.getNextPosition(game, head, rightIndex);

		const danger_straight = game.checkGameOver(nextStr) ? 1 : 0;
		const danger_left = game.checkGameOver(nextLeft) ? 1 : 0;
		const danger_right = game.checkGameOver(nextRight) ? 1 : 0;

		const straight_safe = this.isDirectionSafe(game, nextStr) ? 1 : 0;
		const left_safe = this.isDirectionSafe(game, nextLeft) ? 1 : 0;
		const right_safe = this.isDirectionSafe(game, nextRight) ? 1 : 0;

		const foodOnLeft = game.foodPosition.x < head.x ? 1 : 0;
		const foodOnRight = game.foodPosition.x > head.x ? 1 : 0;
		const foodOnUp = game.foodPosition.y < head.y ? 1 : 0;
		const foodOnDown = game.foodPosition.y > head.y ? 1 : 0;

		return [
			dir_up,
			dir_down,
			dir_left,
			dir_right,
			danger_straight,
			danger_left,
			danger_right,
			straight_safe,
			left_safe,
			right_safe,
			foodOnLeft,
			foodOnRight,
			foodOnUp,
			foodOnDown,
		];
	}

	static getNextPosition(game, pos, dirIndex) {
		const d = game.directions[dirIndex];
		return { x: pos.x + d[0], y: pos.y + d[1] };
	}

	static isDirectionSafe(startPos) {
		const reachableSpace = this.getAvailableSpace(startPos);
		return reachableSpace >= this.snake.length;
	}

	static isDirectionSafe(game, startPos) {
		const visited = new Set();
		const stack = [startPos];
		let count = 0;

		while (stack.length > 0 && count < game.snake.length) {
			const pos = stack.pop();
			const key = `${pos.x},${pos.y}`;

			if (visited.has(key) || game.checkGameOver(pos)) continue;

			visited.add(key);
			count++;

			for (const d of game.directions) {
				stack.push({ x: pos.x + d[0], y: pos.y + d[1] });
			}
		}

		return count >= game.snake.length;
	}
}
