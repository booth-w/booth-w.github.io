let isRunning = false;
let tiles = [];
let gridSize = 20;
let speed = 5;
let randomDensity = 0.3;
let usingMoore = true;

function setup() {
	let cnv = createCanvas(400, 400);
	cnv.parent("canvas");
	noStroke();

	$("#speed-label").text(speed);
	$("#grid-size-label").text(gridSize);
	$("#random-density-label").text(randomDensity * 100);

	resetGrid(true);
}

function draw() {
	background("#4C566A");
	if (isRunning && frameCount % (11 - speed) == 0) {
		runIteration();
	}

	tiles.forEach(tile => {
		tile.draw();
	});
}

function runIteration() {
	let newTiles = tiles.map(tile => new Tile(tile.pos, tile.alive));

	tiles.forEach((tile, index) => {
		let neighbours = tile.getNeighbours(usingMoore);
		if (neighbours < 2 || neighbours > 3) {
			newTiles[index].alive = false;
		} else if (neighbours == 3) {
			newTiles[index].alive = true;
		}
	});

	tiles = newTiles;
}

function resetGrid(random = false) {
	tiles = [];

	for (let y = 0; y < gridSize; y++) {
		for (let x = 0; x < gridSize; x++) {
			tiles.push(new Tile(createVector(x, y), false));
		}
	}

	if (random) {
		tiles.forEach(tile => {
			tile.alive = Math.random() < randomDensity;
		});
	}
}

class Tile {
	constructor(pos, alive) {
		this.alive = alive;
		this.pos = pos;
	}

	draw() {
		let rectSize = 400 / gridSize;
		fill(this.alive ? "#88C0D0" : "#4C566A");
		rect(this.pos.x * rectSize, this.pos.y * rectSize, rectSize, rectSize);
	}

	getNeighbours(moore) {
		let neighbours = 0
		for (let y = -1; y <= 1; y++) {
			for (let x = -1; x <= 1; x++) {
				if (!moore && x && y) continue;
				if (x == 0 && y == 0) continue;

				let nX = this.pos.x + x;
				let nY = this.pos.y + y;

				if (nX >= 0 && nX < gridSize && nY >= 0 && nY < gridSize) {
					if (tiles[nY * gridSize + nX].alive) {
						neighbours++;
					}
				}
			}
		}

		return neighbours;
	}
}

$("#start-button").click(() => {
	isRunning = true;
});

$("#stop-button").click(() => {
	isRunning = false;
});

$("#clear-button").click(() => {
	resetGrid();
});

$("#random-button").click(() => {
	resetGrid(true);
});

$("#speed").on("input", () => {
	speed = $("#speed").val();
	$("#speed-label").text(speed);
});

$("#grid-size").on("input", () => {
	gridSize = $("#grid-size").val();
	$("#grid-size-label").text(gridSize);
	resetGrid(true);
});

$("#random-density").on("input", () => {
	randomDensity = $("#random-density").val() / 100;
	$("#random-density-label").text(randomDensity * 100);
	resetGrid(true);
});

$("#neighbourhood-type").on("change", () => {
	usingMoore = $("#neighbourhood-type").val() == "moore";
	resetGrid(true);
});
