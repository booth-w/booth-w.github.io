let player;
let spike;
let spikeSpeed = 5;

function setup() {
	createCanvas(400, 400);
	player = new Player();
	spike = new Spike(floor(random(2)));

	setInterval(() => {
		spike = new Spike(floor(random(2)));
	}, 1000);
}

function draw() {
	background(220);
	fill(255);
	rect(0, (width/2) - 10, height, 20);

	player.flip();
	player.draw();
	spike.draw();
	spike.move();

	player.speed *= 1.0002;
	spikeSpeed = player.speed/2;
	spike.speed = spikeSpeed;
	
	if (player.isHit()) {
		noLoop();
		alert(`Game over. You survived ${Math.floor(millis()/1000)} seconds.`)
		location.reload();
	}
}

class Player {
	constructor() {
		this.size = 20;
		this.pos = createVector(50, (height/2)-10-this.size/2);
		this.speed = 15;
		this.colours = [color(220, 0, 0), color(0, 220, 0), color(0, 0, 220)];
		this.colourSelected = 0;
		this.side = 0;
		// 0 = top, 1 = bottom
		this.isFlipping = false;
		this.hasFlipped = false;
	}

	draw() {
		fill(this.colours[this.colourSelected]);
		circle(this.pos.x, this.pos.y, this.size);
	}

	flip() {
    if (this.isFlipping) {
      this.pos.y += this.speed * ((this.side == this.hasFlipped) ? -1 : 1);
			if (this.pos.y >= (height/2) - this.size && this.side == 0 || this.pos.y <= (height/2) + this.size && this.side == 1) {
				this.isFlipping = false;
				this.pos.y = (height/2)-(10+this.size/2)*((this.side) ? -1 : 1);
			}
			if (this.pos.y >= height) {
				this.pos.y = 0;
				this.side = !this.side;
				this.hasFlipped = true;
			} else if (this.pos.y <= 0) {
				this.pos.y = height;
				this.side = !this.side;
				this.hasFlipped = true;
			}
    }
	}

	isHit() {
		if (this.side == spike.side) {
			if (this.pos.x > spike.pos.x && this.pos.x < spike.pos.x + spike.size) {
				if (this.side == 0 && this.pos.y < height/2 && this.pos.y > height/2-spike.size*sqrt(3)/2) {
					return true;
				} else if (this.side == 1 && this.pos.y > height/2 && this.pos.y < height/2+spike.size*sqrt(3)/2) {
					return true;
				}
			}
		}
		return false;
	}
}

class Spike {
	constructor(side) {
		this.pos = createVector(width, 0);
		this.size = 50;
		this.side = side;
		// 0 = top, 1 = bottom
		this.speed = spikeSpeed;
	}

	draw() {
		fill(0);
		if (this.side == 0) {
			triangle(this.pos.x, height/2-10, this.pos.x+this.size, height/2-10, this.pos.x+this.size/2, height/2-this.size*sqrt(3)/2);
		} else {
			triangle(this.pos.x, height/2+10, this.pos.x+this.size, height/2+10, this.pos.x+this.size/2, height/2+this.size*sqrt(3)/2);
		}		
	}

	move() {
		this.pos.x -= this.speed;
	}
}

function keyPressed() {
	if (keyCode == 32 && !player.isFlipping) {
		player.isFlipping = true;
		player.hasFlipped = false;
		console.log(player.speed, spikes[0].speed);
	}
}