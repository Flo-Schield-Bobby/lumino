# Serial communication script

SerialPort = require 'serialPort'

class LuminoDataReader

    instance = null

    class DataReader

        serialPort = null
        socketIo   = null
        sockets    = null

        constructor: (port, socketIo) ->
            @serialPort = new SerialPort.SerialPort port, {
                baudrate: 9600
                parser: SerialPort.parsers.readline '\r\n'
            }
            @socketIo = socketIo
            @sockets = []
            @bind()

        bind: =>
            self = @

            self.socketIo.sockets.on 'connection', (socket) ->
                self.sockets.push socket

            self.serialPort.on 'open', () ->
                self.socketIo.emit 'open'
                self.serialPort.on 'data', (data) ->
                    for socket in self.sockets
                        socket.emit 'data', data
            self.serialPort.on 'error', (error) ->
                self.socketIo.emit 'error', error
            self.serialPort.on 'close', () ->
                self.socketIo.emit 'close'

    @get: (port, socketIo) ->
        instance ?= new DataReader port, socketIo

module.exports = LuminoDataReader
