// https://editor.p5js.org/LisaSQuinley/sketches/J72QvfYCM
// Hippo Grazing which is a sketch based off the Hippo Grazing one I created previously
// ChatGPT helped out with cleaning up a lot of my code

// Impacts_Splatter_Watermelon_001.wav by duckduckpony -- https://freesound.org/s/204024/ -- License: Attribution 4.0

let shared;
let screenHeight = 1000;
let screenWidth = 1000;
let bananaCount = 0;
let watermelonCount = 0;
let showTitleScreen = true;
let crunchSounds = [];
let crunchFiles = ['Crunch-1.wav', 'Crunch-2.wav', 'Crunch-3.wav', 'Crunch-4.wav'];

let me, guests;

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
    // partyConnect(server, appName, [roomName], [callback])
    partyConnect(
      "wss://demoserver.p5party.org",
      "Hungry Hippos",
      "Plot of Land"
    );
  guests = partyLoadGuestShareds();
  me = partyLoadMyShared({ score: 0 });
  shared = partyLoadShared("globals");
  hippo1 = loadImage("hippo-01.png");
  banana = loadImage("banana.png");
  watermelon = loadImage("watermelon.png");
  logo = loadImage("Logo.png");
  icon = loadImage("Icon.png");
  start = loadImage("Start.png");
  // Load the sound files into the array
  for (let i = 0; i < crunchFiles.length; i++) {
    crunchSounds[i] = loadSound(crunchFiles[i]);
  }
}

function displayTitleScreen() {
  generatePurpleNoiseBackground();

  let scaleFactor = 1; // Initial scale factor
  let scalingSpeed = 0.1; // Speed at which it scales

  // Title text
  image(logo, 40, 0, 700, 700);
  image(icon, 615, 225, 350, 350);
  //  image(start, 650, 550, 300, 300);

  push(); // Begin a new drawing state
  // Translate to the position where you want the image's center to be
  translate(785, 675);
  // Calculate a pulsing scale factor based on a sine wave
  scaleFactor = 1 + sin(frameCount * scalingSpeed) * 0.05; // Change 0.2 to adjust the pulsing intensity
  // Apply the scale transformation to the image (this affects the drawing)
  scale(scaleFactor);
  // Draw the image, ensuring it is centered at the translation point
  image(start, -150, -150, 300, 300); // Draw image at its center (subtract half the width/height)
  // Restore the drawing state
  pop();

  // Additional instruction or description
  textSize(25);
  fill(255);
  textFont("Grandstander");
  textStyle(BOLD);
  let instructionText = `Move your hippo around the board 
using the arrow or W, A, S, D keys, 
dash for the fruit, and chomp, chomp, chomp! 
The more fruit you munch, 
the happier your tummy will be! 
But watch out! Those other hippos are just as hungry 
and they’re racing to snatch up the fruit too!`;
  push(); // Begin a new drawing state
  translate(0, 0); // Move the starting point for the text
  rotate(radians(-7)); // Rotate the text by 15 degrees (change this value to your liking)
  text(instructionText, -25, 750);
  pop(); // Restore the drawing state
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

  me.speed = 50; // Set the distance per key press (distance per step)

  me.x = me.x || 975;
  me.y = me.y || 975;

  me.size = me.size || 50;

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
    image(hippo1, me.x, me.y, me.size, me.size);

    // Constrain the hippo within the screen bounds
    if (me.x < 0) {
      me.x = 0 + me.size / 2;
    }
    if (me.x > screenWidth) {
      me.x = screenWidth - me.size / 2;
    }
    if (me.y < 0) {
      me.y = 0 + me.size / 2;
    }
    if (me.y > screenHeight) {
      me.y = screenHeight - me.size / 2;
    }

    // Draw the fruits
    for (let i = fruits.length - 1; i >= 0; i--) {
      image(fruits[i].type, fruits[i].x, fruits[i].y, 50, 50); // Adjust size of fruits

      // Check if the hippo collides with a fruit
      if (
        dist(me.x, me.y, fruits[i].x, fruits[i].y) <
        me.size / 2 + 25
      ) {
    // Select a random sound from the array
    let randomSound = crunchSounds[Math.floor(Math.random() * crunchSounds.length)];
    // Play the randomly selected sound
    randomSound.play();
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

    // Set the font for the fruit name (e.g., Grandstander)
    textAlign(LEFT, TOP);
    textFont("Grandstander");
    textSize(20);
    fill(53, 94, 59); // Set the color to black
    text("Bananas:", 15, 15); // Display "Bananas"

    // Set the font for the count (e.g., Grandstander)
    textAlign(LEFT, TOP);
    textFont("Grandstander");
    textSize(20);
    fill(104, 23, 100); // Set the color to black
    text(bananaCount, 163, 15); // Display the banana count

    // Set the font for the fruit name (e.g., Grandstander)
    textAlign(LEFT, TOP);
    textFont("Grandstander");
    textSize(20);
    fill(53, 94, 59); // Set the color to black
    text("Watermelons:", 15, 42.5); // Display "Watermelons"

    // Set the font for the count (e.g., Grandstander)
    textAlign(LEFT, TOP);
    textFont("Grandstander");
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
  textFont("Grandstander");
  textSize(50);
  fill(255); // White text
  text("Congratulations!", width / 2, height / 4);

  textFont("Grandstander");
  // Message text
  textSize(30);
  text("You collected all the fruits!", width / 2, height / 2);

  // Score display with text
  textSize(20);
  text("Bananas: " + bananaCount, width / 2, height / 1.5);
  text("Watermelons: " + watermelonCount, width / 2, height / 1.3);

  // Display bananas as images underneath the count
  let totalBananaWidth = bananaCount * 50 - 50; // Calculate total width for bananas
  let bananaStartX = (width - totalBananaWidth) / 2; // Calculate starting X for centered positioning
  for (let i = 0; i < bananaCount; i++) {
    let x = bananaStartX + i * 50; // Position bananas side by side
    let y = height / 1.4; // Position below the "Bananas" count
    image(banana, x, y, 50, 50); // Draw each banana image
  }

  // Display watermelons as images underneath the count
  let totalWatermelonWidth = watermelonCount * 50 - 50; // Calculate total width for watermelons
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
      me.y -= me.speed;
      keyPressedStatus.up = true;
    }
  }
  if (keyCode === DOWN_ARROW || key === "s") {
    if (!keyPressedStatus.down) {
      me.y += me.speed;
      keyPressedStatus.down = true;
    }
  }
  if (keyCode === LEFT_ARROW || key === "a") {
    if (!keyPressedStatus.left) {
      me.x -= me.speed;
      keyPressedStatus.left = true;
    }
  }
  if (keyCode === RIGHT_ARROW || key === "d") {
    if (!keyPressedStatus.right) {
      me.x += me.speed;
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
  me.x = screenWidth - 25; // Initial position of the hippo
  me.y = screenHeight - 25;
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
