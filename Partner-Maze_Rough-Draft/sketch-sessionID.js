// https://editor.p5js.org/LisaSQuinley/sketches/RsfbtTvUj (base)
// this is the attempt to set different room names based on the session ID, in the hopes that I can refresh the page

let shared;
let sessionID;


function generateSessionId() {
    return Date.now().toString() + Math.random().toString(36).substring(2);
}

function preload() {
    // Get or create session ID
    sessionId = localStorage.getItem('gameSessionId') || generateSessionId();
    localStorage.setItem('gameSessionId', sessionId);
    
    // Connect to party with unique room name based on session
    if (!shared) {
        partyConnect(
            "wss://demoserver.p5party.org", 
            "Partner-Maze-Game-" + sessionId
        );
    }
  shared = partyLoadShared("globals");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

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
  
  // Update the trail with the current position
  shared.trail.push({ x: shared.x, y: shared.y, size: shared.size, color: shared.color });

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    if (key === 'r') {
        // Generate new session ID
        sessionId = generateSessionId();
        localStorage.setItem('gameSessionId', sessionId);
        
        // Clear localStorage and reload page to force new connection
        localStorage.clear();
        window.location.reload();
    }
}