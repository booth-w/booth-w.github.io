let grid = [];
let hidden = [];
let flagged = [];
let size = 12;

function setup() {
	let canvasSize = 3 + (size) * 40 + (size) * 3
	createCanvas(canvasSize, canvasSize);
	for (let x = 0; x < size; x++) {
		grid[x] = [];
		hidden[x] = [];
		flagged[x] = [];
		for (y = 0; y < size; y++) {
			grid[x][y] = random(1) < .2;
			hidden[x][y] = true;
			flagged[x][y] = false;
		}
	}
	textAlign(CENTER);
	textSize(20);
	firstClicked = true;
	winAlertShown = false;
	fail = false
}

function draw() {
	background(255);
	allMinesFlagged = true;
	allNonMinesUncovered = true;
	for (x = 0; x < size; x++) {
		for (y = 0; y < size; y++) {
			if (grid[x][y] && !flagged[x][y]) {
				allMinesFlagged = false;
			}
			if (!grid[x][y] && !hidden[x][y]) {
				allNonMinesUncovered = false;
			}

			let n = 0;

			for (a = -1; a <= 1; a++) {
				if ((x === 0 && a === -1) || (x === size-1 && a === 1)) continue;
				for (b = -1; b <= 1; b++) {
					if ((y === 0 && b === -1) || (y === size-1 && b === 1)) continue;
					n += grid[x + a][y + b];

				}
			}
			if (n === 0 && !hidden[x][y]) {
				for (a = -1; a <= 1; a++) {
					if ((x === 0 && a === -1) || (x === size-1 && a === 1)) continue;
					for (b = -1; b <= 1; b++) {
						if ((y === 0 && b === -1) || (y === size-1 && b === 1)) continue;
						hidden[x + a][y + b] = false;
					}
				}
			}

			strokeWeight(4);
			if (hidden[x][y]) {
				if (flagged[x][y]) {
					fill(100);
				} else {
					fill(175);
				}
			} else if (grid[x][y]) {
				fill(50);
			} else {
				fill(255);
			}

			rect(3 + x * 40 + x * 3, 3 + y * 40 + y * 3, 40, 40);
			if (!grid[x][y] && !hidden[x][y]) {
				fill(0);
				if (n != 0) text(n, 3 + x * 40 + x * 3 + 20, 3 + y * 40 + y * 3 + 27);
			}
		}
	}
	if (allMinesFlagged && allNonMinesUncovered && !winAlertShown) {
		alert("you win\npress any key to retry");
		console.log("you win\npress any key to retry");
		winAlertShown = true;
	}
}

document.addEventListener("contextmenu", event => event.preventDefault());

function mousePressed() {
	let y = floor(mouseY / (43));
	let x = floor(mouseX / (43));

	if (!fail) {
		if (mouseButton === RIGHT) flagged[x][y] = !flagged[x][y]
		else if (!flagged[x][y] && mouseButton === LEFT) {
			if (firstClicked) { // first turn
				for (a = -1; a <= 1; a++) {
					if ((x === 0 && a === -1) || (x === size-1 && a === 1)) continue;
					for (b = -1; b <= 1; b++) {
						if ((y === 0 && b === -1) || (y === size-1 && b === 1)) continue;
						grid[x + a][y + b] = false;
						hidden[x + a][y + b] = false;
					}
				}
				firstClicked = false;
			} else {
				if (grid[x][y]) {
					for (x = 0; x < size; x++) {
						for (y = 0; y < size; y++) {
							if (grid[x][y]) {
								hidden[x][y] = false;
							}
						}
					}
					alert("you hit a mine\npress any key to retry");
					fail = true;
				} else hidden[x][y] = false;
			}
		}
		else if (!hidden[x][y] && mouseButton === CENTER) {
			n = 0;
			f = 0;
			for (a = -1; a <= 1; a++) {
				if ((x === 0 && a === -1) || (x === size-1 && a === 1)) continue;
				for (b = -1; b <= 1; b++) {
					if ((y === 0 && b === -1) || (y === size-1 && b === 1)) continue;
					n += grid[x + a][y + b];
					f += flagged[x + a][y + b]
				}
			}
			// console.log(n, f, x, y)
			if (n == f) {
				for (a = -1; a <= 1; a++) {
					if ((x === 0 && a === -1) || (x === size-1 && a === 1)) continue;
					for (b = -1; b <= 1; b++) {
						if ((y === 0 && b === -1) || (y === size-1 && b === 1)) continue;
						if (!flagged[x + a][y + b]) {
							hidden[x + a][y + b] = grid[x + a][y + b];
						}
						if (!grid[x + a][y + b] && flagged[x + a][y + b]) {
							for (x = 0; x < size; x++) {
								for (y = 0; y < size; y++) {
									if (grid[x][y]) {
										hidden[x][y] = false;
									}
								}
							}
							alert("you marked a mine incorrectly\npress any key to retry");
							console.log("you marked a mine incorrectly\npress any key to retry");
							fail = true;
						}
					}
				}
			}
		}
	}
}

function keyPressed() {
	for (x = 0; x < size; x++) {
		for (y = 0; y < size; y++) {
			grid[x][y] = random(1) < .2;
			hidden[x][y] = true;
			flagged[x][y] = false;
		}
	}
	firstClicked = true;
	winAlertShown = false;
	fail = false
}

