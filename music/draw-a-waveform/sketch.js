let wave;
let isPlaying = false;

function setup() {
	let canvas = createCanvas(200, 200);
	canvas.parent("game");
	$("#game").append("<div id='winner' style='user-select: none'></div>");

	wave = new p5.Oscillator();
	wave.setType("sine");
	wave.amp(1);
	wave.freq(220);
}

function draw() {
	background(255);
}

function mousePressed() {
	if (isPlaying) {
		wave.stop();
		isPlaying = false;
	} else {
		wave.start();
		isPlaying = true;
	}
}