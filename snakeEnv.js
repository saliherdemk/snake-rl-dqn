class SnakeEnv {
  constructor(p) {
    this.p = p;
    this.game = new GameManager(p);
    this.actionSpace = [0, 1, 2, 3];
    this.simSpeed = 10;
    this.rlMode = "eval";
    this.attachEvents();
    this.lastStepTime = 0;
  }

  reset() {
    this.game.initialize();
    return this.getState();
  }

  step(action) {
    this.setDirection(action);
    this.game.update();

    const state = this.getState();
    const reward = this.getReward();
    const done = this.game.gameOver;

    return { state, reward, done, info: {} };
  }

  setDirection(action) {
    const directions = [
      [0, -1], // up
      [0, 1], // down
      [-1, 0], // left
      [1, 0], // right
    ];

    const [dx, dy] = directions[action];
    this.game.setDirection(dx, dy);
  }

  getState() {
    return this.game.grid.map((row) => row.slice());
  }

  getReward() {
    if (this.game.gameOver) return -10;
    else if (this.game.justAteFood) return 10;
    else return -0.1;
  }

  draw() {
    if (this.rlMode == "eval") {
      if (this.game.started) {
        const action = Math.floor(Math.random() * 4);
        this.setDirection(action);
      }
    } else {
      const now = this.p.millis();
      const stepDelay = 1000 / this.simSpeed;
      if (now - this.lastStepTime >= stepDelay) {
        this.lastStepTime = now;

        if (!this.game.gameOver) {
          const action = Math.floor(Math.random() * 4);
          env.step(action);
        } else {
          env.reset();
        }
      }
    }
    this.game.draw();
  }

  startGame() {
    if (this.game.started) return;
    const action = Math.floor(Math.random() * 4);
    this.setDirection(action);
  }

  attachEvents() {
    document.getElementById("mode-toggle").onclick = () => {
      rlMode = this.rlMode === "train" ? "eval" : "train";
      document.getElementById("mode-toggle").innerText =
        `Mode: ${rlMode.charAt(0).toUpperCase() + rlMode.slice(1)}`;

      const inTrainMode = rlMode === "train";
      document.getElementById("speed-slider").disabled = !inTrainMode;
      document.getElementById("speed-label").style.color = inTrainMode
        ? "black"
        : "lightgray";
      this.rlMode = rlMode;
      this.reset();
    };

    document.getElementById("speed-slider").oninput = (e) => {
      this.simSpeed = parseInt(e.target.value);
    };
  }
}
