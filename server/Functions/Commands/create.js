const channelTime = require("../channelTime");
const insult = require("../insult");

let io, channels;

exports.init = (setIo, setChannels) => {
	io = setIo;
	channels = setChannels;
};

exports.do = (data, socket) => {
	if (data === "")
		socket.emit("display message", `(SERVER) /create <channel>, must take an argument other than blank or spaces, ${insult.say()}.`, '#F5C830');
	else if (channels[data])
		socket.emit("display message", `(SERVER) Channel #${data} already exists, ${insult.say()}.`, '#F5C830');
	else {
		channels[data] = {
			name: data,
			owner: socket.id,
			timeOut: 0
		};

		channelTime.set(channels[data]);
		socket.channelsOwner[data] = data;

		io.emit("display message", `Channel #${data} has been created by ${socket.username}. Go spam!`, '#1ac85d');
		socket.broadcast.to(socket.channel).emit("display message", `${socket.username} has left the channel.`, '#d32522');
		socket.emit("command", "join", data);

		socket.leave(socket.channel);
		socket.join(data);
		
		socket.channel = data;
	}
}