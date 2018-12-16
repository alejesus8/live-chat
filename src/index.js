//PIDIENDO LOS MODULOS
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const path =  require('path');

//CONFIGURANDO EL SERVIDOR
const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

//DB CONNECT
mongoose.connect('mongodb://alejesus8:Holachao123*@ds163781.mlab.com:63781/live-chat')
	.then(db => console.log('db is connected'))
	.catch(err => console.log(err));

app.set('port', process.env.PORT || 3000);

require('./sockets')(io);

//ENVIANDO LOS ARCHIVOS ESTATICOS
app.use(express.static(path.join(__dirname,'public')));

//ESCUCHANDO EL SERVER
server.listen(3000, () => {
  console.log('server on port 3000')
});

