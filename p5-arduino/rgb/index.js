const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
let port, connectBtn, circleDiameter; // Declare global variables

function setup() {
  setupSerial(); // Run our serial setup function (below)

  // Create a canvas that is the size of our browser window.
  // windowWidth and windowHeight are p5 variables
  createCanvas(windowWidth, windowHeight);

  // Set our circle diameter based on the window dimensions
  circleDiameter = min(windowWidth, windowHeight) * 0.5;

  // p5 text settings. BOLD and CENTER are constants provided by p5.
  // See the "Typography" section in the p5 reference: https://p5js.org/reference/
  textFont("system-ui", 50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  // Set the canvas blend mode. see https://p5js.org/reference/#/p5/blendMode
  blendMode(ADD);
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return.

  let rgbArray = str.trim().split(","); // Trim whitespace and split on commas

  // Convert each element to a number, map it to the RGB range, and round to nearest integer
  const red = round(map(Number(rgbArray[0]), 512, 1023, 0, 255));
  const green = round(map(Number(rgbArray[1]), 512, 1023, 0, 255));
  const blue = round(map(Number(rgbArray[2]), 512, 1023, 0, 255));

  clear(); // Clear the canvas
  background(0); // Make the background black
  translate(windowWidth / 2, windowHeight / 2); // Move the origin to the center

  // Text on top
  fill(255);
  stroke(0);
  strokeWeight(4);
  text(`${red}, ${green}, ${blue}`, 0, -circleDiameter * 0.75);

  // Red circle
  fill(red, 0, 0);
  circle(0, circleDiameter / 4, circleDiameter);

  // Green circle
  rotate((2 * PI) / 3);
  fill(0, green, 0);
  circle(0, circleDiameter / 4, circleDiameter);

  // Blue circle
  rotate((2 * PI) / 3);
  fill(0, 0, blue);
  circle(0, circleDiameter / 4, circleDiameter);
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
