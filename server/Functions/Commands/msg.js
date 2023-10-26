const insult = require("../insult");

let users;

exports.init = (setUsers) => {
	users = setUsers;
}

exports.do = (data, socket) => {
	let user = data.split(" ", 1)[0];
	let message = data.substring(user.length + 1);
	if (users[user] === socket) {
		socket.emit("display message", `(SERVER) You can't send private msg to yourself, ${insult.say()}`, '#F5C830');
	} else if (message === "") {
		socket.emit("display message", `(SERVER) Message can't be blank, ${insult.say()}.`, '#F5C830');
	} else if (!users[user]) {
		socket.emit("display message", `(SERVER) User ${user} does not exist (or isn't connected).`, '#d32522');
	} else {
		users[user].emit("display message", `From @${socket.username} : ${message}`, '#9e07e3');
		socket.emit("display message", `Send to @${user} : ${message}`, '#9e07e3');
	}
}