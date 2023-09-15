let player;
let enemys = [];
let pellets = [];
let pelletsE = [];
let score = 0;
let time = 0;

function setup() {
	createCanvas(400, 400);

	player = new Player();

	setInterval(() => {
		if (player.health < 10) {
			player.health += .1;
		}
	}, 1000);

	setInterval(() => {
		if (enemys.length < 3) {
			enemys.push(new Enemy());
		}
	}, 2000);

	setInterval(() => {
		enemys.forEach(enemy => {
			pelletsE.push(new enemy.pellet(enemy.pos));
		});
	}, 1500);
}

function draw() {
	background(220);

	player.move();
	player.draw();

	enemys.forEach(enemy => {
		enemy.move();
		enemy.draw();
	});

	pellets.forEach(pellet => {
		pellet.move();
		pellet.draw();
		pellet.isHit();
	});

	pelletsE.forEach(pellet => {
		pellet.move();
		pellet.draw();
		pellet.isHit();
	});

	fill(0);
	textSize(32);
	text(score, 10, 32);
	
	time = Math.floor(millis() / 10);
	textSize(24)
	time = time.toString().slice(0, -2) + "." + time.toString().slice(-2);
	if (time.length < 4) {
		time = "0" + time;
	}
	text(time, 10, 56);

	if (player.isDead()) {
		noLoop();
		alert(`You died! Your score was ${score} and survived ${time} seconds.`)
		location.reload();
	}
}

class Player {
	constructor() {
		this.pos = createVector(200, 200);
		this.size = 25;
		this.speed = 2.5;
		this.health = 10;
		this.pellet = class {
			constructor() {
				this.pelletSpeed = 5;
				this.pos = createVector(player.pos.x, player.pos.y);
				this.vel = createVector(mouseX - this.pos.x, mouseY - this.pos.y);
				this.vel.setMag(this.pelletSpeed);
				this.size = 10;
				this.colour = color("black");
			}

			move() {
				this.pos.add(this.vel);

				if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height) {
					pellets.splice(pellets.indexOf(this), 1);
				}
			}

			draw() {
				stroke(this.colour);
				fill(this.colour);
				ellipse(this.pos.x, this.pos.y, this.size, this.size);
			}

			isHit() {
				if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height) {
					pellets.splice(pellets.indexOf(this), 1);
				}
		
				enemys.forEach(enemy => {
					if (dist(this.pos.x, this.pos.y, enemy.pos.x, enemy.pos.y) < enemy.size) {
						pellets.splice(pellets.indexOf(this), 1);
						enemy.health--;
						if (enemy.health === 0) {
							enemys.splice(enemys.indexOf(enemy), 1);
							score++;
						}
					}
				});
			}
		}
	}

	move() {
		this.pos.add(createVector(keyIsDown(68) - keyIsDown(65), keyIsDown(83) - keyIsDown(87)).setMag(this.speed));
		this.pos.x = constrain(this.pos.x, this.size/2, width-this.size/2);
		this.pos.y = constrain(this.pos.y, this.size/2, height-this.size/2);
	}

	draw() {
		fill(100);
		circle(this.pos.x, this.pos.y, this.size);

		stroke(0);
		fill(50);
		rect(this.pos.x-15, this.pos.y+5+this.size/2, 30, 10);
		fill("green");
		rect(this.pos.x-15, this.pos.y+5+this.size/2, this.health*30/10, 10);
	}

	isDead() {
		return this.health <= 0;
	}
}

function mousePressed() {
	pellets.push(new player.pellet());
}

class Enemy {
	constructor() {
		this.pos = createVector(random(width), random(height));
		this.size = 20;
		this.speed = 1;
		this.health = 10;
		this.pellet = class {
			constructor(pos) {
				this.pelletSpeed = 5;
				this.pos = createVector(pos.x, pos.y);
				this.vel = createVector(player.pos.x - pos.x, player.pos.y - pos.y);
				this.vel.setMag(this.pelletSpeed);
				this.size = 10;
				this.colour = color(color(55, 0, 0));
			}

			move() {
				this.pos.add(this.vel);

				if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height) {
					pelletsE.splice(pelletsE.indexOf(this), 1);
				}
			}

			draw() {
				stroke(this.colour);
				fill(this.colour);
				ellipse(this.pos.x, this.pos.y, this.size, this.size);
			}

			isHit() {
				if (this.pos.x < 0 || this.pos.y < 0 || this.pos.x > width || this.pos.y > height) {
					pelletsE.splice(pelletsE.indexOf(this), 1);
				}
	
				if (dist(this.pos.x, this.pos.y, player.pos.x, player.pos.y) < player.size) {
					pelletsE.splice(pelletsE.indexOf(this), 1);
					player.health--;
				}
			}
		}
	}

	move() {
		this.pos.add(p5.Vector.sub(player.pos, this.pos).setMag(this.speed));
		this.pos.x = constrain(this.pos.x, this.size/2, width-this.size/2);
		this.pos.y = constrain(this.pos.y, this.size/2, height-this.size/2);
	}

	draw() {
		fill(color(200, 0, 0));
		circle(this.pos.x, this.pos.y, this.size);

		stroke(0);
		fill(50);
		rect(this.pos.x-15, this.pos.y+5+this.size/2, 30, 10);
		fill("green");
		rect(this.pos.x-15, this.pos.y+5+this.size/2, this.health*30/10, 10);
	}
}