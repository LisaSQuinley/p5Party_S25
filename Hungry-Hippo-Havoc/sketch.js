// https://editor.p5js.org/LisaSQuinley/sketches/J72QvfYCM
// Hippo Grazing which is a sketch based off the Hippo Grazing one I created previously
// ChatGPT helped out with cleaning up a lot of my code

// Impacts_Splatter_Watermelon_001.wav by duckduckpony -- https://freesound.org/s/204024/ -- License: Attribution 4.0

// global variable is watermelonCount/bananaCount, change those to me.watermelonCount/me.bananaCount


let shared;
let screenHeight = 1000;
let screenWidth = 1000;
// let bananaCount = 0;
// let watermelonCount = 0;
let showTitleScreen = true;
let gameStarted = false;
let crunchSounds = [];
let crunchFiles = ['Crunch-1.wav', 'Crunch-2.wav', 'Crunch-3.wav', 'Crunch-4.wav'];
const speed = 50;
const size = 50;
let me, guests;
//let hippoImg = "";
let hippoImages = {};
let hippoNames = ["hippo1", "hippo2", "hippo3", "hippo4"];

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
  // Load all hippo images and store them in the hippoImages object
  hippoNames.forEach(name => {
    hippoImages[name] = loadImage(name + ".png"); // Assuming the image files are named "hippo1.png", "hippo2.png", etc.
  });

  guests = partyLoadGuestShareds(
    {
      hippoImg: "",
      x: 975, 
      y: 975, 
      bananaCount: 0,
      watermelonCount: 0,
    }
  );
  shared = partyLoadShared("shared", { 
    // fruits: [], 
    gameStarted: false,
    sharedFruits: [],
    });
  me = partyLoadMyShared({ 
    hippoImg: "",
    x: 975, 
    y: 975, 
    bananaCount: 0,
    watermelonCount: 0
  });
  hippo1 = loadImage("hippo1.png");
  hippo2 = loadImage("hippo2.png");
  hippo3 = loadImage("hippo3.png");
  hippo4 = loadImage("hippo4.png");
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


function setup() {
  partyToggleInfo(true);

  createCanvas(screenWidth, screenHeight);
  background(248);

//  speed = 50; // Set the distance per key press (distance per step)
//  me.x = me.x || 975;
//  me.y = me.y || 975;
//  size = size || 50;

  generateGreenNoiseBackground();

  if (partyIsHost()) {
    // Generate fruits if the user is the host
    fruitGeneration();
  }
  me.hippoImg = random(["hippo1", "hippo2", "hippo3", "hippo4"]);
}

function draw() {
  if (shared.gameStarted) {
    // If the game has started, don't show the title screen
    showTitleScreen = false;
  }

  if (showTitleScreen) {
    displayTitleScreen();
  } else if (shared.sharedFruits.length === 0) {
    // If all fruits are collected, display the game over screen
    displayGameOverScreen();
  } else {
    // Game logic

    // Keep updating the background with noise
    generateGreenNoiseBackground();

    // Draw the current hippo image at the current position
    imageMode(CENTER);
    image(hippoImages[me.hippoImg], me.x, me.y, size, size);

    // Constrain the hippo within the screen bounds
    if (me.x < 0) {
      me.x = 0 + size / 2;
    }
    if (me.x > screenWidth) {
      me.x = screenWidth - size / 2;
    }
    if (me.y < 0) {
      me.y = 0 + size / 2;
    }
    if (me.y > screenHeight) {
      me.y = screenHeight - size / 2;
    }
    
    drawFruits();

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
    text(me.bananaCount, 163, 15); // Display the banana count

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
    text(me.watermelonCount, 163, 42.5); // Display the watermelon count
  }
}

function drawFruits() {
  
      // Draw the fruits (no longer storing image inside the fruit object)
      for (let i = shared.sharedFruits.length - 1; i >= 0; i--) {
        const currentFruit = shared.sharedFruits[i];
        let fruitImage
        if (currentFruit.fruitType === "banana") {
          fruitImage = banana;
        }
        else if (currentFruit.fruitType === "watermelon") {
          fruitImage = watermelon;
        }
        image(fruitImage, currentFruit.x, currentFruit.y, 50, 50);
  
        // Check if the hippo collides with a fruit
        if (
          dist(me.x, me.y, currentFruit.x, currentFruit.y) <
          size / 2 + 25
        ) {
      // Select a random sound from the array
      let randomSound = crunchSounds[Math.floor(Math.random() * crunchSounds.length)];
      // Play the randomly selected sound
      randomSound.play();
          // If collision happens, increase the count and remove the fruit
          if (currentFruit.fruitType === "banana") {
            me.bananaCount++;
            console.log("Bananas collected: " + me.bananaCount);
          } else if (currentFruit.fruitType === "watermelon") {
            me.watermelonCount++;
            console.log("Watermelons collected: " + me.watermelonCount);
          }
          shared.sharedFruits.splice(i, 1); // Remove the collected fruit from the array
        }
      }
}

function fruitGeneration() {

    // Create random positions for the fruits (watermelon and banana)
    let fruitPositions = new Set(); // To store unique grid positions
    for (let i = 0; i < 20; i++) {
      // Place 20 random fruits
      let fruit;
      let x, y;
  
      // Keep trying until we find a non-overlapping position
      do {
        x = Math.floor(random(1, screenWidth / 50)) * 50 - 25; // Snap to 50px grid, but need to offset by half the size of the fruit
        y = Math.floor(random(1, screenHeight / 50)) * 50 - 25; // Snap to 50px grid, but need to offset by half the size of the fruit
        fruit = { 
          x, 
          y, 
          // type: random([banana, watermelon]), 
          fruitType: random(["banana", "watermelon"]) 
        };
      } while (fruitPositions.has(`${x},${y}`)); // Check if the position is taken
  
      fruitPositions.add(`${x},${y}`); // Store the position
  //    console.log(fruit);
      fruits.push(fruit);
      shared.sharedFruits.push(fruit);
    }
  //  console.log(fruitPositions);
  //  console.log(shared.fruits);
    console.log(shared.sharedFruits);

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
  let startY = height / 3; // Start position for the first text
  let spacing = 30; // Space between each text line
  
  // Display for yourself (me)
  text("Bananas: " + me.bananaCount, width / 2, startY);
  startY += spacing;  // Move down for the next text
  text("Watermelons: " + me.watermelonCount, width / 2, startY);
  startY += spacing;  // Move down for the next text
  
  // Display bananas as images for yourself (me)
  let totalBananaWidth = me.bananaCount * 50 - 50; // Calculate total width for bananas
  let bananaStartX = (width - totalBananaWidth) / 2; // Calculate starting X for centered positioning
  let bananaStartY = startY; // Start positioning bananas below the text
  
  for (let i = 0; i < me.bananaCount; i++) {
    let x = bananaStartX + i * 50; // Position bananas side by side
    image(banana, x, bananaStartY, 50, 50); // Draw each banana image
  }
  startY = bananaStartY + 60; // Move down below the last banana image to make space for watermelons
  
  // Display watermelons as images for yourself (me)
  let totalWatermelonWidth = me.watermelonCount * 50 - 50; // Calculate total width for watermelons
  let watermelonStartX = (width - totalWatermelonWidth) / 2; // Calculate starting X for centered positioning
  let watermelonStartY = startY; // Start positioning watermelons below the bananas
  
  for (let i = 0; i < me.watermelonCount; i++) {
    let x = watermelonStartX + i * 50; // Position watermelons side by side
    image(watermelon, x, watermelonStartY, 50, 50); // Draw each watermelon image
  }
  startY = watermelonStartY + 60; // Move down below the last watermelon image to make space for guests
  
  // Loop through guests and display their data, excluding yourself (me)
  for (let j = 0; j < guests.length; j++) {
    // Check if the current guest is "me" and skip if true
    if (guests[j] === me) {
      continue; // Skip "me" if it's part of the guests list
    }
  
    // Display text for each guest
    text("Bananas: " + guests[j].bananaCount, width / 2, startY);
    startY += spacing;  // Move down for the next text
    text("Watermelons: " + guests[j].watermelonCount, width / 2, startY);
    startY += spacing;  // Move down for the next text
  
    // Display bananas as images for each guest
    let totalGuestBananaWidth = guests[j].bananaCount * 50 - 50; // Calculate total width for guest bananas
    let guestBananaStartX = (width - totalGuestBananaWidth) / 2; // Calculate starting X for centered positioning
    let guestBananaStartY = startY; // Start positioning guest bananas below the text
  
    for (let i = 0; i < guests[j].bananaCount; i++) {
      let x = guestBananaStartX + i * 50; // Position guest bananas side by side
      image(banana, x, guestBananaStartY, 50, 50); // Draw each banana image
    }
    startY = guestBananaStartY + 60; // Move down below the last guest banana image to make space for watermelons
  
    // Display watermelons as images for each guest
    let totalGuestWatermelonWidth = guests[j].watermelonCount * 50 - 50; // Calculate total width for guest watermelons
    let guestWatermelonStartX = (width - totalGuestWatermelonWidth) / 2; // Calculate starting X for centered positioning
    let guestWatermelonStartY = startY; // Start positioning guest watermelons below the bananas
  
    for (let i = 0; i < guests[j].watermelonCount; i++) {
      let x = guestWatermelonStartX + i * 50; // Position guest watermelons side by side
      image(watermelon, x, guestWatermelonStartY, 50, 50); // Draw each watermelon image
    }
    startY = guestWatermelonStartY + 60; // Move down below the last watermelon image for the next guest
  }
  
  
/*   text("Bananas: " + me.bananaCount, width / 2, height / 1.5);
  text("Watermelons: " + me.watermelonCount, width / 2, height / 1.3);
  text("Bananas: " + guests.bananaCount, width / 2, height / 1.5);
  text("Watermelons: " + guests.watermelonCount, width / 2, height / 1.3); */

/*   // Display bananas as images underneath the count
  let totalBananaWidth = me.bananaCount * 50 - 50; // Calculate total width for bananas
  let bananaStartX = (width - totalBananaWidth) / 2; // Calculate starting X for centered positioning
  for (let i = 0; i < me.bananaCount; i++) {
    let x = bananaStartX + i * 50; // Position bananas side by side
    let y = height / 1.4; // Position below the "Bananas" count
    image(banana, x, y, 50, 50); // Draw each banana image
  }

  // Display watermelons as images underneath the count
  let totalWatermelonWidth = me.watermelonCount * 50 - 50; // Calculate total width for watermelons
  let watermelonStartX = (width - totalWatermelonWidth) / 2; // Calculate starting X for centered positioning
  for (let i = 0; i < me.watermelonCount; i++) {
    let x = watermelonStartX + i * 50; // Position watermelons side by side
    let y = height / 1.2; // Position below the "Watermelons" count
    image(watermelon, x, y, 50, 50); // Draw each watermelon image
  } */

  // Restart prompt
  textSize(25);
  text("Click to Play Again", width / 2, height / 1.1);
}

function keyPressed() {

  // Check which key was pressed and move the hippo one step
  if (keyCode === UP_ARROW || key === "w") {
    if (!keyPressedStatus.up) {
      me.y -= speed;
      keyPressedStatus.up = true;
    }
  }
  if (keyCode === DOWN_ARROW || key === "s") {
    if (!keyPressedStatus.down) {
      me.y += speed;
      keyPressedStatus.down = true;
    }
  }
  if (keyCode === LEFT_ARROW || key === "a") {
    if (!keyPressedStatus.left) {
      me.x -= speed;
      keyPressedStatus.left = true;
    }
  }
  if (keyCode === RIGHT_ARROW || key === "d") {
    if (!keyPressedStatus.right) {
      me.x += speed;
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
  if (partyIsHost()) {
    // If the user is the host, start the game when the mouse is clicked
    showTitleScreen = false; // Hide the title screen for the host
    shared.gameStarted = true; // Update shared state to indicate the game has started

    // Notify all guests of the game start by updating their shared state
    partyStoreShared(shared); // Save the updated shared state
  }

  // Check if the "Click to Play Again" area is clicked
  if (shared.sharedFruits.length === 0) {
    // Game Over, check if the mouse click is in the "Play Again" area
    let playAgainAreaY = height / 1.1;
    let playAgainAreaHeight = 30; // Height of the text
    let playAgainAreaX1 = width / 2 - 150; // Left X boundary of the clickable area
    let playAgainAreaX2 = width / 2 + 150; // Right X boundary of the clickable area
    
    // Check if mouse click is within the area of the "Play Again" button
    if (mouseY > playAgainAreaY - playAgainAreaHeight / 2 &&
        mouseY < playAgainAreaY + playAgainAreaHeight / 2 &&
        mouseX > playAgainAreaX1 && mouseX < playAgainAreaX2) {
      resetGame(); // Reset the game when clicked within this region
    }
  }
}




function resetGame() {
  // Reset scores and position
  me.bananaCount = 0;
  me.watermelonCount = 0;
  me.x = screenWidth - 25; // Initial position of the hippo
  me.y = screenHeight - 25;
  guests.x = screenWidth - 25; // Initial position of the hippo
  guests.y = screenHeight - 25;
  fruits = []; // Empty the fruits array
  shared.sharedFruits = [];

  fruitGeneration();
}
