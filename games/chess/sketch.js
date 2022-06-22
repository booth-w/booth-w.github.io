function setup() {
	createCanvas(400, 400);
}

function draw() {
	backgrond(100);
}

class Piece {
	constructor(x, y, colour) {
		this.x = x;
		this.y = y;
		this.colour = colour;
	}

	draw() {

	}
}

class Pawn extends Piece {
	move() {

	}
}

class Rook extends Piece {
	move() {

	}
}

class Bishop extends Piece {
	move() {

	}
}

class Knight extends Piece {
	move() {

	}
}

class King extends Piece {
	move() {

	}
}

class Queen extends Piece {
	move() {

	}
}

class Board {
	board = [];
	boardTemp = [];
}