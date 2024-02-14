const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
const MIN_CIRCLES = 6;
const MAX_CIRCLES = 50;
let port, connectBtn, rotation; // Declare global variables

function setup() {
  setupSerial(); // Run our serial setup function (below)

  createCanvas(windowWidth, windowHeight); // Create a canvas that is the size of our browser window
  background("black");

  rotation = 0;
  noStroke();
  blendMode(SCREEN);
  colorMode(HSB, 100); // Set our color mode to HSB (which lets us easily make a rainbow)
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.

  // Trim whitespace and split on commas.
  // This time, use handy-dandy array destructuring to name each element.
  let [a0, a1, a2, distance, button] = str.trim().split(",");

  let numCircles = round(map(Number(a0), 512, 1023, MIN_CIRCLES, MAX_CIRCLES));
  let r1 = map(Number(a1), 512, 1023, 0, 50);
  let r2 = map(Number(a2), 512, 1023, 100, 300);

  // Uncomment this to use the measured distance instead of a1 for the circle diameter
  // let diameter = constrain(map(Number(distance), 0, 300, 300, 20), 20, 300);
  let diameter = map(Number(a1), 512, 1023, 5, 100);

  if (Number(button) === 0) {
    // If button is not pressed clear the screen and rotate clockwise
    clear();
    background(0);
    rotation += 0.01;
  } else {
    // If button is pressed, reverse rotation and don't clear the screen
    rotation -= 0.01;
  }

  // Move the origin to the center of the screen and rotate to our current rotation
  translate(width / 2, height / 2);
  rotate(rotation);

  // Calculate the angle we should rotate in between each circle (in radians)
  let angle = (2 * PI) / numCircles;

  // For each circle
  for (let i = 0; i < numCircles; i++) {
    rotate(angle);
    // Set inner circle fill color by mapping the current angle to a hue value
    fill(map(i * angle, 0, 2 * PI, 0, 100), 70, 70);
    // Draw inner circle
    circle(0, r1, diameter);
    // Set outer circle fill color by mapping the current angle to a hue value (but opposite)
    fill(map(i * angle, 2 * PI, 0, 0, 100), 70, 70);
    // Draw outer circle
    circle(0, r2, diameter);
  }
}

// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}
