const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

// Fichiers créés par nos soins
const insult = require('./Functions/insult');
const channelTime = require('./Functions/channelTime');
const sendUsername = require('./Functions/sendUsername');
const command = require('./Functions/command');
const disconnect = require('./Functions/disconnect');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
	cors: {
		origin: 'http://localhost:3000'
	}
});

// tableau d'utilisateurs [name] = socket i.e. users["Fred"] => 0x13sq54x4cwcb2456f.
const users = [];

// Tableau des canaux [name] = [name: string, owner: string, timeout: string].
// Timeout contient l'id du timeout servant à détruire le canal après inactivité.
const channels = [];
channels["general"] = {
	name: "general"
};


// l'event connection est trigger quand quelqu'un arrive sur la page web.
io.on("connection", (socket) => {
	channelTime.init(io, channels);
	command.init(io, channels, users);
	disconnect.init(io, channels, users);
	socket.channelsOwner = [];


	// Les messages reçus par le client sont renvoyés au client, et aux utilisateurs du canal du client.
	// Les messages remettent à jour le timer de suppression du canal, si ça n'est pas le général.
	socket.on("send message", (data) => {
		channelTime.set(channels[socket.channel]);
		socket.broadcast.to(socket.channel).emit("display message", `#${socket.channel} ${socket.username} : ${data}`);
		socket.emit("display message", `#${socket.channel} ${socket.username} (You) : ${data}`);
	});

	// A la connection au chat, check si le username est libre.
	// Si c'est le cas, l'utilisateur est confirmé et envoyé sur le chat général.
	socket.on("send username", (data) => {
		sendUsername.do(data, socket, users);
	})

	// l'event command est destructurer depuis le client side pour échapper la commande et ces arguments
	socket.on("command", (type, data) => {
		switch (type) {

			// /nick <new username> : redéfini le username s'il n'est pas déjà pris.
			case "nick":
				command.nick(data, socket);
				break;

			// /create <new channel> : créé un canal si son nom n'est pas déjà pris.
			case "create":
				command.create(data, socket);
				break;

			// /join <channel> : rejoint le canal spécifié (si c'est valide).
			case "join":
				command.join(data, socket);
				break;

			// /leave : retourne sur le canal général.
			case "leave":
				command.leave(data, socket);
				break;

			// /delete <channel> : détruit le canal si l'utilisateur est le créateur.
			case "delete":
				command.delete(data, socket);
				break;

			// /list optional <channel> : renvoit la liste des canaux, correspondant à <channel> si spécifié.
			case "list": {
				command.list(data, socket);
				break;
			}

			// /msg <user> <message> : envoie un <message> privé au <user>. 
			case "msg":
				command.msg(data, socket);
				break;

			// /users optional <channel> : renvoit la list des users du canal spécifié (si spécifié), ou du canal actuel.
			case "users":
				command.users(data, socket);
				break;

			// SURPRISE, MOTHERFUCKER !
			case "stan":
				socket.emit("command", "stan");
				break;

			default:
				socket.emit("display message", `(SERVER) The command ${type} does not exist, ${insult.say()}.`, '#F5C830');
				break;
		}

	});
	socket.on("stan", (state) => {
		switch (state) {
			case "loose":
				io.emit("display message", `${socket.username} has lost against Stan. Shame on this ${insult.say()}!`, '#F5C830');
				break;
			case "win":
				socket.broadcast.emit("display message", `${socket.username} has defeated the Big Boss! Stan y s'lasse!`, '#1ac85d');
				break;
			default:
				break;
		}
	});

	// l'event disconnect est trigger quand le client ferme son navigateur ou reload la page et ainsi trigger l'envoie d'un mesage signalant la deconnection de ce dernier
	socket.on("disconnect", () => {
		disconnect.on(socket);
	});


});

server.listen(3001, (err) => {
	if (err)
		/*log*/console.log(err);

	/*log*/console.log("\n\t\x1b[1m\x1b[92mMy IRC\x1b[0m");
	/*log*/console.log("\x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~\x1b[0m");
	/*log*/console.log(`Listening on port: \x1b[1m\x1b[92m3001\x1b[0m`);
	/*log*/console.log("\x1b[34m~~~~~~~~~~~~~~~~~~~~~~~~\x1b[0m");
});