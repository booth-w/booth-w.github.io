let maze;
let cellSize;
let players;
let scores;
let controls = [
	{fd: 87, bk: 83, left: 65, right: 68, shoot: 32},
	{fd: 38, bk: 40, left: 37, right: 39, shoot: 13}
];

function setup() {
	createCanvas(360, 360).parent("game");
	stroke(0);
	strokeWeight(2);
	reset();

	scores = players.map(() => 0);
}

function draw() {
	background(220);

	for (let y in maze) {
		for (let x in maze[y]) {
			if (maze[y][x]) {
				rect(x * cellSize, y * cellSize, cellSize, cellSize);
			}
		}
	}

	for (let player of players) {
		player.move();
		player.shoot();
		player.draw();

		for (let bullet of player.bullets) {
			bullet.move();
			bullet.hitPlayer();
			bullet.draw();
		}
	}
}

class Tank {
	constructor(x, y, controls) {
		this.pos = createVector(x, y);
		this.dir = createVector(1, 0);
		this.bullets = [];
		this.canShoot = true;
		this.controls = controls;
	}

	move() {
		let posOld = this.pos.copy();
		let dirOld = this.dir.copy();

		if (keyIsDown(this.controls.fd)) this.pos.add(this.dir);
		if (keyIsDown(this.controls.bk)) this.pos.sub(this.dir);
		if (keyIsDown(this.controls.left)) this.dir.rotate(-0.05);
		if (keyIsDown(this.controls.right)) this.dir.rotate(0.05);

		// collision detection
		if (posOld.equals(this.pos) && dirOld.equals(this.dir)) return;

		let x1 = floor((this.pos.x + 12.5 * this.dir.x - 7.5 * this.dir.y) / cellSize);
		let y1 = floor((this.pos.y + 12.5 * this.dir.y + 7.5 * this.dir.x) / cellSize);
		let x2 = floor((this.pos.x + 12.5 * this.dir.x + 7.5 * this.dir.y) / cellSize);
		let y2 = floor((this.pos.y + 12.5 * this.dir.y - 7.5 * this.dir.x) / cellSize);
		let x3 = floor((this.pos.x - 12.5 * this.dir.x - 7.5 * this.dir.y) / cellSize);
		let y3 = floor((this.pos.y - 12.5 * this.dir.y + 7.5 * this.dir.x) / cellSize);
		let x4 = floor((this.pos.x - 12.5 * this.dir.x + 7.5 * this.dir.y) / cellSize);
		let y4 = floor((this.pos.y - 12.5 * this.dir.y - 7.5 * this.dir.x) / cellSize);

		let tankCorners = [[x1, y1], [x2, y2], [x3, y3], [x4, y4]];

		// go back if any corner is in a wall
		if (tankCorners.some(([x, y]) => x < 0 || x >= maze[0].length || y < 0 || y >= maze.length || maze[y][x])) {
			this.pos = posOld;
			this.dir = dirOld;
		}
	}

	shoot() {
		if (keyIsDown(this.controls.shoot)) {
			if (this.canShoot) {
				this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.dir.copy()));
				this.canShoot = false;
				setTimeout(() => this.canShoot = true, 1000);
			}
		}
	}

	draw() {
		push();
		translate(this.pos.x, this.pos.y);
		rotate(this.dir.heading());
		rectMode(CENTER);
		rect(0, 0, 25, 15);
		rect(10, 0, 10, 5);
		pop();
	}
}

class Bullet {
	constructor(x, y, dir) {
		this.pos = createVector(x, y);
		this.lastPos = this.pos.copy();
		this.dir = dir;
		this.speed = 3;
		this.bounces = 0;
		this.hasLeftParent = false;
	}

	move() {
		this.lastPos = this.pos.copy();
		this.pos.add(this.dir.copy().mult(this.speed));

		// bounce off walls
		let x = floor(this.pos.x / cellSize);
		let y = floor(this.pos.y / cellSize);
		let lastx = floor(this.lastPos.x / cellSize);
		let lasty = floor(this.lastPos.y / cellSize);

		if (x < 0 || x >= maze[0].length || y < 0 || y >= maze.length || maze[y][x]) {
			if (++this.bounces == 10) {
				let parent = players.find(player => player.bullets.includes(this));
				parent.bullets.splice(parent.bullets.indexOf(this), 1);
				return;
			}

			// get normal of wall
			let normal = createVector(x != lastx, y != lasty);

			if (!normal.x && !normal.y) {
				this.pos = this.lastPos.copy();
				return;
			}

			// corner
			let corner = false;
			if (normal.x && normal.y) {
				if (x < 0 && (y < 0 || y >= maze.length || maze[y][lastx]) || x >= maze[0].length && (y < 0 || y >= maze.length || maze[y][lastx]) || (y < 0 || y >= maze.length) && maze[lasty][x] || y >= 0 && y < maze.length && maze[y][x] && (maze[lasty][x] == maze[y][lastx])) {
					corner = true;
				} else {
					// don't count wall seams as corners
					if (y < 0 || y >= maze.length || maze[y][x] && maze[y][lastx]) {
						normal.x = 0;
					} else if (x < 0 || x >= maze.length || maze[y][x] && maze[lasty][x]) {
						normal.y = 0;
					}
				}
			}

			// snap to wall
			this.pos = this.lastPos.copy();
			if (normal.x) {
				this.pos.x = round(this.pos.x / cellSize) * cellSize;
				this.pos.y += this.dir.y * abs(this.pos.x - this.lastPos.x);
			} else {
				this.pos.y = round(this.pos.y / cellSize) * cellSize;
				this.pos.x += this.dir.x * abs(this.pos.y - this.lastPos.y);
			}

			// reflect
			if (corner) {
				this.dir.rotate(TAU/2);
			} else {
				this.dir.reflect(normal);
			}
		}
	}

	hitPlayer() {
		let parent = players.find(player => player.bullets.includes(this));
		for (let player of players) {
			let x1 = player.pos.x - 12.5;
			let y1 = player.pos.y - 12.5;
			let x2 = player.pos.x + 12.5;
			let y2 = player.pos.y + 12.5;

			let overlappingPlayer = this.pos.x > x1 && this.pos.x < x2 && this.pos.y > y1 && this.pos.y < y2;

			if (!overlappingPlayer && (player == parent) && !canHitSelf && !this.hasLeftParent) {
				this.hasLeftParent = true;
				continue;
			}

			// hit player
			if (overlappingPlayer && ((player == parent) && this.hasLeftParent || (player != parent))) {
				if (player != parent) {
					scores[players.indexOf(parent)]++;
				} else {
					scores[players.indexOf(player)]--;
				}

				$(`#score${players.indexOf(parent)}`).text(scores[players.indexOf(parent)]);

				players.splice(players.indexOf(player), 1);

				if (players.length == 1) {
					reset();
				}
				return;
			}
		}
	}

	draw() {
		ellipse(this.pos.x, this.pos.y, 5);
	}
}

function generateMaze(width, height) {
	// recursive backtracking
	let maze = Array(height).fill().map(() => Array(width).fill(true));
	let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

	function carve(x, y) {
		maze[y][x] = false;

		for (let [dx, dy] of shuffle(directions)) {
			let nx = x + dx * 2;
			let ny = y + dy * 2;
			if (ny >= 0 && ny < height && nx >= 0 && nx < width && maze[ny][nx]) {
				maze[y + dy][x + dx] = false;
				carve(nx, ny);
			}
		}
	}

	carve(0, 0);
	return maze;
}

let canHitSelf;
let newMazeOnHit;
let resetPositionsOnHit;
let firstReset = true;

function reset() {
	canHitSelf = $("#can-hit-self").prop("checked");
	newMazeOnHit = $("#new-maze-on-hit").prop("checked");
	resetPositionsOnHit = $("#reset-positions-on-hit").prop("checked");

	if (newMazeOnHit || firstReset) {
		maze = generateMaze(9, 9);
		cellSize = width / maze.length;
	}

	if (resetPositionsOnHit || firstReset) {
		players = [];
		players.push(new Tank(cellSize / 2, cellSize / 2, controls[0]));
		players.push(new Tank(width - cellSize / 2, height - cellSize / 2, controls[1]));
		players[0].dir.rotate(TAU/8);
		players[1].dir.rotate(TAU/8*5);
	}

	firstReset = false;
}

$("#can-hit-self, #new-maze-on-hit, #reset-positions-on-hit").change(reset);

// remove default key behaviour
$(document).on("keydown", e => {
	if (controls.map(a => Object.values(a)).flat().includes(e.keyCode)) {
		e.preventDefault();
	}
});