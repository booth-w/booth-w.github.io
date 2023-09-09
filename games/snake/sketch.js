function setup() {
	createCanvas(800, 800);
	reset();
}

function draw() {
	background(20);
	frameRate(10);

	player.move();
	player.draw();
	player.eat();
	food.draw();
}

class Player{
	constructor(startPos) {
		this.body = startPos;
		this.controlls = {
			87: "up",
			83: "down",
			65: "left",
			68: "right"
		};
		this.moveDir = "right";
		this.inputQueue = [];
		this.score = 0;
	}

	bufferInput(keyCode) {
		if (keyCode in this.controlls) {
			this.inputQueue.push(this.controlls[keyCode]);
		}
	}

	move() {
		if (this.inputQueue.length > 0) {
			let newMoveDir = this.inputQueue.shift();
			if (newMoveDir == "up" && this.moveDir != "down" ||
				newMoveDir == "down" && this.moveDir != "up" ||
				newMoveDir == "left" && this.moveDir != "right" ||
				newMoveDir == "right" && this.moveDir != "left") {
				this.moveDir = newMoveDir;
			}
		}

		let head = this.body[0];
		let newHead = [head[0], head[1]];
		
		switch(this.moveDir) {
			case "up":
				newHead[1] -= 1;
				break;
			case "down":
				newHead[1] += 1;
				break;
			case "left":
				newHead[0] -= 1;
				break;
			case "right":
				newHead[0] += 1;
				break;
		}

		if (this.body.some(segment => JSON.stringify(segment) == JSON.stringify(newHead))) {
			alert(`You ran into yourself! Your score was ${this.score}.`);
			reset();
			return;
		}

		if (newHead[0] < 0 || newHead[0] > 39 || newHead[1] < 0 || newHead[1] > 39) {
			alert(`You ran into the wall! Your score was ${this.score}.`);
			reset();
			return;
		}

		this.body.unshift(newHead);
		this.body.pop();
	}

	draw() {
		fill(255);
		for(let i = 0; i < this.body.length; i++) {
			rect(this.body[i][0] * 20, this.body[i][1] * 20, 20, 20);
		}
	}

	eat() {
		if (JSON.stringify(this.body[0]) == JSON.stringify(food.pos)) {
			this.body.push(this.body[this.body.length - 1]);
			this.score++;
			food = new Food();
		}
	}
}

class Food{
	constructor() {
		do {
			this.pos = [Math.floor(Math.random() * 40), Math.floor(Math.random() * 40)];
		} while ((() => {
			for (let a = 0; a < player.body.length; a++) {
				if (JSON.stringify(player.body[a]) == JSON.stringify(this.pos)) {
					return true;
				}
			}
			return false;
		})());
	}

	draw() {
		fill(255, 0, 0);
		rect(this.pos[0] * 20, this.pos[1] * 20, 20, 20);
	}
}

let player;
let food;

function reset() {
	player = new Player([[5, 1], [4, 1], [3, 1], [2, 1], [1, 1]]);
	food = new Food();
}

function keyPressed() {
	player.bufferInput(keyCode);
}