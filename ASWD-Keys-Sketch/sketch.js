// https://editor.p5js.org/LisaSQuinley/sketches/luBTeLvla

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

  shared.speed = 10;
  
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
  
  if (shared.x < 0) {
    shared.x = 0 + shared.size;
  }
  if (shared.x > windowWidth) {
    shared.x = windowWidth - shared.size;
  }
    if (shared.y < 0) {
    shared.y = 0 + shared.size;
  }
  if (shared.y > windowHeight) {
    shared.y = windowHeight - shared.size;
  }
  
  if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // used ASCII 87 for W
    shared.y = shared.y - shared.speed;
  }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // used ASCII 83 for S
    shared.y = shared.y + shared.speed;
  }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // used ASCII 65 for A
    shared.x = shared.x - shared.speed;
  }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // used ASCII 68 for D
    shared.x = shared.x + shared.speed;
  }
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  
  if (key === 'r') {
    shared.counter = 0;
    window.location.reload();
}
}