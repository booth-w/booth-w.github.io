function setup() {
	createCanvas(400, 400);
	fill(255);
	textAlign(CENTER);
	textSize(24);
}

function draw() {
	background(color("#161C2C"));
	board.display();
}

class Board {
	constructor() {
		this.board = [
			[new Rook("Black"), new Knight("Black"), new Bishop("Black"), new Queen("Black"), new King("Black"), new Bishop("Black"), new Knight("Black"), new Rook("Black")],
			[new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black"), new Pawn("Black")],
			[],
			[],
			[],
			[],
			[new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White"), new Pawn("White")],
			[new Rook("White"), new Knight("White"), new Bishop("White"), new Queen("White"), new King("White"), new Bishop("White"), new Knight("White"), new Rook("White")]
		];
		this.boardTemp = JSON.parse(JSON.stringify(this.board));
	}

	display() {
		for (let row = 0; row < 8; row++) {
			for (let col = 0; col < 8; col++) {
				fill(((row+col) % 2 == 0) ? color("#161C2C") : color("#1D2333"));
				rect(50*col, 50*row, 50);
				fill(255);
				if (this.board[row][col]) text(this.board[row][col].piece, 50 * (col+0.5), 50 * (row+0.5));
			}
		}
		if (possibleMoves) {
			stroke(255);
			for (let a of possibleMoves) {
				noFill();
				rect(50*a[1], 50*a[0], 50);
			}
			stroke(0);
		}
	}
}

class Piece {
	constructor(colour) {
		this.colour = colour;
		// On Mac, U+265F displays as an emoji
		this.pieces = {
			"King": {
				"Black": "♔",
				"White": "♚"
			},
			"Queen": {
				"Black": "♕",
				"White": "♛"
			},
			"Rook": {
				"Black": "♖",
				"White": "♜"
			},
			"Bishop": {
				"Black": "♗",
				"White": "♝"
			},
			"Knight": {
				"Black": "♘",
				"White": "♞"
			},
			"Pawn": {
				"Black": "♙",
				"White": "P"
			},
		}
	}
	
	draw() {
		
	}
}

class King extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["King"][this.colour];
		this.hasMoved = false;
	}

	getMoves() {

	}

	move(moves) {

	}
}

class Queen extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["Queen"][this.colour];
	}

	getMoves() {

	}

	move(moves) {

	}
}

class Rook extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["Rook"][this.colour];
	}

	getMoves() {

	}

	move(moves) {

	}
}

class Bishop extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["Bishop"][this.colour];
	}

	getMoves() {

	}

	move(moves) {

	}
}

class Knight extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["Knight"][this.colour];
	}

	getMoves() {

	}

	move(moves) {

	}
}

class Pawn extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = this.pieces["Pawn"][this.colour];
		this.hasMoved = false;
	}

	getMoves() {
		console.log(this.piece);
		let canMove = []
		// Attack
		try {
			if (board.board[selected[0]-((this.colour == "White")*2-1)][selected[1]-1].colour != this.colour) {
				canMove.push([selected[0]-((this.colour == "White")*2-1), selected[1]-1]);
			}
		} catch { }
		try {
			if (board.board[selected[0]-((this.colour == "White")*2-1)][selected[1]+1].colour != this.colour) {
				canMove.push([selected[0]-((this.colour == "White")*2-1), selected[1]+1]);
			}
		} catch { }	
		// Move
		if (!canMove.length) {
			if (!this.hasMoved && !board.board[selected[0]-((this.colour == "White")*2-1)*2][selected[1]]) {
				canMove.push([selected[0]-((this.colour == "White")*2-1)*2, selected[1]]);
			}
			if (!board.board[selected[0]-((this.colour == "White")*2-1)][selected[1]]) {
				canMove.push([selected[0]-((this.colour == "White")*2-1), selected[1]]);
			}
		}

		console.log(canMove);
		return canMove;
	}
}

let turn = 0;
let selected = null;
let possibleMoves = null;
let board = new Board();

function mousePressed() {
	let col = floor(mouseX/50);
	let row = floor(mouseY/50);

	if (selected) {
		for (let a of possibleMoves) {
			if (a[0] == row && a[1] == col) {
				board.board[selected[0]][selected[1]].hasMoved = true;
				board.board[row][col] = board.board[selected[0]][selected[1]];
				board.board[selected[0]][selected[1]] = undefined;
				turn++
			}
		}
		selected = null;
		possibleMoves = null;
	}

	if (turn%2 == 0 && board.board[row][col].colour == "White" || turn%2 == 1 && board.board[row][col].colour == "Black") {
		selected = [row, col];
		possibleMoves = board.board[row][col].getMoves();
	}
}