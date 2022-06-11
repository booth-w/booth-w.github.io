function setup() {
	createCanvas(200, 200);
	wave = new p5.Ocillator();
	wave.setType("sine");
	wave.amp(1);
	wave.freq(300);
	wave.play();	
}

function draw() {
	background(255);
}