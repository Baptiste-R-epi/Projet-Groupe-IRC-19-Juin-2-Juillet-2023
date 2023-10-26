const insult = require("../insult");

let io, channels, users;

exports.init = (setIo, setChannels, setUsers) => {
	io = setIo;
	channels = setChannels;
	users = setUsers;
}

exports.do = (data, socket) => {
	if (!data.match(/^\w{3,25}$/)) {
		socket.emit("display message", `(SERVER) ${data} did not respect the format : letters from a-Z, numbers from 0-9, a lenght between 3-25 chars, symbol '_', no spaces allowed (${insult.say()})!`, '#F5C830');
	} else if (!users[data]) {
		io.emit("display message", `(SERVER) ${socket.username} is now called ${data}!`, '#1ac85d');
		delete users[socket.username];
		users[data] = socket;
		socket.username = data;
		socket.emit("command", "nick", data);
	} else {
		socket.emit("display message", `(SERVER) ${data} is already taken, ${insult.say()}!`, '#d32522');
	}
}