if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
	$(".game").append("<div>This game can't be played on mobile</div>");
	$("canvas").hide();
	$(".scores-container").hide();
}

let canvas = document.getElementById("pong");
let ctx = canvas.getContext("2d");

class Paddle {
	constructor(x, up, dn) {
		this.x = x;
		this.y = canvas.height / 2 - 12;
		this.up = up;
		this.dn = dn;
		this.score = 0
	}

	move() {
		if (keys[this.up] && this.y > 0) this.y--;
		if (keys[this.dn] && this.y < canvas.height - 25) this.y++;
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, 5, 25);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

class Ball {
	constructor(x, y, dirX, dirY, speed) {
		this.x = x;
		this.y = y;
		this.dirX = dirX;
		this.dirY = dirY;
		this.speed = speed
		this.isMoving = false;
	}

	move() {
		if (this.x < 15) {
			if (this.y + 5 > paddles[0].y && this.y < paddles[0].y + 25) {
				this.dirX *= -1
				this.speed += 0.1
			} else {
				paddles[1].score++;
				document.getElementById("player 1").innerHTML = paddles[1].score;
				this.x = canvas.width / 2;
				this.y = canvas.height / 2;
				this.speed = 1;
				this.isMoving = false;
				setTimeout(() => { this.isMoving = true; }, 1000)
			}
		} else if (this.x > canvas.width - 20) {
			if (this.y + 5 > paddles[1].y && this.y < paddles[1].y + 25) {
				this.dirX *= -1
				this.speed += 0.1
			} else {
				paddles[0].score++;
				document.getElementById("player 0").innerHTML = paddles[0].score;
				this.x = canvas.width / 2;
				this.y = canvas.height / 2;
				this.speed = 1;
				this.isMoving = false;
				setTimeout(() => { this.isMoving = true; }, 1000)
			}
		}

		if (this.y < 0) this.dirY *= -1
		else if (this.y > canvas.height - 5) this.dirY *= -1

		this.x += this.dirX * this.speed;
		this.y += this.dirY * this.speed;
	}

	draw() {
		ctx.beginPath();
		ctx.rect(this.x, this.y, 5, 5);
		ctx.fillStyle = "white";
		ctx.fill();
		ctx.closePath();
	}
}

let keys = {};
document.addEventListener("keydown", (a) => { keys[a.which] = true; });
document.addEventListener("keyup", (a) => { keys[a.which] = false; });

let paddles = [];
paddles[0] = new Paddle(10, 87, 83);
paddles[1] = new Paddle(canvas.width - 15, 38, 40);

let ball = new Ball(canvas.width / 2, canvas.height / 2, 1, -.5, 1);
setTimeout(() => { ball.isMoving = true; }, 2000)


setInterval(() => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let a = 0; a < 2; a++) {
		paddles[a].move();
		paddles[a].draw();
	}
	if (ball.isMoving) ball.move();
	ball.draw();
}, 10)

window.addEventListener("keydown", function(a) {
	if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(a.code)) {
		a.preventDefault();
	}
}, false);