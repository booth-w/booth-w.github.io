function setup() {
	createCanvas(320, 400);
	tetris = new Tetris();
}

function draw() {
	stroke(51);
	fill(51);
	rect(0, 0, 200, 400);
	stroke(0);
	tetris.update();
	tetris.draw();
	tetris.drawNext();
}

class Tetris {
	constructor() {
		this.grid = [];
		this.gridActive = [];
		this.gridGhost = [];
		for (let y = 0; y < 20; y++) {
			this.grid.push([]);
			this.gridActive.push([]);
			this.gridGhost.push([]);
			for (let x = 0; x < 10; x++) {
				this.grid[y].push(0);
				this.gridActive[y].push(0);
				this.gridGhost[y].push(0);
			}
		}
		this.fallSpeed = 5;
		this.pieceNext = new piece();
		this.lines = 0;
	}

	update() {
		// new piece
		if (this.piece == null) {
			// check for lines
			for (let y = 0; y < 20; y++) {
				let line = true;
				for (let x = 0; x < 10; x++) {
					if (!this.grid[y][x]) {
						line = false;
					}
				}
				if (line) {
					this.lines++;
					// remove line
					for (let x = 0; x < 10; x++) {
						this.grid[y][x] = 0;
					}
					// move down
					for (let y2 = y; y2 > 0; y2--) {
						for (let x = 0; x < 10; x++) {
							this.grid[y2][x] = this.grid[y2 - 1][x];
							this.grid[y2 - 1][x] = 0;
						}
					}
				}
			}
			this.piece = this.pieceNext;
			this.pieceNext = new piece();
			// add to grid
			for (let y = 0; y < this.piece.shape.length; y++) {
				for (let x = 0; x < this.piece.shape[y].length; x++) {
					if (this.grid[y][x + 3]) {
						// top out
						alert(`Lines cleared: ${this.lines}`);
						tetris = new Tetris();
						return;
					}
					if (this.piece.shape[y][x]) {
						this.gridActive[y][x + 3] = 1;
					}
				}
			}
		}

		// move down
		if (frameCount % (60 / this.fallSpeed) < 1) {
			// check if can move down
			let canMove = true;
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (this.gridActive[y][x]) {
						try {
							if (y == 19 || this.grid[y + 1][x]) {
								canMove = false;
							}
						} catch {}
					}
				}
			}
			// move down if can
			if (canMove) {
				for (let y = 19; y >= 0; y--) {
					for (let x = 0; x < 10; x++) {
						if (this.gridActive[y][x]) {
							this.gridActive[y][x] = 0;
							this.gridActive[y + 1][x] = 1;
							// this.grid[y + 1][x] = this.grid[y][x];
							// this.grid[y][x] = 0;
						}
					}
				}
				this.piece.pos.y++;
			} else {
				// add to grid
				for (let y = 0; y < this.piece.shape.length; y++) {
					for (let x = 0; x < this.piece.shape[y].length; x++) {
						if (this.piece.shape[y][x]) {
							this.grid[y + this.piece.pos.y][x + this.piece.pos.x] = this.piece.piece + 1;
						}
					}
				}
				// set to inactive
				for (let y = 0; y < 20; y++) {
					for (let x = 0; x < 10; x++) {
						if (this.gridActive[y][x]) {
							this.gridActive[y][x] = 0;
						}
					}
				}
				// clear piece
				this.piece = null;
			}
		}

		// ghost
		this.gridGhost = JSON.parse(JSON.stringify(this.gridActive));

		// move ghost down until it hits something
		while (true) {
			// check if can move down
			let canMove = true;
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (this.gridGhost[y][x]) {
						try {
							if (y == 19 || this.grid[y + 1][x] && !this.gridActive[y + 1][x] && !this.gridGhost[y + 1][x]) {
								canMove = false;
							}
						} catch {
							canMove = false;
						}
					}
				}
			}
			// move down if can
			if (canMove) {
				for (let y = 19; y >= 0; y--) {
					for (let x = 0; x < 10; x++) {
						if (this.gridGhost[y][x]) {
							this.gridGhost[y][x] = 0;
							this.gridGhost[y + 1][x] = 1;
						}
					}
				}
				// break if did not move
				if (JSON.stringify(this.gridGhost) == JSON.stringify(this.gridActive)) break;
			} else {
				break;
			}
		}
	}

	keyPressed() {
		if (keyCode == LEFT_ARROW) {
			// check if can move left
			let canMove = true;
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (this.gridActive[y][x]) {
						try {
							if (x == 0 || this.grid[y][x - 1]) {
								canMove = false;
							}
						} catch {}
					}
				}
			}
			// move left
			if (canMove) {
				for (let y = 0; y < 20; y++) {
					for (let x = 0; x < 10; x++) {
						if (this.gridActive[y][x]) {
							this.gridActive[y][x] = 0;
							this.gridActive[y][x - 1] = 1;
						}
					}
				}
				this.piece.pos.x--;
			}
		} else if (keyCode == RIGHT_ARROW) {
			// check if can move right
			let canMove = true;
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (this.gridActive[y][x]) {
						try {
							if (x == 9 || this.grid[y][x + 1]) {
								canMove = false;
							}
						} catch {}
					}
				}
			}
			// move right
			if (canMove) {
				for (let y = 0; y < 20; y++) {
					for (let x = 9; x >= 0; x--) {
						if (this.gridActive[y][x]) {
							this.gridActive[y][x] = 0;
							this.gridActive[y][x + 1] = 1;
						}
					}
				}
				this.piece.pos.x++;
			}
		} else if (keyCode == UP_ARROW) {
			// rotate
			this.piece.rotation++;
			let newGridActive = [];
			for (let y = 0; y < 20; y++) {
				newGridActive.push([]);
				for (let x = 0; x < 10; x++) {
					newGridActive[y].push(0);
				}
			}
			let canRotate = true;
			loop:
			for (let y = 0; y < this.piece.shape.length; y++) {
				for (let x = 0; x < this.piece.shape[y].length; x++) {
					if (this.piece.shape[y][x]) {
						if (this.piece.pos.x + x < 0 || this.piece.pos.x + x > 9 || this.piece.pos.y + y < 0 || this.piece.pos.y + y > 19) {
							canRotate = false;
							break loop;
						}
					}
					if (this.piece.shape[y][x]) {
						newGridActive[y + this.piece.pos.y][x + this.piece.pos.x] = 1;
					}
				}
			}
			loop:
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (newGridActive[y][x] && this.grid[y][x]) {
						canRotate = false;
						break loop;
					}
				}
			}
			if (canRotate) {
				this.gridActive = newGridActive;
			} else {
				this.piece.rotation--;
			}
		} else if (key == " ") {
			// hard drop
			for (let y = 0; y < 20; y++) {
				for (let x = 0; x < 10; x++) {
					if (this.gridActive[y][x]) {
						this.gridActive[y][x] = 0;
					}
					if (this.gridGhost[y][x]) {
						this.grid[y][x] = this.piece.piece + 1;
					}
				}
			}
			this.piece = null;
		}
	}

	draw() {
		for (let y = 0; y < 20; y++) {
			for (let x = 0; x < 10; x++) {
				if (this.grid[y][x]) {
					fill(this.pieceNext.colours[this.grid[y][x] - 1])
					rect(x * 20, y * 20, 20, 20);
				} else if (this.gridActive[y][x]) {
					fill(this.piece.colours[this.piece.piece])
					rect(x * 20, y * 20, 20, 20);
				} else if (this.gridGhost[y][x]) {
					fill(this.piece.colours[this.piece.piece][0], this.piece.colours[this.piece.piece][1], this.piece.colours[this.piece.piece][2], 100)
					rect(x * 20, y * 20, 20, 20);
				}
			}
		}
	}

	drawNext() {
		// draw the next box
		stroke(51);
		fill(51);
		rect(200, 0, 120, 100);
		stroke(0);
		// draw the next piece
		for (let y = 0; y < this.pieceNext.shape.length; y++) {
			for (let x = 0; x < this.pieceNext.shape[y].length; x++) {
				if (this.pieceNext.shape[y][x]) {
					fill(this.pieceNext.colours[this.pieceNext.piece])
					rect(220 + x * 20, y * 20, 20, 20);
				}
			}
		}
	}
}

class piece {
	constructor() {
		this.piece = floor(random(7));
		this.rotation = 0;
		this.shapes = [
			[
				[
					[0, 0, 0, 0],
					[0, 1, 1, 0],
					[0, 1, 1, 0],
					[0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0],
					[0, 1, 1, 0],
					[0, 1, 1, 0],
					[0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0],
					[0, 1, 1, 0],
					[0, 1, 1, 0],
					[0, 0, 0, 0]
				],
				[
					[0, 0, 0, 0],
					[0, 1, 1, 0],
					[0, 1, 1, 0],
					[0, 0, 0, 0]
				]
			],
			[
				[
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0]
				],
				[
					[0, 0, 1, 0],
					[0, 0, 1, 0],
					[0, 0, 1, 0],
					[0, 0, 1, 0]
				],
				[
					[0, 0, 0, 0],
					[0, 0, 0, 0],
					[1, 1, 1, 1],
					[0, 0, 0, 0]
				],
				[
					[0, 0, 1, 0],
					[0, 0, 1, 0],
					[0, 0, 1, 0],
					[0, 0, 1, 0]
				]
			],
			[
				[
					[0, 0, 0],
					[1, 1, 1],
					[0, 1, 0]
				],
				[
					[0, 1, 0],
					[1, 1, 0],
					[0, 1, 0]
				],
				[
					[0, 1, 0],
					[1, 1, 1],
					[0, 0, 0]
				],
				[
					[0, 1, 0],
					[0, 1, 1],
					[0, 1, 0]
				]
			],
			[
				[
					[0, 0, 0],
					[1, 1, 1],
					[1, 0, 0]
				],
				[
					[1, 1, 0],
					[0, 1, 0],
					[0, 1, 0]
				],
				[
					[0, 0, 1],
					[1, 1, 1],
					[0, 0, 0]
				],
				[
					[0, 1, 0],
					[0, 1, 0],
					[0, 1, 1]
				]
			],
			[
				[
					[0, 0, 0],
					[1, 1, 1],
					[0, 0, 1]
				],
				[
					[0, 1, 0],
					[0, 1, 0],
					[1, 1, 0]
				],
				[
					[1, 0, 0],
					[1, 1, 1],
					[0, 0, 0]
				],
				[
					[0, 1, 1],
					[0, 1, 0],
					[0, 1, 0]
				]
			],
			[
				[
					[0, 0, 0],
					[1, 1, 0],
					[0, 1, 1]
				],
				[
					[0, 0, 1],
					[0, 1, 1],
					[0, 1, 0]
				],
				[
					[0, 0, 0],
					[1, 1, 0],
					[0, 1, 1]
				],
				[
					[0, 0, 1],
					[0, 1, 1],
					[0, 1, 0]
				]
			],
			[
				[
					[0, 0, 0],
					[0, 1, 1],
					[1, 1, 0]
				],
				[
					[0, 1, 0],
					[0, 1, 1],
					[0, 0, 1]
				],
				[
					[0, 0, 0],
					[0, 1, 1],
					[1, 1, 0]
				],
				[
					[0, 1, 0],
					[0, 1, 1],
					[0, 0, 1]
				]
			]
		];
		this.colours = [
			[255, 0, 0],
			[0, 255, 0],
			[0, 0, 255],
			[255, 255, 0],
			[255, 0, 255],
			[0, 255, 255],
			[255, 255, 255]
		];
		this.pos = createVector(3, 0);
	}

	get shape() {
		return this.shapes[this.piece][this.rotation % 4];
	}
}

let tetris;

function keyPressed() {
	tetris.keyPressed();
}