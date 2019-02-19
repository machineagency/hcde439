var serial; // variable to hold an instance of the serialport library
var portName = '/dev/ttyACM0' //rename to the name of your port
var inData;


function setup() {
    serial = new p5.SerialPort();       // make a new instance of the serialport library
    serial.on('list', printList);       // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen);        // callback for the port opening
    serial.on('data', serialEvent);     // callback for when new data arrives
    serial.on('error', serialError);    // callback for errors
    serial.on('close', portClose);      // callback for the port closing

    serial.list();                      // list the serial ports
    serial.open(portName);              // open a serial port
    createCanvas(1200, 800);
}

// get the list of ports:
function printList(portList) {
    // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {
	// Display the list the console:
	print(i + " " + portList[i]);
    }
}

function serverConnected() {
    print('connected to server.');
}

function portOpen() {
    print('the serial port opened.')
}

function serialError(err) {
    print('Something went wrong with the serial port. ' + err);
}

function portClose() {
    print('The serial port closed.');
}

function serialEvent() {
    if (serial.available()) {
	inData = serial.read();
	console.log("got back " + inData); 
    }
}

function keyPressed() {
    //console.log("writing key");
    serial.write(key);
}

function draw() {
    background(0);
    fill(255);
    text("inData: " + inData, 30, 30);
}
