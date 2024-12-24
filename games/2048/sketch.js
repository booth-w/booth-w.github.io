function setup() {
	let canvas = createCanvas(400, 400);
	canvas.parent("canvas");
	textAlign(CENTER, CENTER);
	textSize(32);
	noLoop();
	redraw();
	board = new Board();
	board.addTile();
	board.addTile();
}

function draw() {
	background("#eeeeee");
	board.draw();
}

class Board {
	constructor() {
    this.tiles = Array(4).fill().map(() => Array(4).fill(new Tile(0)));
		this.score = 0;
		this.history = [];
	}

	draw() {
		this.tiles.forEach((row, y) => {
			row.forEach((tile, x) => {
				tile.draw(x, y);
			});
		});
		$("#score").text(`Score: ${this.score}`);
	}

	move(dir) {
		let moved = false;
		let rotated = this.rotate(dir);
		let tilesOld = this.tiles.map((row) => row.map((tile) => new Tile(tile.value)));
		let scoreOld = this.score;

		for (let x = 0; x < 4; x++) {
			for (let y = 1; y < 4; y++) {
				if (rotated[y][x].value != 0) {
					while (y > 0 && rotated[y - 1][x].value == 0) {
						rotated[y - 1][x] = rotated[y][x];
						rotated[y][x] = new Tile(0);
						y--;
						moved = true;
					}
					if (y > 0 && rotated[y - 1][x].value == rotated[y][x].value) {
						rotated[y - 1][x] = new Tile(rotated[y - 1][x].value * 2);
						this.score += rotated[y - 1][x].value;
						rotated[y][x] = new Tile(0);
						moved = true;
					}
				}
			}
		}

		this.tiles = rotated.map((row) => row.filter((tile) => new Tile(tile.value)));
		this.tiles = this.rotate(4 - dir);
		if (moved) {
			this.addTile();
			this.history.push({
				tiles: tilesOld,
				score: scoreOld
			});
		}
		redraw();
	}

	rotate(amount) {
		let tilesNew = this.tiles.map((row) => row.map((tile) => new Tile(tile.value)));
		for (let a = 0; a < amount; a++) {
			let tilesTemp = tilesNew.map((row) => row.map((tile) => new Tile(tile.value)));
			for (let y = 0; y < 4; y++) {
				for (let x = 0; x < 4; x++) {
					tilesNew[y][x] = tilesTemp[4-1-x][y];
				}
			}
		}
		return tilesNew;
	}

	addTile() {
		let x = Math.floor(Math.random() * 4);
		let y = Math.floor(Math.random() * 4);
		if (this.tiles[y][x].value == 0) {
			this.tiles[y][x] = new Tile(Math.random() <= 0.8 ? 2 : 4);
		} else {
			this.addTile();
		}
	}

	undo() {
		if (this.history.length > 0) {
			let lastMove = this.history.pop();
			this.tiles = lastMove.tiles;
			this.score = lastMove.score;
			redraw();
		}
	}
}

class Tile {
	constructor(value) {
		this.value = value;
	}

	draw(x, y) {
		noFill();
		rect(x * 100, y * 100, 100, 100);
		fill(0);
		if (this.value != 0) text(this.value, x * 100 + 50, y * 100 + 50);
	}
}

let board;

function keyPressed() {
	switch (keyCode) {
		case UP_ARROW:
			board.move(0);
			break;
		case LEFT_ARROW:
			board.move(1);
			break;
		case DOWN_ARROW:
			board.move(2);
			break;
		case RIGHT_ARROW:
			board.move(3);
			break;
	}
}

$("#undo-button").click(() => {
	board.undo();
});
