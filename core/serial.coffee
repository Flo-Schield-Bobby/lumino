# Serial communication script

SerialPort = require 'serialPort'

if process.argv[2]
    console.log process.argv[2]
else
    throw 'No connection port provided'

serialPort = new SerialPort.SerialPort process.argv[2], {
  baudrate: 9600
  parser: SerialPort.parsers.readline '\r\n'
}

serialPort.on 'open', () ->
    console.log 'open', serialPort
    serialPort.on 'data', (data) ->
        console.log 'recieved', data
    serialPort.write 'ls\n', (error, results) ->
        console.log 'write', error, results

serialPort.on 'error', (error) ->
    console.log 'error', error
