let maze = [];
let genType = "recursiveBacktrack";
let gridSize = 20;
let generators;
let mazeGen;

function setup() {
	createCanvas(400, 400);
	frameRate(20);
	noStroke();

	generators = new Generators();
	mazeGen = generators[genType]();
	clearMaze();
}

function draw() {
	mazeCurrent = mazeGen.next();
	if (!mazeCurrent.done) {
		background("#D8DEE9");
		drawMaze(mazeCurrent.value);
	}
}

function clearMaze() {
	maze = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
}

function drawMaze(toDraw) {
	toDraw.forEach((row, y) => {
		row.forEach((cell, x) => {
			if (cell) {
				fill("#D8DEE9");
			} else {
				fill("#2E3440");
			}
			rect(x * (400 / gridSize), y * (400 / gridSize), 400 / gridSize, 400 / gridSize);
		});
	});
}

class Generators {
	*recursiveBacktrack() {
		let directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

		function* carve(x, y) {
			maze[y][x] = true;
			yield maze;

			for (let [dx, dy] of shuffle(directions)) {
				let nx = x + dx * 2;
				let ny = y + dy * 2;

				if (nx >= 0 && nx < 400/gridSize && ny >= 0 && ny < 400/gridSize && !maze[ny][nx]) {
					maze[y + dy][x + dx] = true;
					yield* carve(nx, ny);
				}
			}
		}

		yield* carve(0, 0);
	}
}

$("#gen-type").on("change", () => {
	genType = $("#gen-type").val();
	mazeGen = generators[genType]();
})
