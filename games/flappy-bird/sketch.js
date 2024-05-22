let bird;
let pipes = [];
let assets;
let scale = 3;
let gravity = 0.18 * scale;
let jumpForse = -3 * scale;
let pipeSpeed = -1 * scale;
let hasStarted = false;

function setup() {
	createCanvas(144*scale, 256*scale);
	noSmooth();
	bird = new Bird();
}

function preload() {
	let spriteSheet = loadImage("spritesheet.png", () => {
		assets = {
			background: spriteSheet.get(0, 0, 144, 256),
			ground: spriteSheet.get(146, 0, 144, 56),
			bird1: spriteSheet.get(264, 64, 17, 12),
			bird2: spriteSheet.get(264, 90, 17, 12),
			bird3: spriteSheet.get(223, 124, 17, 12),
			pipeTop: spriteSheet.get(302, 0, 26, 135),
			pipeBottom: spriteSheet.get(330, 0, 26, 121)
		};
	});
}

function draw() {
	image(assets.background, 0, 0, 144*scale, 256*scale);
	
	pipes.forEach(pipe => {
		pipe.pos.add(pipe.vel);
		pipe.draw();
	});
		
	bird.update();
	bird.draw();
	
	image(assets.ground, -(frameCount*scale % width), 200*scale, 144*scale, 56*scale);
	image(assets.ground, -(frameCount*scale % width)+width, 200*scale, 144*scale, 56*scale);
}

class Bird {
	constructor() {
		this.pos = createVector(width/3 - 8, height/2);
		this.vel = createVector(0, 0);
		this.rotation = 0;
	}

	update() {
		if (hasStarted) {
			this.vel.y += gravity;
			this.vel.y = constrain(this.vel.y, jumpForse, 10);
			this.pos.y += this.vel.y;
			this.pos.y = constrain(this.pos.y, 0, height - 12*scale);

			if (this.isHit()) {
				noLoop();
				location.reload();
			}
		}
	}
	
	draw() {
		let birds = [assets.bird1, assets.bird1, assets.bird2, assets.bird3, assets.bird3, assets.bird2];
		image(birds[floor(frameCount/(hasStarted ? 2 : 4)) % 6], this.pos.x, this.pos.y, 17*scale, 12*scale);
	}

	flap() {
		this.vel.y = jumpForse;
	}

	isHit() {
		if (this.pos.y > 188*scale) return true;

		return pipes.some(pipe => {
			if (this.pos.x + 17*scale > pipe.pos.x && this.pos.x < pipe.pos.x + 24*scale) {
				let isAboveTop = this.pos.y < pipe.pos.y*scale - 24*scale;
				let isBelowBottom = this.pos.y + 12*scale > pipe.pos.y*scale + 24*scale;
				return isAboveTop || isBelowBottom;
			}
		});
	}
}

function keyPressed() {
	if (key == " ") {
		hasStarted = true;
		bird.flap();
	}
}

class Pipe {
	constructor() {
		this.pos = createVector(width, random(55, 145));
		this.vel = createVector(pipeSpeed, 0);
	}

	draw() {
		image(assets.pipeTop, this.pos.x, (this.pos.y-135)*scale - 24*scale, 24*scale, 135*scale);
		image(assets.pipeBottom, this.pos.x, (this.pos.y+24)*scale, 24*scale, 121*scale);
	}
}

setInterval(() => {
	if (hasStarted) {
		pipes.push(new Pipe());
		if (pipes.length > 2) {
			pipes.shift();
		}
	}
}, 1500);