/* Require e Instancias (importando modulos)*/
const express = require('express');
const http = require('http');
const path = require('path');
let io = require('socket.io');
const hbs = require('hbs');
let connections = 0;

const app = express();
const server = http.createServer(app);
io = io.listen(server);

//Configuraciones Iniciales, Sets y registro de directorios
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
hbs.registerPartials(__dirname + '/views/partials');

//llamada al template principal
app.get('/', function(req, res){
    res.render('index', { title: 'A dibujar' });
  });

//Se obtiene el número de conexiones entrantes
io.sockets.on('connection', function (socket) {
  connections++;
  console.log('conectado', connections);
  socket.broadcast.emit('connections', {connections:connections});

  // Se detecta el evento del mouse
  socket.on('mousemove', function (data) {
    // transmisión del movimiento a los demás usuarios
    socket.broadcast.emit('move', data);
  });

  //Se muestra el estado de conexiones (on/off) de los invitad@s 
  socket.on('disconnect', function() {
    connections--;
    console.log('conectado', connections);
    socket.broadcast.emit('conecciones', {connections:connections});
  });
});

//Definer el estado de ejecución sobre el puerto
server.listen(app.get('port'), () => {
  console.log(`Servidor de Express escuchando en el puerto: ${app.get('port')}`);
});
