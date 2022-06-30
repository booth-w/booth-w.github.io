let board;

function setup() {
	createCanvas(400, 400);
	fill(255);
	textAlign(CENTER);

	board = new Board();
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
				if (this.board[row][col]) text(this.board[row][col].piece, 50 * (col+0.5), 50 * (row+0.5));
			}
		}
	}
}

class Piece {
	constructor(colour) {
		this.colour = colour;
	}

	draw() {

	}
}

class Pawn extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "P";
	}

	move() {

	}
}

class Rook extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "R";
	}

	move() {

	}
}

class Bishop extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "B";
	}

	move() {

	}
}

class Knight extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "K";
	}

	move() {

	}
}

class King extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "K";
	}

	move() {

	}
}

class Queen extends Piece {
	constructor(colour) {
		super(colour);
		this.piece = "Q";
	}

	move() {

	}
}