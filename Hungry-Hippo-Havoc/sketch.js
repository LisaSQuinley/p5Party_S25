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
let hippoNames = ["hippo1", "hippo2", "hippo3", "hippo4", "hippo5", "hippo6", "hippo7", "hippo8", "hippo9", "hippo10", "hippo11", "hippo12", "hippo13", "hippo14"];

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
  hippo5 = loadImage("hippo5.png");
  hippo6 = loadImage("hippo6.png");
  hippo7 = loadImage("hippo7.png");
  hippo8 = loadImage("hippo8.png");
  hippo9 = loadImage("hippo9.png");
  hippo10 = loadImage("hippo10.png");
  hippo11 = loadImage("hippo11.png");
  hippo12 = loadImage("hippo12.png");
  hippo13 = loadImage("hippo13.png");
  hippo14 = loadImage("hippo14.png");
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
  me.hippoImg = random(["hippo1", "hippo2", "hippo3", "hippo4", "hippo5", "hippo6", "hippo7", "hippo8", "hippo9", "hippo10", "hippo11", "hippo12", "hippo13", "hippo14"]);
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
        image(fruitImage, currentFruit.x, currentFruit.y, size, size);
  
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

  // Calculate total fruits for "me" (bananas + watermelons)
  let meTotalFruits = me.bananaCount + me.watermelonCount;

  // Flags to track if "me" is hungry, a winner, or the middle player
  let isMeHungry = false;
  let isMeWinner = true;
  let isMiddlePlayer = false;
  let maxFruits = meTotalFruits; // Start by assuming "me" has the most fruits
  let minFruits = meTotalFruits; // Assume "me" also has the least fruits

  // Track the max and min fruits for anyone in the game (including guests)
  for (let j = 0; j < guests.length; j++) {
    let guestTotalFruits = guests[j].bananaCount + guests[j].watermelonCount;
    if (guestTotalFruits > maxFruits) {
      maxFruits = guestTotalFruits; // Found someone with more fruits than "me"
      isMeWinner = false; // "Me" is not the winner
    }
    if (guestTotalFruits < minFruits) {
      minFruits = guestTotalFruits; // Found someone with fewer fruits than "me"
    }
  }

  // Determine if "me" is the middle player: "me" is neither the winner nor the hungriest
  if (meTotalFruits > minFruits && meTotalFruits < maxFruits) {
    isMiddlePlayer = true;
  }

  // Determine if "me" is the hungriest (has the least fruits)
  if (meTotalFruits === minFruits) {
    isMeHungry = true;
  }

  // Set the appropriate title based on fruit count (Winner, Hungry, or Middle)
  let title;
  if (isMeWinner) {
    title = "Nom! Nom! Nom!";
  } else if (isMeHungry) {
    title = "*Grumble*...*Growl*";
  } else if (isMiddlePlayer) {
    title = "Is there anything else to eat?"; // Middle player
  }

  // Set the appropriate message based on "me's" fruit count (Winner, Hungry, or Middle)
  let message;
  if (isMeHungry) {
    message = "I'm still hungry!";
  } else if (isMeWinner) {
    message = "Thanks for feeding me!";
  } else if (isMiddlePlayer) {
    message = "At least I'm not starving..."; // Middle player
  }

  // Title text
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textFont("Grandstander");
  textSize(50);
  fill(255); // White text
  text(title, width / 2, height - 900);

  // Message text (Updated based on fruit count)
  textFont("Grandstander");
  textSize(30);
  text(message, width / 2, height - 850);

  // Score display with text (Bananas and Watermelons removed)
  let startY = height - 775; // Start position for the first hippo, 100px below the "Thanks for feeding me!" text
  let spacing = 30; // Space between each text

  // Display hippo image for yourself (me)
  let hippoStartX = width / 2 - 50; // Center the hippo horizontally
  let hippoStartY = startY;   // Position the hippo just below the "Thanks for feeding me!" text
  image(hippoImages[me.hippoImg], hippoStartX, hippoStartY, size, size);

  // Add "Me" text next to the hippo (right side)
  textAlign(LEFT, CENTER);
  textSize(25);
  fill(255); // White text
  text("Me", hippoStartX + size + 5, hippoStartY); // Position the "Me" text just to the right of the hippo

  // Move down to the next line to avoid overlap with the "Me" text
  startY = hippoStartY + size; // Make sure fruits are below the hippo
  
  // Display bananas as images for yourself (me), closer to the hippo
  let totalBananaWidth = me.bananaCount * 50 - 50; // Calculate total width for bananas
  let bananaStartX = (width - totalBananaWidth) / 2; // Calculate starting X for centered positioning
  let bananaStartY = startY; // Start positioning bananas just below the hippo
  
  for (let i = 0; i < me.bananaCount; i++) {
    let x = bananaStartX + i * 50; // Position bananas side by side
    image(banana, x, bananaStartY, size, size); // Draw each banana image
  }
  startY = bananaStartY + 40; // Move down below the last banana image to make space for watermelons
  
  // Display watermelons as images for yourself (me), closer to the bananas
  let totalWatermelonWidth = me.watermelonCount * 50 - 50; // Calculate total width for watermelons
  let watermelonStartX = (width - totalWatermelonWidth) / 2; // Calculate starting X for centered positioning
  let watermelonStartY = startY; // Start positioning watermelons just below the bananas
  
  for (let i = 0; i < me.watermelonCount; i++) {
    let x = watermelonStartX + i * 50; // Position watermelons side by side
    image(watermelon, x, watermelonStartY, size, size); // Draw each watermelon image
  }
  startY = watermelonStartY + 40; // Move down below the last watermelon image to make space for guests
  
  // Loop through guests and display their data, excluding yourself (me)
  for (let j = 0; j < guests.length; j++) {
    // Check if the current guest is "me" and skip if true
    if (guests[j] === me) {
      continue; // Skip "me" if it's part of the guests list
    }
  
    // Display hippo image for each guest
    let guestHippoStartX = width / 2; // Center the hippo horizontally for each guest
    let guestHippoStartY = startY + 40;   // Position the hippo just below the score text
    image(hippoImages[guests[j].hippoImg], guestHippoStartX, guestHippoStartY, size, size); // Draw the guest hippo image

    startY = guestHippoStartY + 50; // Move down below the hippo image to make space for fruit images
  
    // Display bananas as images for each guest, closer to the hippo
    let totalGuestBananaWidth = guests[j].bananaCount * 50 - 50; // Calculate total width for guest bananas
    let guestBananaStartX = (width - totalGuestBananaWidth) / 2; // Calculate starting X for centered positioning
    let guestBananaStartY = startY; // Start positioning guest bananas just below the hippo
  
    for (let i = 0; i < guests[j].bananaCount; i++) {
      let x = guestBananaStartX + i * 50; // Position guest bananas side by side
      image(banana, x, guestBananaStartY, size, size); // Draw each banana image
    }
    startY = guestBananaStartY + 40; // Move down below the last guest banana image to make space for watermelons
  
    // Display watermelons as images for each guest, closer to the bananas
    let totalGuestWatermelonWidth = guests[j].watermelonCount * 50 - 50; // Calculate total width for guest watermelons
    let guestWatermelonStartX = (width - totalGuestWatermelonWidth) / 2; // Calculate starting X for centered positioning
    let guestWatermelonStartY = startY; // Start positioning guest watermelons just below the bananas
  
    for (let i = 0; i < guests[j].watermelonCount; i++) {
      let x = guestWatermelonStartX + i * 50; // Position guest watermelons side by side
      image(watermelon, x, guestWatermelonStartY, size, size); // Draw each watermelon image
    }
    startY = guestWatermelonStartY + 40; // Move down below the last watermelon image for the next guest
  }

  // Restart prompt
  textAlign(CENTER, CENTER);
  textSize(25);
  text("Click to Play Again", width / 2, height - 100);
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
