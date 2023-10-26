const insult = require("../insult");

let io, channels, users;

exports.init = (setIo, setChannels, setUsers) => {
	io = setIo;
	channels = setChannels;
	users = setUsers;
}

exports.do = (data, socket) => {
	let channel = data ? data : socket.channel;
	if (!channels[channel]) {
		socket.emit("display message", `(SERVER) Channel #${channel} does not exist, ${insult.say()}.`, '#F5C830');
		return;
	}
	let users_names = [];
	if (!io.sockets.adapter.rooms.get(channel)) {
		socket.emit("display message", `(SERVER) There is no users in #${channel}.`, '#F5C830');
		return;
	}

	io.sockets.adapter.rooms.get(channel).forEach((user_id) => {
		users_names.push(io.sockets.sockets.get(user_id).username);
	});
	socket.emit("display message", `List of users in #${channel} : ${users_names.join(", ")}.`, '#1ac85d');
}