if !process.argv[2]
    throw 'No connection port provided (/dev/something)'

express             = require 'express'
jade                = require 'jade'
LuminoDataReader    = require './core/LuminoDataReader'
socketio            = require 'socket.io'
app                 = express()

server = app.listen 3000, () ->
    console.log 'Server is listening on port %d', server.address().port

io = socketio.listen server

LDR = LuminoDataReader.get process.argv[2], io

app.engine 'jade', jade.__express

app.set 'views', __dirname + '/views'
app.set 'view engine', 'jade'
app.use express.static 'assets'

app.get '/', (request, response) ->
    response.render 'home'

app.get '/test', (request, response) ->
    response.render 'test'

app.get '/timeline', (request, response) ->
    response.render 'timeline'
