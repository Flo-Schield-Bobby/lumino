var SerialPort;

SerialPort = require('serialport');

SerialPort.list(function(error, ports) {
  return ports.forEach(function(port) {
    return console.log(port);
  });
});
