let levels;
let level;
let board;
let hints;
let xOff, yOff;
let undo = [];
let redo = [];

function setup() {
	// level = levels[1];
	let size = 10;
	level = new Array(size).fill().map(() => new Array(size));
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			level[y][x] = random(1) < .6;
		}
	}
	board = new Array(level.length).fill().map(() => new Array(level[0].length).fill(0));
	hints = getHints(level);
	xOff = Math.max(...hints["down"].map((e) => e.length));
	yOff = Math.max(...hints["across"].map((e) => e.length));
	createCanvas((level[0].length+xOff)*50, (level.length+yOff)*50);
	$(".p5Canvas").bind("contextmenu", false)
}

function draw() {
	background(255);
	fill(100);
	rect(0, 0, xOff*50, yOff*50);
	
	stroke(0);
	for (let x = 0; x < xOff; x++) {
		for (let y = 0; y < level.length; y++) {
			text(hints["down"][y][x], 50*x+25, (yOff+y+1)*50-25);
		}
	}
	for (let x = 0; x < level[0].length; x++) {
		for (let y = 0; y < yOff; y++) {
			text(hints["across"][x][y], (xOff+x+1)*50-25, 50*y+25);
		}
	}
	
	fill(0);
	for (let [yi, y] of board.entries()) {
		for (let [xi, x] of y.entries()) {
			stroke(0);
			fill(255, 0);
			if (x) {
				if (x == 2 || x == -1) {
					line((xi+xOff)*50, (yi+yOff)*50, (xi+xOff+1)*50, (yi+yOff+1)*50);
					line((xi+xOff+1)*50, (yi+yOff)*50, (xi+xOff)*50, (yi+yOff+1)*50);
				} else fill(0);
			}
			rect((xi+xOff)*50, (yi+yOff)*50, 50);
		}
	}
}

function preload() {
	levels = loadJSON("levels.json");
}

function getHints(level) {
	let hints = {"down": [], "across": []};
	
	for (let [yi, y] of level.entries()) {
		hints["down"].push([]);
		let toAdd = 0;
		for (let [xi, x] of y.entries()) {
			if (x) {
				toAdd++;
			} else if (toAdd) {
				hints["down"][yi].push(toAdd);
				toAdd = 0;
			}
		}
		if (toAdd) hints["down"][yi].push(toAdd);
	}
	
	for (let xi = 0; xi < level[0].length; xi++) {
		hints["across"].push([]);
		let toAdd = 0;
		for (let yi = 0; yi < level.length; yi++) {
			if (level[yi][xi]) {
				toAdd++;
			} else if (toAdd) {
				hints["across"][xi].push(toAdd);
				toAdd = 0;
			}
		}
		if (toAdd) hints["across"][xi].push(toAdd);
	}
	
	return hints;
}

function mousePressed() {
	let x = floor(mouseX/50) - xOff;
	let y = floor(mouseY/50) - yOff;
	undo.push([x, y, board[y][x]]);
	if (mouseButton == LEFT) board[y][x] = !board[y][x];
	if (mouseButton == RIGHT) board[y][x] = !board[y][x]*2;
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key == "z" || e.key == "Z")) {
		if (e.key == "z") {
			if (undo[0]) {
				let u = undo.pop();
				board[u[1]][u[0]] = u[2];
				redo.push(u);
			}
		} else if (redo[0]) {
			let r = redo.pop();
			// board[r[1]][r[0]] = ((r[2] == 0) ? 1 : (r[2] == 1 ? 0 : ));
			r[2] = (r[2]-1)*-1
			board[r[1]][r[0]] = r[2]
			undo.push(r)
		}
  }
});

// TODO
// Fix re-doing an undone cross turns to mark