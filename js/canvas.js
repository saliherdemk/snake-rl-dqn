var gameManager;

function setup() {
  var canvas = createCanvas(400, 400);
  gameManager = new GameManager(canvas);
}

function draw() {
  frameRate(60);
  gameManager.draw();
}

function keyPressed() {
  if (gameManager.gameOver && key === "r") {
    gameManager.restart();
    return;
  }
  var direction = null;
  if (keyCode === UP_ARROW) direction = [0, -1];
  else if (keyCode === DOWN_ARROW) direction = [0, 1];
  else if (keyCode === LEFT_ARROW) direction = [-1, 0];
  else if (keyCode === RIGHT_ARROW) direction = [1, 0];

  if (direction) gameManager.setDirection(direction[0], direction[1]);
}
