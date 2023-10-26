const insult = require("../insult");

let channels;

exports.init = (setChannels) => {
	channels = setChannels;
}

exports.do = (data, socket) => {
	if (!channels[data]) {
		socket.emit("display message", `(SERVER) Channel #${data} does not exists, ${insult.say()}.`, '#F5C830');
	} else if (data === socket.channel) {
		socket.emit("display message", `(SERVER) You already are on the #${data} channel, ${insult.say()}.`, '#F5C830');
	} else {
		socket.emit("command", "join", data);
		socket.broadcast.to(socket.channel).emit("display message", `${socket.username} has left the channel.`, '#d32522');
		socket.emit("display message", `(SERVER) You joined the #${data} channel.`, '#1ac85d');
		socket.broadcast.to(data).emit("display message", `${socket.username} has join the channel.`, '#1ac85d');
		socket.leave(socket.channel);
		socket.join(data);
		socket.channel = data;
	}
}