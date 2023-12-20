function setup() {
	createCanvas(400, 400);
	$(canvas).css("border-radius", "200px");
	fill(150);
	ellipse(200, 200, 400);
	colorMode(HSB, 100);

	ball = new Ball();
	osc = new p5.Oscillator("sine");
}

function draw() {
	ball.move();
	ball.draw();
}

class Ball {
	constructor() {
		this.pos = createVector(100, 200);
		this.vel = createVector(0, 0);
		this.r = 20;
		this.colour = color(0, 100, 100);
		this.atEdgeLastFrame = false;
	}

	move() {
		this.vel.y += gravity;
		this.pos.add(this.vel);

		let d = dist(this.pos.x, this.pos.y, 200, 200);
    if (d >= 200 - this.r/2 && !this.atEdgeLastFrame) {
			let angle = atan2(this.pos.y - 200, this.pos.x - 200);
			let normal = createVector(cos(angle), sin(angle));
			
			this.vel.sub(p5.Vector.mult(normal, 2 * p5.Vector.dot(this.vel, normal)));
			this.vel.mult(1.02);
			this.r += 1.02;
			this.atEdgeLastFrame = true;

			osc.freq(440 * Math.pow(2, (round(random(60, 72)) - 69) / 12));
			osc.amp(1);
			osc.start();
			osc.amp(0, 0.1);
			osc.stop(0.1);
		}
		if (d < 200 - this.r/2) {
			this.atEdgeLastFrame = false;
		}
	}
	
	draw() {
		this.colour = color(frameCount/4 % 100, 100, 100);
		fill(this.colour);
		ellipse(this.pos.x, this.pos.y, this.r);
	}
}

let ball;
let gravity = 0.1;
