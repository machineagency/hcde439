const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch
const barWidth = 5;

let port, connectBtn, barX; // Declare global variables

function setup() {
  setupSerial(); // Run our serial setup function (below)

  createCanvas(windowWidth, windowHeight); // Create a canvas that is the size of our browser window
  background("gray"); // Set the background to gray initially

  barX = 0; // Initialize the bar's x position to 0 (left side of screen)
  noStroke(); // Turn off stroke
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return

  // trim the whitespace (the newline) and convert the string to a number
  const reading = Number(str.trim());

  // Map the reading to the window height
  const barHeight = map(reading, 512, 1023, 0, windowHeight);

  // Full-height purple bar to erase previous bar
  fill("purple");
  rect(barX * barWidth, 0, barWidth, windowHeight);

  // Coral-colored bar where reading is mapped to height
  fill("coral");
  rect(barX * barWidth, windowHeight - barHeight, barWidth, barHeight);

  // Blue tracker line which will get erased on the next loop
  fill("aqua");
  rect((barX + 1) * barWidth, 0, barWidth, windowHeight);

  // Increment barX for the next loop
  barX++;
  // at the edge of the screen, go back to the beginning:
  if (barX * barWidth >= windowWidth) {
    barX = 0;
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
