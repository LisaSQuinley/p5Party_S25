// declare variable for shared object
let shared;

function preload() {
// connect to the p5.party server
  partyConnect("wss://demoserver.p5party.org", "host_timer");

// load the shared object
  shared = partyLoadShared("shared");
}

function setup() {
  createCanvas(400, 400);
  noStroke();
  textAlign(CENTER, CENTER);

// set frameRate to 60 frames per second
  frameRate(60);

 
// check if this client is the host
  console.log("hi1");
  if (partyIsHost()) {
    console.log("hi2");
// set the intial values on the shared object
    partySetShared(shared, { circles: [], timer: 5 });
  }
}

function mousePressed() {
// push mouse coordinates into the `shared.circles` array
  shared.circles.push({ x: mouseX, y: mouseY });
}

function draw() {
  background("#ffcccc");
  fill("#000066");


// check if this client is the host
  if (partyIsHost()) {
// reduce `shared.timer` by 1 every 60 frames
    if (frameCount % 60 === 0) {
      shared.timer--;
    }

// reset the shared object when timer reaches 0
    if (shared.timer === 0) {
      partySetShared(shared, { circles: [], timer: 5 });
    }
  }

// iterate through all coordinates in the shared circles array
  for (const circle of shared.circles) {
// draw a circle at the current set of coordinates
    ellipse(circle.x, circle.y, 20, 20);
  }

// draw the value of the timer
  textSize(30);
  text(shared.timer, width / 2, 40);
}


/**
 * Q+A
 *
 * In the code above:
 *
 * 1) Do all connected clients read from the shared object?
 * yes
 * 2) Do all connected clients write to the shared object?
 * yes, shared.circles
 * 3) Is it possible that two clients will write to the shared object at one time?
 * yes
 * 4) What would happen if two clients write to the shared object at one time?
 * write conflict
 * 5) Do all clients write to the shared.timer property?
 * no - only host
 * 6) Do all clients read the shared.timer property?
 * yes
 * 7) When a new client joins a room which already has a host, will the timer be reset?
 * no - only host writes to timer
 * 8) When the host leaves the room, but other clients still remain, will the timer continue to decrease?
 * 
 */
