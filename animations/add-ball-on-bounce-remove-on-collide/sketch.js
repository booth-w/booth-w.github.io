function setup() {
	createCanvas(400, 400);
	$(canvas).css("border-radius", "200px");

	balls = [];
	balls.push(new Ball());
}

function draw() {
	colorMode(RGB, 255);
	background(150);
	colorMode(HSB, 100);
	balls.forEach(ball => {
		ball.move();
		ball.draw();
	});
}

class Ball {
	constructor() {
		this.pos = createVector(random(25, 375), 200);
		while (balls.some(ball => dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y) < 20)) {
			this.pos = createVector(random(25, 375), 200);
		}
		this.vel = createVector(0, 0);
		this.r = 20;
		this.colour = color(0, 100, 100);
		this.atEdgeLastFrame = false;
		this.genTime = frameCount;
		this.osc = new p5.Oscillator("sine");
	}

	move() {
		this.vel.y += gravity;
		this.pos.add(this.vel);

		let d = dist(this.pos.x, this.pos.y, 200, 200);
    if (d >= 200 - this.r/2 && !this.atEdgeLastFrame) {
			let angle = atan2(this.pos.y - 200, this.pos.x - 200);
			let normal = createVector(cos(angle), sin(angle));
			
			this.vel.sub(p5.Vector.mult(normal, 2 * p5.Vector.dot(this.vel, normal)));
			balls.push(new Ball());
			this.atEdgeLastFrame = true;

			this.osc.freq(440 * Math.pow(2, (round(random(60, 72)) - 69) / 12));
			this.osc.freq(440 * Math.pow(2, (round(random([60, 64, 67, 71, 72])) - 69) / 12));
			this.osc.amp(0);
			this.osc.start();
			this.osc.amp(1, 0.01);
			this.osc.amp(0, 0.1);
		}
		if (d < 200 - this.r/2) {
			this.atEdgeLastFrame = false;
		}
		balls.forEach((ball, i) => {
			if (ball != this && dist(ball.pos.x, ball.pos.y, this.pos.x, this.pos.y) < this.r) {
				balls.splice(i, 1);
				balls.splice(balls.indexOf(this), 1);
			}
		});
	}

	draw() {
		this.colour = color((frameCount-this.genTime)/4 % 100, 100, 100);
		fill(this.colour);
		ellipse(this.pos.x, this.pos.y, this.r);
	}
}

let balls;
let gravity = 0.1;
