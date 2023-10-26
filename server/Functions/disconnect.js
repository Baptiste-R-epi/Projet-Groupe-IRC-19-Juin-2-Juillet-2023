let io, channels, users;

exports.init = (setIo, setChannels, setUsers) => {
	io = setIo;
	channels = setChannels;
	users = setUsers;
};

exports.on = (socket) => {
	if (!users[socket.username]) {
		return;
	}
	for (const channel in socket.channelsOwner) {
		const owners = io.sockets.adapter.rooms.get(channel);

		if (owners) {
			const new_owner_id = owners.values().next().value;
			const new_owner_socket = io.sockets.sockets.get(new_owner_id);
			io.to(new_owner_id).emit("display message", `(SERVER) You are now owner of the channel #${channel}`, '#F5C830');
			new_owner_socket.broadcast.emit("display message", `(SERVER) ${new_owner_socket.username} is the new owner of the channel #${channel}`, '#F5C830');
			channels[channel].owner = new_owner_id;
			new_owner_socket.channelsOwner[channel] = channel;
		} else {
			io.emit("display message", `(SERVER) The channel #${channel} has been unalived (no owner).`, '#F5C830');
			clearTimeout(channels[channel].timeOut);
			delete channels[channel];
		}
	}
	delete users[socket.username];
	io.emit("display message", `${socket.username} has disconnected!`, '#d32522');
};