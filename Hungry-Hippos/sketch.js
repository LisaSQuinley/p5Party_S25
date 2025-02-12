// https://editor.p5js.org/LisaSQuinley/sketches/J72QvfYCM
// Hippo Grazing which is a sketch based off the Hippo Grazing one I created previously
// ChatGPT helped out with cleaning up a lot of my code

let shared;
let screenHeight = 1000;
let screenWidth = 1000;
let bananaCount = 0;
let watermelonCount = 0;
let showTitleScreen = true;

let keyPressedStatus = {
  up: false,
  down: false,
  left: false,
  right: false,
};

let xScale = 0.015;
let yScale = 0.02;

let gap = 10; // Set a fixed gap value
let offset = 0; // Set a fixed offset value

let fruits = [];

function preload() {
  if (!shared) {
    // partyConnect(server, appName, [roomName], [callback])
    partyConnect("wss://demoserver.p5party.org", "Hungry Hippos", "Plot of Land");
  }
  shared = partyLoadShared("globals");
  hippo = loadImage("hippo.png");
  banana = loadImage("banana.png");
  watermelon = loadImage("watermelon.png");
}



function displayTitleScreen() {
  generatePurpleNoiseBackground();
  
  fill(255);
  // Title text
  textAlign(CENTER, CENTER);
  textFont("Lexend Peta");
  textSize(80);
  text("Hungry Hippos!", width / 2, height / 4);
  
  // Instructions text
  textSize(60);
  textFont("Lexend Deca");
  text("Click to start!", width / 2, height / 2);
  
  // Additional instruction or description
  textSize(30);
  textFont("Lexend Deca");
  text("Use arrow keys or WASD to move the hippo", width / 2, height / 1.5);
}

function generatePurpleNoiseBackground() {
  background(133, 104, 172);
  noStroke();
  fill(38, 34, 97);

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 3; x < width; x += gap) {
    for (let y = gap / 3; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

      // Reduce the size of the dots by multiplying by a smaller factor
      let diameter = noiseValue * gap * 0.5; // Adjust this factor as needed

      circle(x, y, diameter);
    }
  }
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
    partySetShared(shared, { score: 0 });
  }

  shared.speed = 50; // Set the distance per key press (distance per step)

  shared.x = shared.x || 975;
  shared.y = shared.y || 975;

  shared.size = shared.size || 50;

  generateGreenNoiseBackground();

  // Create random positions for the fruits (watermelon and banana)
  let fruitPositions = new Set(); // To store unique grid positions
  for (let i = 0; i < 20; i++) {
    // Place 10 random fruits
    let fruit;
    let x, y;

    // Keep trying until we find a non-overlapping position
    do {
      x = Math.floor(random(1, screenWidth / 50)) * 50 - 25; // Snap to 50px grid, but need to offset by half the size of the fruit
      y = Math.floor(random(1, screenHeight / 50)) * 50 - 25; // Snap to 50px grid, but need to offset by half the size of the fruit
      fruit = { x, y, type: random([banana, watermelon]) };
    } while (fruitPositions.has(`${x},${y}`)); // Check if the position is taken

    fruitPositions.add(`${x},${y}`); // Store the position
    fruits.push(fruit);
  }
}

// using the Perlin noise stuff from p5.js reference
function generateGreenNoiseBackground() {
  background(138, 154, 91);
  noStroke();
  fill(53, 94, 59);

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 3; x < width; x += gap) {
    for (let y = gap / 3; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

      // Reduce the size of the dots by multiplying by a smaller factor
      let diameter = noiseValue * gap * 0.5; // Adjust this factor as needed

      circle(x, y, diameter);
    }
  }
}


function draw() {

  if (showTitleScreen) {
    // Display the title screen
    displayTitleScreen();
  } else if (fruits.length === 0) {
    // If all fruits are collected, display the game over screen
    displayGameOverScreen();
  } else {
    // Game logic

  // Keep updating the background with noise
  generateGreenNoiseBackground();

  // Draw the current hippo image at the current position
  imageMode(CENTER);
  image(hippo, shared.x, shared.y, shared.size, shared.size);

  // Constrain the hippo within the screen bounds
  if (shared.x < 0) {
    shared.x = 0 + shared.size/2;
  }
  if (shared.x > screenWidth) {
    shared.x = screenWidth - shared.size/2;
  }
  if (shared.y < 0) {
    shared.y = 0 + shared.size/2;
  }
  if (shared.y > screenHeight) {
    shared.y = screenHeight - shared.size/2;
  }

  // Draw the fruits
  for (let i = fruits.length - 1; i >= 0; i--) {
    image(fruits[i].type, fruits[i].x, fruits[i].y, 50, 50); // Adjust size of fruits

    // Check if the hippo collides with a fruit
    if (
      dist(shared.x, shared.y, fruits[i].x, fruits[i].y) <
      shared.size / 2 + 25
    ) {
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
  rect(10, 10, 185, 55, 5);

  // Set the font for the fruit name (e.g., Lexend Deca)
  textAlign(LEFT, TOP);
  textFont("Lexend Deca");
  textSize(20);
  fill(53, 94, 59); // Set the color to black
  text("Bananas:", 15, 15); // Display "Bananas"

  // Set the font for the count (e.g., Lexend Peta)
  textAlign(LEFT, TOP);
  textFont("Lexend Peta");
  textSize(20);
  fill(104, 23, 100); // Set the color to black
  text(bananaCount, 163, 15); // Display the banana count

  // Set the font for the fruit name (e.g., Lexend Deca)
  textAlign(LEFT, TOP);
  textFont("Lexend Deca");
  textSize(20);
  fill(53, 94, 59); // Set the color to black
  text("Watermelons:", 15, 42.5); // Display "Watermelons"

  // Set the font for the count (e.g., Lexend Peta)
  textAlign(LEFT, TOP);
  textFont("Lexend Peta");
  textSize(20);
  fill(104, 23, 100); // Set the color to black
  text(watermelonCount, 163, 42.5); // Display the watermelon count

}

}


function generateDarkGreenNoiseBackground() {
  background(53, 94, 59);
  noStroke();
  fill(138, 154, 91);

  // Loop through x and y coordinates, at increments set by gap
  for (let x = gap / 3; x < width; x += gap) {
    for (let y = gap / 3; y < height; y += gap) {
      // Calculate noise value using scaled and offset coordinates
      let noiseValue = noise((x + offset) * xScale, (y + offset) * yScale);

      // Reduce the size of the dots by multiplying by a smaller factor
      let diameter = noiseValue * gap * 0.5; // Adjust this factor as needed

      circle(x, y, diameter);
    }
  }
}


function displayGameOverScreen() {
  generateDarkGreenNoiseBackground();

  // Title text
  textAlign(CENTER, CENTER);
  textFont("Lexend Peta");
  textSize(50);
  fill(255); // White text
  text("Congratulations!", width / 2, height / 4);

  textFont("Lexend Deca");
  // Message text
  textSize(30);
  text("You collected all the fruits!", width / 2, height / 2);

  // Score display with text
  textSize(20);
  text("Bananas: " + bananaCount, width / 2, height / 1.5);
  text("Watermelons: " + watermelonCount, width / 2, height / 1.3);

  // Display bananas as images underneath the count
  let totalBananaWidth = bananaCount * 50 - 25; // Calculate total width for bananas
  let bananaStartX = (width - totalBananaWidth) / 2; // Calculate starting X for centered positioning
  for (let i = 0; i < bananaCount; i++) {
    let x = bananaStartX + i * 50; // Position bananas side by side
    let y = height / 1.4; // Position below the "Bananas" count
    image(banana, x, y, 50, 50); // Draw each banana image
  }

  // Display watermelons as images underneath the count
  let totalWatermelonWidth = watermelonCount * 50 - 25; // Calculate total width for watermelons
  let watermelonStartX = (width - totalWatermelonWidth) / 2; // Calculate starting X for centered positioning
  for (let i = 0; i < watermelonCount; i++) {
    let x = watermelonStartX + i * 50; // Position watermelons side by side
    let y = height / 1.2; // Position below the "Watermelons" count
    image(watermelon, x, y, 50, 50); // Draw each watermelon image
  }

  // Restart prompt
  textSize(25);
  text("Click to Play Again", width / 2, height / 1.1);
}






function keyPressed() {
/*   if (key === "r") {
    // Reload the page to reset the environment fully
    window.location.reload();
  } */

  // Check which key was pressed and move the hippo one step
  if (keyCode === UP_ARROW || key === "w") {
    if (!keyPressedStatus.up) {
      shared.y -= shared.speed;
      keyPressedStatus.up = true;
    }
  }
  if (keyCode === DOWN_ARROW || key === "s") {
    if (!keyPressedStatus.down) {
      shared.y += shared.speed;
      keyPressedStatus.down = true;
    }
  }
  if (keyCode === LEFT_ARROW || key === "a") {
    if (!keyPressedStatus.left) {
      shared.x -= shared.speed;
      keyPressedStatus.left = true;
    }
  }
  if (keyCode === RIGHT_ARROW || key === "d") {
    if (!keyPressedStatus.right) {
      shared.x += shared.speed;
      keyPressedStatus.right = true;
    }
  }
}

function keyReleased() {
  // Reset the keyPressedStatus when the key is released
  if (keyCode === UP_ARROW || key === "w") {
    keyPressedStatus.up = false;
  }
  if (keyCode === DOWN_ARROW || key === "s") {
    keyPressedStatus.down = false;
  }
  if (keyCode === LEFT_ARROW || key === "a") {
    keyPressedStatus.left = false;
  }
  if (keyCode === RIGHT_ARROW || key === "d") {
    keyPressedStatus.right = false;
  }
}


function mousePressed() {
  if (showTitleScreen) {
    showTitleScreen = false; // Hide the title screen when the mouse is clicked
  }

  if (fruits.length === 0) {
    // Reset the game when all fruits are collected and the Game Over screen is visible
    resetGame();
  }
}

function resetGame() {
  // Reset scores and position
  bananaCount = 0;
  watermelonCount = 0;
  shared.x = screenWidth - 25; // Initial position of the hippo
  shared.y = screenHeight - 25;
  fruits = []; // Empty the fruits array

  // Regenerate the fruits in random positions
  let fruitPositions = new Set(); // To store unique grid positions
  for (let i = 0; i < 20; i++) {
    let fruit;
    let x, y;

    do {
      x = Math.floor(random(1, screenWidth / 50)) * 50 - 25;
      y = Math.floor(random(1, screenHeight / 50)) * 50 - 25;
      fruit = { x, y, type: random([banana, watermelon]) };
    } while (fruitPositions.has(`${x},${y}`));

    fruitPositions.add(`${x},${y}`);
    fruits.push(fruit);
  }
}