function setup() {
	let cnv = createCanvas(800, 800);
	cnv.parent("canvas");
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
		this.bot = false;
	}

	bufferInput(keyCode) {
		if (keyCode in this.controlls) {
			this.inputQueue.push(this.controlls[keyCode]);
		}
	}

	generatePath(start, end) {
		let openSet = [start];
		let cameFrom = {};
		let gScore = {};
		let fScore = {};

		gScore[JSON.stringify(start)] = 0;
		fScore[JSON.stringify(start)] = Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);

		while (openSet.length > 0) {
			let current = openSet.reduce((a, b) => fScore[JSON.stringify(a)] < fScore[JSON.stringify(b)] ? a : b);
			if (JSON.stringify(current) == JSON.stringify(end)) {
				let totalPath = [current];
					while (JSON.stringify(current) in cameFrom) {
						current = cameFrom[JSON.stringify(current)];
						totalPath.unshift(current);
					}
				return totalPath;
			}

			openSet.splice(openSet.indexOf(current), 1);
			let neighbors = [[current[0] + 1, current[1]], [current[0] - 1, current[1]], [current[0], current[1] + 1], [current[0], current[1] - 1]];
			for (let a of neighbors) {
				if (a[0] < 0 || a[0] > 39 || a[1] < 0 || a[1] > 39 || JSON.stringify(this.body).includes(JSON.stringify(a))) continue;
				let tentativeGScore = gScore[JSON.stringify(current)] + 1;
				if (!(JSON.stringify(a) in gScore) || tentativeGScore < gScore[JSON.stringify(a)]) {
					cameFrom[JSON.stringify(a)] = current;
					gScore[JSON.stringify(a)] = tentativeGScore;
					fScore[JSON.stringify(a)] = gScore[JSON.stringify(a)] + Math.abs(a[0] - end[0]) + Math.abs(a[1] - end[1]);
					if (!openSet.some(b => JSON.stringify(b) == JSON.stringify(a))) {
						openSet.push(a);
					}
				}
			}
		}

		let path = [start];
		let current = start;

		for (let a = 0; a < 5; a++) {
			let neighbors = [[current[0] + 1, current[1]], [current[0] - 1, current[1]], [current[0], current[1] + 1], [current[0], current[1] - 1]];
			let validNeighbors = neighbors.reduce((b, n) => {
				if (n[0] >= 0 && n[0] <= 39 && n[1] >= 0 && n[1] <= 39 && !JSON.stringify(this.body).includes(JSON.stringify(n))) {
					b.push(n);
				}
				return b;
			}, []);
			if (validNeighbors.length == 0) {
				return path;
			} else {
				current = validNeighbors[0];
				path.push(current);
			}
		}
		return path;
	}

	move() {
		if (this.bot) {
			let path = this.generatePath(this.body[0], food.pos);
			if (path.length > 1) {
				let newMoveDir = (() => {
					if (path[1][0] > path[0][0]) {
						return "right";
					} else if (path[1][0] < path[0][0]) {
						return "left";
					} else if (path[1][1] > path[0][1]) {
						return "down";
					} else if (path[1][1] < path[0][1]) {
						return "up";
					}
				})();
				if (newMoveDir == "up" && this.moveDir != "down" ||
					newMoveDir == "down" && this.moveDir != "up" ||
					newMoveDir == "left" && this.moveDir != "right" ||
					newMoveDir == "right" && this.moveDir != "left") {
					this.moveDir = newMoveDir;
				}
			}
		} else {
			if (this.inputQueue.length > 0) {
				let newMoveDir = this.inputQueue.shift();
				if (newMoveDir == "up" && this.moveDir != "down" ||
					newMoveDir == "down" && this.moveDir != "up" ||
					newMoveDir == "left" && this.moveDir != "right" ||
					newMoveDir == "right" && this.moveDir != "left") {
					this.moveDir = newMoveDir;
				}
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

$("#botToggle").click(() => {
	reset();
	player.bot = $("#botToggle").prop("checked");
});
