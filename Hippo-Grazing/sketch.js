// https://editor.p5js.org/LisaSQuinley/sketches/qdJEEl1ZX
// Hippo Grazing which is a sketch based off the Partner Maze one I created previously
// ChatGPT helped out with cleaning up a lot of my code

let shared;
let screenHeight = 1000;
let screenWidth = 1000;
let bananaCount = 0;
let watermelonCount = 0;

let keyPressedStatus = {
  up: false,
  down: false,
  left: false,
  right: false
};

let xScale = 0.015;
let yScale = 0.02;

let gap = 10;  // Set a fixed gap value
let offset = 0; // Set a fixed offset value

let fruits = [];

function preload() {
    if (!shared) {
        // partyConnect(server, appName, [roomName], [callback])
        partyConnect(
            "wss://demoserver.p5party.org", 
            "Hippo Grazing",
            "main"
        );
    }
    shared = partyLoadShared("globals");
    hippo = loadImage('hippo.png');
    banana = loadImage('banana.png');
    watermelon = loadImage('watermelon.png');
}

function setup() {
    partyToggleInfo(true);
  
    createCanvas(screenWidth, screenHeight);
    background(248);

    // Log detailed information about the host
    if (partyIsHost()) {
        console.log("This player is the HOST.");
    } else {
        console.log("This player is a GUEST.");
    }

    if (partyIsHost()) {
        partySetShared(shared, {score: 0});
    }
  
    shared.speed = 50; // Set the distance per key press (distance per step)
  
    shared.x = shared.x || 975; 
    shared.y = shared.y || 975;
  
    shared.size = shared.size || 45;
    
    generateNoiseBackground();


    // Create random positions for the fruits (watermelon and banana)
    let fruitPositions = new Set();  // To store unique grid positions
    for (let i = 0; i < 20; i++) {  // Place 10 random fruits
        let fruit;
        let x, y;
        
        // Keep trying until we find a non-overlapping position
        do {
            x = Math.floor(random(1, (screenWidth / 50))) * 50 -25;  // Snap to 50px grid, but need to offset by half the size of the fruit
            y = Math.floor(random(1, (screenHeight / 50))) * 50 -25; // Snap to 50px grid, but need to offset by half the size of the fruit
            fruit = { x, y, type: random([banana, watermelon]) };
        } while (fruitPositions.has(`${x},${y}`)); // Check if the position is taken

        fruitPositions.add(`${x},${y}`);  // Store the position
        fruits.push(fruit);
    }

}


// using the Perlin noise stuff from p5.js reference
function generateNoiseBackground() {
  background(138, 154, 91);
  noStroke();
  fill(53, 94, 59);

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 3; x < width; x += gap) {
    for (let y = gap / 3; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

      // Reduce the size of the dots by multiplying by a smaller factor
      let diameter = noiseValue * gap * 0.5;  // Adjust this factor as needed

      circle(x, y, diameter);
    }
  }
}

function draw() {

    // Draw the current hippo image at the current position
    imageMode(CENTER); 
    image(hippo, shared.x, shared.y, shared.size, shared.size);

    // Constrain the hippo within the screen bounds
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

    // Draw the fruits
    for (let i = fruits.length - 1; i >= 0; i--) {
        image(fruits[i].type, fruits[i].x, fruits[i].y, 50, 50);  // Adjust size of fruits

        // Check if the hippo collides with a fruit
        if (dist(shared.x, shared.y, fruits[i].x, fruits[i].y) < (shared.size / 2 + 25)) { 
            // If collision happens, increase the count and remove the fruit
            if (fruits[i].type === banana) {
                bananaCount++;
                console.log("Bananas collected: " + bananaCount);
            } else if (fruits[i].type === watermelon) {
                watermelonCount++;
                console.log("Watermelons collected: " + watermelonCount);
            }
            fruits.splice(i, 1); // Remove the collected fruit from the array
        }
    }

    // Clear the area where the score is being displayed
    fill(250, 200, 100, 200); // Use the same color as the background
    rect(10, 10, 165, 55, 5);

    // Display the current score
    fill(0);
    textSize(20);
    text(`Bananas: ${bananaCount}`, 15, 30);
    text(`Watermelons: ${watermelonCount}`, 15, 60);
}

function keyPressed() {
    if (key === 'r') {
        // Reload the page to reset the environment fully
        window.location.reload();
    }
    
    // Check which key was pressed and move the hippo one step
    if (keyCode === UP_ARROW || key === 'w') { 
        if (!keyPressedStatus.up) {
            shared.y -= shared.speed;
            keyPressedStatus.up = true;
        }
    }
    if (keyCode === DOWN_ARROW || key === 's') { 
        if (!keyPressedStatus.down) {
            shared.y += shared.speed;
            keyPressedStatus.down = true;
        }
    }
    if (keyCode === LEFT_ARROW || key === 'a') { 
        if (!keyPressedStatus.left) {
            shared.x -= shared.speed;
            keyPressedStatus.left = true;
        }
    }
    if (keyCode === RIGHT_ARROW || key === 'd') { 
        if (!keyPressedStatus.right) {
            shared.x += shared.speed;
            keyPressedStatus.right = true;
        }
    }
}

function keyReleased() {
    // Reset the keyPressedStatus when the key is released
    if (keyCode === UP_ARROW || key === 'w') {
        keyPressedStatus.up = false;
    }
    if (keyCode === DOWN_ARROW || key === 's') {
        keyPressedStatus.down = false;
    }
    if (keyCode === LEFT_ARROW || key === 'a') {
        keyPressedStatus.left = false;
    }
    if (keyCode === RIGHT_ARROW || key === 'd') {
        keyPressedStatus.right = false;
    }
}
