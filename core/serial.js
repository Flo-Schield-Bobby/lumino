var SerialPort, serialPort;

SerialPort = require('serialPort');

if (process.argv[2]) {
  console.log(process.argv[2]);
} else {
  throw 'No connection port provided';
}

serialPort = new SerialPort.SerialPort(process.argv[2], {
  baudrate: 9600,
  parser: SerialPort.parsers.readline('\r\n')
});

serialPort.on('open', function() {
  console.log('open', serialPort);
  serialPort.on('data', function(data) {
    return console.log('recieved', data);
  });
  return serialPort.write('ls\n', function(error, results) {
    return console.log('write', error, results);
  });
});

serialPort.on('error', function(error) {
  return console.log('error', error);
});
