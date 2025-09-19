let isRunning = false;
let tiles = [];
let gridSize = 20;
let speed = 5;
let randomDensity = 0.3;

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

	tiles.forEach(tile => {
		tile.draw();
	});
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

	getNeighbours() {

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
