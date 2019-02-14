# Installation for A6: Datalogging

1. Verify that you have programmed your Arduino and check that you can run the serial monitor and get values that make sense. Once you have, then close the serial monitor and leave the Arduino plugged in. *Make sure the Arduino is plugged in when you run your webpage.*
2. Download the "server" binary [here](https://github.com/vanevery/p5.serialcontrol/releases)
3. Follow the instructions to install it. Then run the program. Press "List Ports" and select the serial port that corresponds to your Arduino (probably something like "usbmodem" on Mac/other Unix or "COM" and some number on Windows). Press "Enabled." You should see the same serial output. Then uncheck "Enabled." *Make sure this program is running when you run your webpage.*
4. Download full `p5.js complete` from [here](https://p5js.org/download/).
5. Download the `hcde439` folder from the [course github](https://github.com/machineagency/hcde439). The easiest way to do this is just to download a zip somewhere and unzip it. Note that there is a folder called `p5` here, but we are only copying from this `p5` into the 
6. Get this folder: `hcde439/p5/hcde439-example/`
7. Move this `hcde439-example` folder into the folder from your `p5.js complete` download. So you should see `empty-example/` and `hcde439-example` right next one another. Verify that this is correct before moving on.
8. From the downloaded `hcde439-example` folder, go to this folder `hcde439-example/p5/addons` and copy the file named `p5.serialport.js` and move it into the folder in your `p5.js complete` download named `addons`.
9. Your file structure should look like the screenshot (*see PDF in class Slack*). 
10. Open `p5/hcde439-example/index.html` in a non-Internet Explorer browser. You should be able to see "Button On" which changes back and forth to "Button Off." If you encounter issues, right click on the webpage click "Inspect" or something like that. A pane should pop up. Navigate to the console where you can see error output, and where you can also play around with p5 commands in an interactive environment! (Hint: try using the `eclipse()` function in the browser's console)
11. Go into `script.js` and comment all the code in `draw()`. Instead, within `draw()` write `graphData(datain)`.
