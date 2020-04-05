var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let userList = {};

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

//Función para la hora
function timestamp() {
  var date = new Date();
  return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + ' - ';
}

io.on('connection', function(socket){
  console.log('a user connected');

  //Funcion login
  socket.on('login', function (name) {
    userList[socket.id] = name;
    io.emit('users list', userList);
    socket.broadcast.emit('Mensaje:', '¡ ' +timestamp() + 'Usuario: ' + name + ' entró en el chat!');
    socket.emit('chat message', timestamp() + 'Bienvenido al chat ' + name);
    console.log('Usuario conectado: ');
    console.log(userList);
  });

  //Todo lo que se conecta, se debe de desconectar
  socket.on('disconnect', function () {
    delete userList[socket.id];
    io.emit('users list', userList);
  });


  socket.on('chat message', function(msg, user){
    console.log('mensaje de ' + user + ': ' + msg);
    socket.broadcast.emit('chat message', timestamp() + user + ": " + msg);
  });


});

//listen
http.listen(3000, function(){
  console.log('listening on *:3000');
});
