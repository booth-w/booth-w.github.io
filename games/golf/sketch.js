let ball;
let end;
let walls = [];
let pits = [];
let data;
let level = 1;

function preload() {
	data = loadJSON("levels.json");
}

function setup() {
	createCanvas(600, 600);
	ball = new Ball();
	end = new End();
	reset(level);
}

function draw() {
	background(100);
	stroke(50);
	fill(50);
	for (let a of walls) {
		a.draw();
		a.isHit();
	}
	for (let a of pits) {
		a.draw();
		a.isHit();
	}
	stroke(0);
	fill(200)
	end.draw();
	ball.move();
	ball.draw();
}

class Ball {
	constructor() {
		this.pos = createVector(0, 0);
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
		this.r = 20;
	}

	draw() {
		ellipse(this.pos.x, this.pos.y, this.r);

		if (Math.max(Math.abs(ball.vel.x), Math.abs(ball.vel.y)) == 0) {
			let power = constrain(ball.pos.dist(createVector(mouseX, mouseY))/50, 0, 4);
			let angle = Math.atan2(mouseY-this.pos.y, mouseX-this.pos.x);
			translate(this.pos.x, this.pos.y);
			rotate(angle + radians(-90));
			
			for (let a = 0; a < 100; a++) {
	      let inter = map(a, 0, 30, 0, 1);
	      let c = lerpColor(color(0, 255, 0), color(255, 0, 0), inter);
	      stroke(c);
				if (a <= power*10) {
		      line(-10, 20+a, 10, 20+a);
				}
	    }
		}
	}

	fire(power, angle) {
		let toAdd = createVector(power, 0);
		toAdd.rotate(angle + radians(180));
		this.acc.add(toAdd);
	}

	move() {
	  this.vel.add(this.acc);
	  this.pos.add(this.vel);
		this.vel.mult(0.99);
		this.acc.mult(0);
		
		if (Math.max(Math.abs(this.vel.x), Math.abs(this.vel.y)) < .1) this.vel.mult(0);
		if (end.isAtEnd(this)) {
			reset(++level);
		}
	}	
}

class Wall {
	constructor(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	}

	draw() {
		rect(this.x, this.y, this.width, this.height);
	}

	isHit() {
		if (ball.pos.x + ball.r/2 >= this.x && ball.pos.x - ball.r/2 <= this.x + this.width && ball.pos.y + ball.r/2 >= this.y && ball.pos.y - ball.r/2 <= this.y + this.height) {
			if (ball.pos.y > this.y && ball.pos.y < this.y + this.height) {
				ball.vel.x *= -1;
			} else {
				ball.vel.y *= -1;
			}
		}
	}
}

class End {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.r = 20;
	}

	draw() {
		ellipse(this.pos.x, this.pos.y, this.r);
	}

	isAtEnd() {
		return this.pos.dist(ball.pos) < 20;
	}
}

class Pit {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.r = 20;
	}

	draw() {
		fill(0);
		ellipse(this.pos.x, this.pos.y, this.r);
	}

	isHit() {
		if (this.pos.dist(ball.pos) < 20) {
			reset(level);
		}
	}
}

function reset(level) {
	layout = data[level-1];
	ball.pos.x = layout.start.x;
	ball.pos.y = layout.start.y;
	end.pos.x = layout.end.x;
	end.pos.y = layout.end.y;
	ball.vel.mult(0);

	walls = [];
	for (let w of layout.walls) {
		walls.push(new Wall(w.x, w.y, w.w, w.h));
	}
	
	pits = [];
	for (let p of layout.pits) {
		pits.push(new Pit(p.x, p.y));
	}
}

function mousePressed() {
	if (Math.max(Math.abs(ball.vel.x), Math.abs(ball.vel.y)) == 0) {
		let power = constrain(ball.pos.dist(createVector(mouseX, mouseY))/20, 0, 10);
		let angle = Math.atan2(mouseY-ball.pos.y, mouseX-ball.pos.x);
		ball.fire(power, angle);
	}
}