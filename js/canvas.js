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
		document.getElementById("human-score").innerText = game.getScore();
	};

	p.keyPressed = () => {
		const key = p.key.toLowerCase();
		if (key === "r") {
			game.initialize();
			env.reset();
			return;
		} else if (key === "s") {
			game.start();
			env.startGame();
		}

		let direction = null;
		if (p.keyCode === p.UP_ARROW) direction = 0;
		else if (p.keyCode === p.DOWN_ARROW) direction = 1;
		else if (p.keyCode === p.LEFT_ARROW) direction = 2;
		else if (p.keyCode === p.RIGHT_ARROW) direction = 3;

		if (direction !== null) {
			game.setDirection(direction);
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
		document.getElementById("ai-score").innerText = env.game.getScore();
	};
};

new p5(humanSketch);
new p5(rlSketch);
