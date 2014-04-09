SerialPort = require 'serialport'

SerialPort.list (error, ports) ->
    ports.forEach (port) ->
        console.log port
