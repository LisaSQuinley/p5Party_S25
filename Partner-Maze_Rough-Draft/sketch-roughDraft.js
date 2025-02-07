// https://editor.p5js.org/LisaSQuinley/sketches/RsfbtTvUj (base)
// this version sets up a long screen with trails of circles, but after a few times of sharing, it seems only one person has full control and whose trail is visible


let shared;
let screenHeight = 500;
let screenWidth = 1000;

function preload() {
    if (!shared) {
      // partyConnect(server, appName, [roomName], [callback])
        partyConnect(
            "wss://demoserver.p5party.org", 
            "Partner-Maze-Game",
            "Room 1"
        );
    }
  shared = partyLoadShared("globals");
}

function setup() {

  createCanvas(screenWidth, screenHeight);
  background(248);
  
  shared.speed = 3;
  
  shared.x = shared.x || 20; // set shared.x to 0, but only if it is not already defined
  shared.y = shared.y || 20;
  
  shared.size = shared.size || 15;
  
  shared.color = color(random(255), random(255), random(255)).toString();
  
  shared.trail = shared.trail || [];
/*
  fill("#cccccc");
  textAlign(CENTER, CENTER);
  textSize(30);
  text("Use your arrow keys or WASD to fill the screen before the other players do!", windowWidth/2, windowHeight/2);
  */
}

function mousePressed() {
  // write shared data
  shared.x = mouseX;
  shared.y = mouseY;
  
  // shared.size = random(20,100);
  
  shared.color = color(random(255), random(255), random(255)).toString();

    // Add the new circle to the trail
    shared.trail.push({ x: shared.x, y: shared.y, size: shared.size, color: shared.color });

}

function draw() {


  // Draw the entire trail
  for (let i = 0; i < shared.trail.length; i++) {
    let t = shared.trail[i];
    fill(t.color);
    noStroke();
    ellipse(t.x, t.y, t.size);
  }

  
  if (shared.x < 0) {
    shared.x = 0 + shared.size;
  }
  if (shared.x > screenWidth) {
    shared.x = screenWidth - shared.size;
  }
    if (shared.y < 0) {
    shared.y = 0 + shared.size;
  }
  if (shared.y > screenHeight) {
    shared.y = screenHeight - shared.size;
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
  
  // Update the trail with the current position
  shared.trail.push({ x: shared.x, y: shared.y, size: shared.size, color: shared.color });

}

function keyPressed() {
    if (key === 'r') {
        // Clear the shared data to reset the game state
        shared.trail = [];
        shared.x = 20;
        shared.y = 20;
        shared.size = 15;
        shared.color = color(random(255), random(255), random(255)).toString();

        // Reload the page to reset the environment fully
        window.location.reload();
    }
}