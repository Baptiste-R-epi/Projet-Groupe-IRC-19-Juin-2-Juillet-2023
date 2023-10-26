let io, channels;

const seconds = 300 * 1000;

exports.init = (setIo, setChannels) => {
	io = setIo;
	channels = setChannels;
};

const death = (channel) => {
	io.emit("display message", `(SERVER) The channel #${channel.name} has died of old age.`, '#F5C830');
	io.to(channel.name).emit("display message", `You have been redirect to general following the death of the previous channel.`, '#eba21a');

	io.sockets.adapter.rooms.get(channel.name).forEach((user_id) => {
		io.to("general").emit("display message", `${io.sockets.sockets.get(user_id).username} has joined the channel.`, '#1ac85d');
	});

	io.sockets.adapter.rooms.get(channel.name).forEach((user_id) => {
		const user_socket = io.sockets.sockets.get(user_id);
		user_socket.leave(channel.name);
		user_socket.join("general");
		user_socket.channel = "general";
		user_socket.emit("command", "join", "general");
	});

	delete channels[channel.name];
};

exports.set = (channel) => {
	if (channel.name === "general")
		return;
	if (channel.timeOut)
		clearTimeout(channel.timeOut);
	channel.timeOut = setTimeout(death, seconds, channel);
};