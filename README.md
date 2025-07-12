# Snake AI with Deep Q-Network

This project is part of the [ML-Papers-Implementations](https://github.com/saliherdemk/ML-Papers-Implementations) repository, where I implement foundational algorithms from scratch without using any libraries. This is a Deep Q-Network implementation in JavaScript, which you can train directly in the browser from scratch or challenge with a pretrained model. You can also save your model and load it later.

### Live Demo

Available [here](https://saliherdemk.github.io/snake-rl-dqn/)

<img src="https://github.com/saliherdemk/snake-rl-dqn/blob/master/media/demo.gif" width="500" height="500">


### Implementation Details

State representation is crucial for this problem. Since I’m using an MLP, flattening a 20x20 grid and passing it to the network is not efficient. Instead, I adopted a reduced state representation from [this project](https://github.com/vedantgoswami/SnakeGameAI/blob/main/agent.py) which uses an 11-dimensional state:

- Head direction, 4 values (up, down, left, right)
- Immediate collision risk, 3 values (danger straight, danger left, danger right)
- Relative food position, 4 values (food left, right, up, down)

However, this state only provides local information for the next move. The snake cannot foresee if it's about to enter a dead end. To mitigate this, I added 3 more features:

- `straight_safe`
- `left_safe`
- `right_safe`

These indicate whether there is enough space in the respective direction for the snake to continue safely.

The rest follows the standard DQN algorithm, using separate target and main networks.

For more in-depth notes you canrefer to my [Reinforcement Learning notes](https://github.com/saliherdemk/ML-Papers-Implementations/tree/master/ReinforcementLearning).

