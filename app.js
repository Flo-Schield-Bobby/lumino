var LDR, LuminoDataReader, app, express, io, jade, server, socketio;

if (!process.argv[2]) {
  throw 'No connection port provided (/dev/something)';
}

express = require('express');

jade = require('jade');

LuminoDataReader = require('./core/LuminoDataReader');

socketio = require('socket.io');

app = express();

server = app.listen(3000, function() {
  return console.log('Server is listening on port %d', server.address().port);
});

io = socketio.listen(server);

LDR = LuminoDataReader.get(process.argv[2], io);

app.engine('jade', jade.__express);

app.set('views', __dirname + '/views');

app.set('view engine', 'jade');

app.use(express["static"]('assets'));

app.get('/', function(request, response) {
  return response.render('home');
});

app.get('/test', function(request, response) {
  return response.render('test');
});

app.get('/timeline', function(request, response) {
  return response.render('timeline');
});
