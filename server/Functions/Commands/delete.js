const insult = require("../insult");

let io, channels;

exports.init = (setIo, setChannels) => {
	io = setIo;
	channels = setChannels;
};

exports.do = (data, socket) => {
	if (!channels[data])
		socket.emit("display message", `(SERVER) You can't delete the channel #${data} : it does not exists, yet...`, '#F5C830');
	else if (data === "general")
		socket.emit("display message", `(SERVER) You can't delete channel #general. And don't you dare trying again, ${insult.say()}!`, '#d32522');
	else if (channels[data].owner !== socket.id)
		socket.emit("display message", `(SERVER) You can't delete the channel #${data} : you are not the owner, ${insult.say()}.`, '#d32522');
	else {
		io.emit("display message", `(SERVER) The channel #${data} has been unalived, sadge.`, '#F5C830');
		io.to(data).emit("display message", `(SERVER) You have been redirect to general due to someone unaliving the previous channel.`, '#F5C830');

		io.sockets.adapter.rooms.get(data).forEach((user_id) => {
			io.to("general").emit("display message", `${io.sockets.sockets.get(user_id).username} has joined the channel.`, '#1ac85d');
		});

		io.sockets.adapter.rooms.get(data).forEach((user_id) => {
			const user_socket = io.sockets.sockets.get(user_id);
			user_socket.leave(data);
			user_socket.join("general");
			user_socket.channel = "general";
			user_socket.emit("command", "join", "general");
		});

		clearTimeout(channels[data].timeOut);

		delete channels[data];
		delete socket.channelsOwner[data];
	}
};