// https://editor.p5js.org/LisaSQuinley/sketches/Q7REy5df0
// Hippo Grazing which is a sketch based off the Hippo Grazing one I created previously
// ChatGPT helped out with cleaning up a lot of my code

// Impacts_Splatter_Watermelon_001.wav by duckduckpony -- https://freesound.org/s/204024/ -- License: Attribution 4.0


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
  banana1 = loadImage("banana1.png");
  watermelon = loadImage("watermelon.png");
  watermelon1 = loadImage("watermelon1.png");
  watermelon2 = loadImage("watermelon2.png");
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

    // Draw an ellipse for the score background
    let ellipseX = 110; // X position of the ellipse
    let ellipseY = 60; // Y position of the ellipse
    let ellipseWidth = 200; // Width of the ellipse
    let ellipseHeight = 100; // Height of the ellipse
    
    fill(250, 200, 100); // Use the same color as the background for the ellipse
    noStroke(); // No border around the ellipse
    ellipse(ellipseX, ellipseY, ellipseWidth, ellipseHeight); // Draw the ellipse

    // Center text horizontally and vertically inside the ellipse
    textAlign(LEFT, CENTER); // Align text to the left but centered vertically

    // Set the font for the fruit name (e.g., Grandstander)
    textFont("Grandstander");
    textSize(20);
    fill(53, 94, 59); // Set the color for the fruit label (Bananas, Watermelons)
    text("Bananas:", ellipseX - 80, ellipseY - 10); // Display "Bananas" to the left of the ellipse

    // Set the font for the count (e.g., Grandstander)
    textFont("Grandstander");
    textSize(20);
    fill(104, 23, 100); // Set the color for the count (e.g., for bananas)
    text(me.bananaCount, ellipseX + 20, ellipseY - 10); // Move the banana count closer to the word "Bananas:"

    // Set the font for the fruit name (e.g., Grandstander)
    textFont("Grandstander");
    textSize(20);
    fill(53, 94, 59); // Set the color for the fruit label (Watermelons)
    text("Watermelons:", ellipseX - 80, ellipseY + 10); // Display "Watermelons" below the "Bananas"

    // Set the font for the count (e.g., Grandstander)
    textFont("Grandstander");
    textSize(20);
    fill(104, 23, 100); // Set the color for the count (e.g., for watermelons)
    text(me.watermelonCount, ellipseX + 60, ellipseY + 10); // Display the watermelon count next to the label
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
  translate(785, 663);
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
  fill(251, 240, 179);
  textFont("Grandstander");
  textStyle(BOLD);
  let instructionText = `Oh I'm so hungry! Please feed me! 
Use the arrows or W, A, S, D keys, to help me dash for the fruit, 
so that I can chomp, chomp, chomp! 
The more fruit I munch, the happier my tummy will be! 
But watch out! There are other hippos who are just as hungry 
and they’re racing to snatch up the fruit too!`;
text(instructionText, 75, 750);


  //push(); // Begin a new drawing state
  //translate(0, 0); // Move the starting point for the text
  //rotate(radians(-7)); // Rotate the text by 15 degrees (change this value to your liking)
  //text(instructionText, -25, 775);
  //pop(); // Restore the drawing state
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

function generateBlackNoiseBackground() {
  background(0);
  noStroke();
  fill(75);

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

function generateDarkRedNoiseBackground() {
  background(118, 0, 23);
  noStroke();
  fill(237, 24, 72);

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

function generateDarkYellowNoiseBackground() {
  background(242, 148, 32);
  noStroke();
  fill(255, 194, 14);

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
  let meTotalFruits = me.bananaCount + me.watermelonCount;

  let isMeStarving = meTotalFruits === 0; // Ensure starving is always 0
  let isMeHungry = false;
  let isMeWinner = false;
  let isMiddlePlayer = false;

  let maxFruits = meTotalFruits;
  let minFruits = isMeStarving ? Infinity : meTotalFruits; // Set to Infinity so we can properly track min

  // Determine max and min fruits across all players
  for (let j = 0; j < guests.length; j++) {
    let guestTotalFruits = guests[j].bananaCount + guests[j].watermelonCount;
    
    if (guestTotalFruits > maxFruits) {
      maxFruits = guestTotalFruits;
    }
    
    if (guestTotalFruits < minFruits && guestTotalFruits > 0) { // Ignore 0, since that's already marked as starving
      minFruits = guestTotalFruits;
    }
  }

  // Assign roles based on fruit count
  if (!isMeStarving) {
    if (meTotalFruits === maxFruits) {
      isMeWinner = true;
    } else if (meTotalFruits === minFruits) {
      isMeHungry = true;
    } else {
      isMiddlePlayer = true;
    }
  }

  // **Generate background based on classification**
  if (isMeWinner) {
    generateDarkGreenNoiseBackground();
  } else if (isMeHungry) {
    generateDarkRedNoiseBackground();
  } else if (isMiddlePlayer) {
    generateDarkYellowNoiseBackground();
  } else if (isMeStarving) {
    generateBlackNoiseBackground();
  }

  // **Title and Message based on classification**
  let title, message;
  if (isMeWinner) {
    title = "Nom! Nom! Nom!";
    message = "Thanks for feeding me!";
  } else if (isMeHungry) {
    title = "*Grumbling*...*Growling*";
    message = "I'm still hungry!";
  } else if (isMiddlePlayer) {
    title = "That was a good appetizer.";
    message = "Is there anything else to eat?";
  } else if (isMeStarving) {
    title = "I'm famished!";
    message = "It's ok, now I can fit into my tutu!";
  }

  // **Display Title**
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textFont("Grandstander");
  textSize(50);
  fill(251, 240, 179);
  text(title, width / 2, height - 900);

  // **Display Message**
  textFont("Grandstander");
  textSize(30);
  text(message, width / 2, height - 850);

  // **Display Hippo and Fruits**
  let startY = height - 775;
  let size = 50; // Assuming `size` is defined elsewhere

  // Display "Me" Hippo
  let hippoStartX = width / 2 - 30;
  let hippoStartY = startY;
  image(hippoImages[me.hippoImg], hippoStartX, hippoStartY, size, size);

  textAlign(LEFT, CENTER);
  textSize(25);
  fill(251, 240, 179);
  text("Me", hippoStartX + size - 10, hippoStartY);

  startY = hippoStartY + size;

  // **Display "Me" Bananas**
  let bananaStartX = (width - (me.bananaCount * 50 - 50)) / 2;
  let bananaStartY = startY;
  for (let i = 0; i < me.bananaCount; i++) {
    let x = bananaStartX + i * 50;
    image(banana, x, bananaStartY, size, size);
  }
  startY = bananaStartY + 40;

  // **Display "Me" Watermelons**
  let watermelonStartX = (width - (me.watermelonCount * 50 - 50)) / 2;
  let watermelonStartY = startY;
  for (let i = 0; i < me.watermelonCount; i++) {
    let x = watermelonStartX + i * 50;
    image(watermelon, x, watermelonStartY, size, size);
  }
  startY = watermelonStartY + 40;

  // **Display Guests**
  for (let j = 0; j < guests.length; j++) {
    if (guests[j] === me) continue;

    let guestHippoStartX = width / 2;
    let guestHippoStartY = startY + 40;
    image(hippoImages[guests[j].hippoImg], guestHippoStartX, guestHippoStartY, size, size);

    startY = guestHippoStartY + 50;

    // **Guest Bananas**
    let guestBananaStartX = (width - (guests[j].bananaCount * 50 - 50)) / 2;
    let guestBananaStartY = startY;
    for (let i = 0; i < guests[j].bananaCount; i++) {
      let x = guestBananaStartX + i * 50;
      image(banana, x, guestBananaStartY, size, size);
    }
    startY = guestBananaStartY + 40;

    // **Guest Watermelons**
    let guestWatermelonStartX = (width - (guests[j].watermelonCount * 50 - 50)) / 2;
    let guestWatermelonStartY = startY;
    for (let i = 0; i < guests[j].watermelonCount; i++) {
      let x = guestWatermelonStartX + i * 50;
      image(watermelon, x, guestWatermelonStartY, size, size);
    }
    startY = guestWatermelonStartY + 40;
  }

  // **Restart Prompt**
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
  // Reset scores and positions for "me"
  me.bananaCount = 0;
  me.watermelonCount = 0;
  me.x = screenWidth - 25; // Initial position of the hippo
  me.y = screenHeight - 25;

  // Reset scores and positions for each guest
  for (let i = 0; i < guests.length; i++) {
    guests[i].bananaCount = 0; // Reset guest banana count
    guests[i].watermelonCount = 0; // Reset guest watermelon count
    guests[i].x = screenWidth - 25; // Initial position of the guest's hippo
    guests[i].y = screenHeight - 25;
  }

  // Clear the fruits array
  fruits = [];
  shared.sharedFruits = [];

  // Generate new fruits
  fruitGeneration();
}
