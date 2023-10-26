exports.do = (data, socket, users) => {
	if (users[data] || data === "") {
		socket.emit("user exists", data, true);
	} else {
		socket.emit("user exists", data, false);
		socket.username = data;
		socket.channel = 'general';
		users[data] = socket;
		socket.join('general');
		socket.broadcast.emit('display message', `${socket.username} has logged on!`, '#1ac85d');
	}
}