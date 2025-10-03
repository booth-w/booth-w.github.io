let maze = [];
let genType = "recursiveBacktrack";
let canvasSize = 420;
let gridSize = 21;
let generators;
let mazeGen;

function setup() {
	createCanvas(canvasSize, canvasSize);
	frameRate(20);
	noStroke();

	generators = new Generators();
	mazeGen = generators[genType]();
	clearMaze();
}

function draw() {
	let	mazeCurrent = mazeGen.next();
	if (!mazeCurrent.done) {
		background("#D8DEE9");
		drawMaze(mazeCurrent.value[0], mazeCurrent.value[1], mazeCurrent.value[2]);
	}
}

function clearMaze() {
	maze = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
}

function drawMaze(toDraw, currentX, currentY) {
	toDraw.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell) {
				fill("#D8DEE9");
			} else {
				fill("#2E3440");
			}
			if (x === currentX && y === currentY) {
				fill("#5E81AC");
			}
			rect(x * (canvasSize / gridSize), y * (canvasSize / gridSize), canvasSize / gridSize, canvasSize / gridSize);
		});
	});
}

class Generators {
	*recursiveBacktrack() {
		let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

		function* carve(x, y) {
			maze[y][x] = true;
			yield [maze, x, y];

			for (let [dx, dy] of shuffle(directions)) {
				let nx = x + dx * 2;
				let ny = y + dy * 2;

				if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !maze[ny][nx]) {
					maze[y + dy][x + dx] = true;
					yield [maze, x + dx, y + dy];
					yield* carve(nx, ny);
				}
			}
		}

		yield* carve(1, 1);
	}

	*prim() {
		let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
		let walls = [];
		maze[1][1] = true;

		function addWalls(x, y) {
			for (let [dx, dy] of directions) {
				let nx = x + dx * 2;
				let ny = y + dy * 2;
				if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && !maze[ny][nx]) {
					walls.push([x, y, nx, ny]);
				}
			}
		}

		addWalls(1, 1);
		yield [maze, 1, 1];

		while (walls.length > 1) {
			let wall = floor(random(walls.length));
			let [x, y, nx, ny] = walls[wall];
			walls.splice(wall, 1);
			if (!maze[ny][nx]) {
				maze[y + (ny - y) / 2][x + (nx - x) / 2] = true;
				yield [maze, x + (nx - x) / 2, y + (ny - y) / 2];
				maze[ny][nx] = true;
				yield [maze, nx, ny];
				addWalls(nx, ny);
			}
		}
	}
}

$("#gen-type").on("change", () => {
	genType = $("#gen-type").val();
	clearMaze();
	mazeGen = generators[genType]();
});
