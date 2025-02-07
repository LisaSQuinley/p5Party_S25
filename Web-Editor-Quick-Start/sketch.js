// https://editor.p5js.org/LisaSQuinley/sketches/a96ks9dwH
// using Justin Bakse's tutorial to work on in first class and to experiment with, this was used to create the ASWD Keys Sketch

let shared;

function preload() {
	partyConnect(
		"wss://demoserver.p5party.org", 
		"basic_click"
	);
 
  shared = partyLoadShared("globals");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  shared.x = shared.x || 0; // set shared.x to 0, but only if it is not already defined
  shared.y = shared.y || 0;
  
  shared.size = shared.size || 100;
  
  shared.counter = shared.counter || 0;
  
  shared.color = color(random(255), random(255), random(255)).toString();
  
  rectMode(CENTER);
}

function mousePressed() {
  // write shared data
  shared.x = mouseX;
  shared.y = mouseY;
  
  shared.size = random(20,100);
  
  shared.counter++;
  
  shared.color = color(random(255), random(255), random(255)).toString();
}

function draw() {
  background("#ffcccc");
  fill(shared.color);
  noStroke();
  
  if(shared.counter % 10 === 0) {rect(shared.x, shared.y, shared.size);} else {
  ellipse(shared.x, shared.y, shared.size);
  }
  
  // ellipse(shared.x, shared.y, shared.size);
  fill("#fff");
  textAlign(CENTER, CENTER);
  textSize(20);
  text(shared.counter, shared.x, shared.y);
}