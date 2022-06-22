function setup() {
	let canvas = createCanvas(420, 360);
	canvas.parent("game");
	$("#game").append("<div id='winner' style='user-select: none'></div>");
}

function draw() {
	background(color("#161C2C"));
	board.display();
}
	
class Board {
	constructor(cols, rows) {
		this.cols = cols;
		this.rows = rows;
		this.board = [];
		this.boardTemp = [];
		// this.colours = ["white", "red", "yellow"];
		this.colours = ["#8E9199", "midnightblue", "crimson"];
		// this.colours = ["white", "rebeccapurple", "seagreen"];
	}

	display() {
		for (let a = 0; a < this.board.length; a++) {
			for (let b = 0; b < this.board[a].length; b++) {
				if (this.hasWon) {
					fill(this.colours[this.board[a][b]]);
				} else {
					let colour = color(this.colours[this.boardTemp[a][b]])
					if (this.colours[this.boardTemp[a][b]] != "white") colour.setAlpha(128 * (!!this.board[a][b] + 1));
					fill(colour);
				}
				ellipse(60 * (b + 0.5), 60 * (a + 0.5), 50);
			}
		}
	}

	create() {
		this.board = [];
		for (let a = 0; a < this.rows; a++) {
			this.board.push([]);
			for (let b = 0; b < this.cols; b++) {
				this.board[a].push(0);
			}
		}
		this.boardTemp = JSON.parse(JSON.stringify(this.board));
	}
}

class Player {
	constructor(name, number) {
		this.name = name;
		this.number = number;
	}

	makeMove() {
		let x = floor(mouseX / 60);
		let y = 0;

		// Why are arrays like this?
		board.boardTemp = JSON.parse(JSON.stringify(board.board));
		if (x >= 0 && x <= 6) {
			try {
				while (board.board[5 - y][x]) {
					y++;
				}
				board.boardTemp[5 - y][x] = this.number;
			} catch (TypeError) { }
		}
		this.checkWinner();
	}

	checkWinner() {
		for (let x = 0; x < board.cols; x++) {
			for (let y = 0; y < board.rows; y++) {
				let isSame = true;

				for (let dirX = -1; dirX <= 1; dirX++) {
					for (let dirY = -1; dirY <= 1; dirY++) {
						if (dirX == 0 && dirY == 0) {
							continue;
						}
						isSame = true;
						try {
							for (let b = 0; b < 4; b++) {
								if (board.board[y + dirY * b][x + dirX * b] != this.number) {
									isSame = false;
									break;
								}
							}
						} catch { isSame = false; }
						if (isSame) {
							document.getElementById("winner").innerHTML = `${this.name} is the winner`;
							// If another player wins before the three seconds are up, the timer is not reset;
							setTimeout(() => {document.getElementById("winner").innerHTML = "";}, 3000);
							board.create();
						}
					}
				}
			}
		}
	}
}

class Bot extends Player {
	makeMove() {
		this.randomMove();
		// this.lowestPos();

		this.checkWinner();
	}
	
	randomMove() {
		let x;
		while (1) {
			x = Math.floor(Math.random() * board.cols);
			if (!board.board[0][x]) break;
		}
		let y = 0;

		if (x >= 0 && x <= 6) {
			try {
				while (board.board[5 - y][x]) {
					y++;
				}
				board.board[5 - y][x] = this.number;
			} catch (TypeError) { }
		}
		turn++;
	}

	lowestPos() {
		let x = 0;
		let y = 0;
		let canMove = [];
		let reversed = JSON.parse(JSON.stringify(board.board)).reverse()
		for (let a in reversed) {
			y = 5-a;
			for (let b in reversed[a]) {
				if (!reversed[a][b]) canMove.push(b);
			}
			if (canMove.some(e => e)) break;
		}
		x = canMove[Math.floor(Math.random() * canMove.length)];
		board.board[y][x] = this.number;
		// turn++;
	}
}

let board = new Board(7, 6);
let player0 = new Player("Player 1", 1);
// let player1 = new Player("Player 2", 2);
let player1 = new Bot("Bot", 2);
let turn = 0;

board.create();

function mouseMoved() {
	eval(`player${turn % 2}.makeMove()`);
}

function mousePressed() {
	board.board = JSON.parse(JSON.stringify(board.boardTemp));
	turn++;
	eval(`player${turn % 2}.makeMove()`);
	eval(`player${turn % 2}.makeMove()`);
	console.log(turn);
}