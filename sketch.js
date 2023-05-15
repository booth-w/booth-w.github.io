let points = [];

function setup() {
	// set size to parent div
	let canvas = createCanvas($("#canvas").width(), $("#canvas").height());
	canvas.parent("canvas");
	fill(200);

	for (let i = 0; i < 10; i++) {
		points.push(new Point(random(width), random(height)));
	}
}

function draw() {
	background(100);
	points.forEach(point => {
		point.move();
		point.drawLines();
	});
	points.forEach(point => {
		point.draw();
	});
}

class Point {
	constructor(x, y) {
		this.pos = createVector(x, y);
		this.vel = p5.Vector.random2D();
	}

	move() {
		this.pos.add(this.vel);
		this.pos.x = (this.pos.x + width) % width;
		this.pos.y = (this.pos.y + height) % height;
	}
	
	draw() {
		stroke(200);
		ellipse(this.pos.x, this.pos.y, 20, 20);
	}

	drawLines() {
		for (let a = 0; a < points.length; a++) {
			let dist = p5.Vector.dist(this.pos, points[a].pos);
			stroke(150);
			strokeWeight(30 - dist / 15);
			if ((dist / 15 < 30)) {
				line(this.pos.x, this.pos.y, points[a].pos.x, points[a].pos.y);
			}
		}
	}
}

function windowResized() {
	resizeCanvas($("#canvas").width(), $("#canvas").height());
}