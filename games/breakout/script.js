if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	$(".game").append("<div>This game can't be played on mobile</div>");
	$("canvas").hide();
}

let canvas = document.getElementById("breakout");
let ctx = canvas.getContext("2d");

class Paddle {
	constructor() {
		this.width = 40;
		this.height = 5;
		this.x = canvas.width / 2 - this.width / 2;
		this.y = canvas.height - 40;
		this.speed = 1;
	}

	move() {
		if ((keys[65] || keys[37]) && this.x > 0) this.x -= this.speed;
		if ((keys[68] || keys[39]) && this.x < (canvas.width - this.width)) this.x += this.speed;
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

class Ball {
	constructor() {
		this.r = 3;
		this.x = paddle.x + paddle.width / 2;
		this.y = paddle.y - this.r;
		this.dirX = .5;
		this.dirY = -.5;
		this.canMove = true
	}

	move() {
		this.x += this.dirX;
		this.y += this.dirY;
		if (this.canMove) {
			if (this.y > paddle.y) {
				this.dirY *= -1;
				this.canMove = false;
				setTimeout(() => { this.canMove = true }, 1000);
			}
			if (this.x <= this.r || this.x >= canvas.width - this.r) this.dirX *= -1;
			if (this.y <= this.r || this.y >= paddle.y - this.r && this.x >= paddle.x && this.x <= paddle.x + paddle.width) this.dirY *= -1;
		} else {
			this.x = paddle.x + paddle.width / 2;
			this.y = paddle.y - this.r;
		}
	}

	draw() {
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fillStyle = "white";
		ctx.fill();
	}

	reset() {
		this.x = paddle.x + paddle.width / 2;
		this.y = paddle.y - this.r;
	}
}

class Brick {
	constructor(x, y) {
		this.width = 30;
		this.height = 10;
		this.x = x + this.width / 2;
		this.y = y + this.width / 2;
		this.hit = false
	}

	isHit() {
		if (ball.x + ball.r >= this.x && ball.x - ball.r <= this.x + this.width && ball.y + ball.r >= this.y && ball.y - ball.r <= this.y + this.height) {
			this.hit = true;
			if (ball.y > this.y && ball.y < this.y + this.height) {
				ball.dirX *= -1;
			} else {
				ball.dirY *= -1;
			}
		}
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

let paddle = new Paddle();
let ball = new Ball();
let bricks = [];

function setBricks() {
	for (let y = 0; y < 2; y++) {
		bricks[y] = [];
		for (let x = 0; x < 7; x++) {
			bricks[y][x] = new Brick(x * 40, y * 20);
		}
	}
}

let keys = {};
document.addEventListener("keydown", (a) => { keys[a.which] = true; });
document.addEventListener("keyup", (a) => { keys[a.which] = false; });

setBricks();
let allHit;
setInterval(() => {
	allHit = true;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	paddle.move();
	paddle.draw();
	ball.move();
	ball.draw();
	for (y in bricks) {
		for (x in bricks[y]) {
			if (!bricks[y][x].hit) {
				allHit = false;
				bricks[y][x].isHit();
				bricks[y][x].draw();
			}
		}
	}
	if (allHit) {
		setBricks();
		ball.reset();
	}

}, 10)

window.addEventListener("keydown", function (a) {
	if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(a.code)) {
		a.preventDefault();
	}
}, false);
