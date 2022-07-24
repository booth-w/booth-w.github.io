function setup() {
	createCanvas(400, 400);
}

function draw() {
	background(255);
	fill(0)

	player.draw();
	
	// for (let enemy of enemys) {
	// 	enemy.move();
	// 	enemy.draw();
	// }

	// for (let bullet of bullets) {
	// 	bullet.move();
	// 	bullet.draw();
	// }
}

class Enemy {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 10;
		this.speed = 1;
	}

	move() {
		
	}

	draw() {
		rect(this.x, this.y, this.width);
	}
	
	shoot() {
		console.log(123)
		// bullets.push(new Bullet());
	}
}

class Bullet {
	constructor(x, y, parent) {
		this.x = x;
		this.y = y;
		this.parent = parent;
	}

	move() {
		
	}

	draw() {
		
	}
}

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 10;
		this.speed = 2;
	}

	move() {
		
	}

	draw() {
		fill(0)
		rect(100, 100);
	}
	
	shoot() {
		
	}
}

let player = new Player(200, 200);
let enemys = [];
let bullets = [];
let playerBullet;

for (let row = 0; row < 5; row++) {
	enemys[row] = [];
	for (let col = 0; col < 11; col++) {
		enemys[row][col] = new Enemy(10*row, 10*col);
	}
}

// setInterval(() => {
// 	for (let enemy of enemys) {
// 		enemy.shoot();
// 	}
// }, 2000);