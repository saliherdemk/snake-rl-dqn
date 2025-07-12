# Snake AI with Deep Q-Network 

This project is part of the [ML-Papers-Implementations](https://github.com/saliherdemk/ML-Papers-Implementations) repository which I create foundamental algorithms from scratch without any library. THis is a Deep Q-Network implementation in js which you can train in browser from scratch or can challange the pretrained model. You can also save your model and load later.


### Live Demo

Available [here](https://saliherdemk.github.io/snake-rl-dqn/)

<img src="https://github.com/saliherdemk/snake-rl-dqn/blob/master/media/demo.gif">


### Implementation Details

State representation is crucial for this problem. Since I'm using MLP, flattening 20x20 grid and passing to the mlp is not logical. I adopted reduced state representation from [here](https://github.com/vedantgoswami/SnakeGameAI/blob/main/agent.py) which uses 11 state.

- head direction -> 4
- will collide if it keeps going straight, left or right -> 3
- where is the food - left, right, top, down -> 4

Since the state can provide information only for the next move, snake can't know if it's going to enter to a dead end or not. I provide 3 more input

- straight_safe
- left_safe
- right_safe 

which we check if there is an enough space that snake can fit. 

Remaining, is just the regular dqn algorithm with seperated target and main network. For more in depth notes, you can refer to my [notes](https://github.com/saliherdemk/ML-Papers-Implementations/tree/master/ReinforcementLearning)


