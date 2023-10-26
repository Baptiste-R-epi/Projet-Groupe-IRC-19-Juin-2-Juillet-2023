const insult = require("../insult");

exports.do = (data, socket) => {
	if (socket.channel === "general") {
		socket.emit("display message", `(SERVER) You are already in the general channel, ${insult.say()}!`, '#F5C830');
		// } else if (channels[socket.channel].owner === socket.username) {
		// 	socket.emit("display message", `(OWNER)You left the #${socket.channel} channel and sent back to #general.`, '#F5C830');
	} else {
		socket.emit("command", "join", "general");
		socket.broadcast.to(socket.channel).emit("display message", `${socket.username} has left the channel.`, '#d32522');
		socket.emit("display message", `(SERVER) You left the #${socket.channel} channel and sent back to #general.`, '#F5C830');
		socket.broadcast.to(data).emit("display message", `${socket.username} has join the channel.`, '#1ac85d');

		socket.leave(socket.channel);
		socket.join("general");
		socket.channel = "general";
	}
}