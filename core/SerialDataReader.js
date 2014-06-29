var SerialDataReader, SerialPort,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SerialPort = require('serialPort');

SerialDataReader = (function() {
  var DataReader, instance;

  function SerialDataReader() {}

  instance = null;

  DataReader = (function() {
    var serialPort, socketIo, sockets;

    serialPort = null;

    socketIo = null;

    sockets = null;

    function DataReader(port, socketIo) {
      this.bind = __bind(this.bind, this);
      this.serialPort = new SerialPort.SerialPort(port, {
        baudrate: 9600,
        parser: SerialPort.parsers.readline('\r\n')
      });
      this.socketIo = socketIo;
      this.sockets = [];
      this.bind();
    }

    DataReader.prototype.bind = function() {
      var self;
      self = this;
      self.socketIo.sockets.on('connection', function(socket) {
        return self.sockets.push(socket);
      });
      self.serialPort.on('open', function() {
        self.socketIo.emit('open');
        return self.serialPort.on('data', function(data) {
          var socket, _i, _len, _ref, _results;
          _ref = self.sockets;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            socket = _ref[_i];
            _results.push(socket.emit('data', data));
          }
          return _results;
        });
      });
      self.serialPort.on('error', function(error) {
        return self.socketIo.emit('error', error);
      });
      return self.serialPort.on('close', function() {
        return self.socketIo.emit('close');
      });
    };

    return DataReader;

  })();

  SerialDataReader.get = function(port, socketIo) {
    return instance != null ? instance : instance = new DataReader(port, socketIo);
  };

  return SerialDataReader;

})();

module.exports = SerialDataReader;
