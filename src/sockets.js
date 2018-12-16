const Chat = require('./public/models/chat.js');



module.exports = function(io){
	let users = [];

	io.on('connection', async socket => {

		console.log('new user connected');


		/*--------------------------------------------------*/
		/* AGREGA NUEVO USUARIO Y ENVIA LOS MENSAJES VIEJOS */
		/*--------------------------------------------------*/
		socket.on('new user', async (data,cb) => {
			if (data in users) {
				cb(false);
			}else{
				//avisa que si es valido ,guarda y envia lista de usuario activos
				socket.nickname = data;
				users[socket.nickname] = socket;
				cb(true);
				updateNicknames();

				//busca y envia los mensajes viejos
				let messages = await Chat.find({});
				socket.emit('load old msgs', messages);	
			}
		});


		/*---------------*/
		/* ENIVA MENSAJE */
		/*---------------*/
		socket.on('send message', async (data, cb) => {
			console.log(socket.nickname+' escribio : '+data);
			var msg = data.trim();
			if (msg.substr(0,3) == '/w ') {
				msg = msg.substr(3);
				const index = msg.indexOf(' ');
				if (index !== -1) {
					var name =msg.substring(0,index);
					msg.substring(index + 1);
					if (name in users) {
						users[name].emit('whisper',{
							msg,
							nick : socket.nickname
						});
						users[socket.nickname].emit('whisper',{
							msg,
							nick : socket.nickname
						});
					}else{
						cb('Error ! entra un usuario valido');
					}
				}else{
					cb('Error! por favor ingresa un mensaje');
				}
			}else{
				var newMsg = new Chat({
					msg,
					nick: socket.nickname
				});
				await newMsg.save();

				io.sockets.emit('new message',{
					msg:data,
					nick:socket.nickname
				});
			}
		});


		/*---------------------*/
		/* DESCONECTA USUARIOS */
		/*---------------------*/
		socket.on('disconnect', data => { 
			if (!socket.nickname) return;
			delete users[socket.nickname];
			updateNicknames();
		});

		/*-------------------------*/
		/* ENVIA LISTA DE USUARIOS */
		/*-------------------------*/
		function updateNicknames(){
			io.sockets.emit('usernames', Object.keys(users));
		}
	});
	
}