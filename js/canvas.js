let rlMode = "train";
let simSpeed = 10;

let env;
let game;

const humanSketch = (p) => {
	p.setup = () => {
		const canvas = p.createCanvas(400, 400);
		canvas.parent("human-canvas");
		game = new GameManager(p);
	};

	p.draw = () => {
		p.background(0);
		p.frameRate(60);
		game.draw();
	};

	p.keyPressed = () => {
		if (p.key === "r") {
			game.initialize();
			env.game.initialize();
			return;
		}

		let direction = null;
		if (p.keyCode === p.UP_ARROW) direction = [0, -1];
		else if (p.keyCode === p.DOWN_ARROW) direction = [0, 1];
		else if (p.keyCode === p.LEFT_ARROW) direction = [-1, 0];
		else if (p.keyCode === p.RIGHT_ARROW) direction = [1, 0];

		if (direction) {
			game.setDirection(direction[0], direction[1]);
			env.startGame();
		}
	};
};

const rlSketch = (p) => {
	p.setup = () => {
		const canvas = p.createCanvas(400, 400);
		canvas.parent("rl-canvas");
		env = new SnakeEnv(p);
	};

	p.draw = () => {
		p.background(0);
		p.frameRate(60);
		env.draw();
	};
};

new p5(humanSketch);
new p5(rlSketch);
