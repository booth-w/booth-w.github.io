let bird;
let assets;
let scale = 3;
let gravity = 0.18 * scale;
let jumpForse = -3 * scale;
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
			bird3: spriteSheet.get(223, 124, 17, 12)
		};
	});
}

function draw() {
	image(assets.background, 0, 0, 144*scale, 256*scale);
	image(assets.ground, 0, 200*scale, 144*scale, 56*scale);

	bird.update();
	bird.draw();
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
		}
	}
	
	draw() {
		let birds = [assets.bird1, assets.bird1, assets.bird2, assets.bird3, assets.bird3, assets.bird2];
		image(birds[floor(frameCount/(hasStarted ? 2 : 4)) % 6], this.pos.x, this.pos.y, 17*scale, 12*scale);
	}

	flap() {
		this.vel.y = jumpForse;
	}
}

function keyPressed() {
	if (key == " ") {
		hasStarted = true;
		bird.flap();
	}
}
