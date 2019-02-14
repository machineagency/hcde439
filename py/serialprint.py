import serial
portName = '/dev/ttyACM0'

ser = serial.Serial(portName, 9600)

while True:
  print ser.readline()
