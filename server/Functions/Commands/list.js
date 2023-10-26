const insult = require("../insult");

let channels;

exports.init = (setChannels) => {
	channels = setChannels;
}

exports.do = (data, socket) => {
	let list = Object.keys(channels).filter(word => word.match(data)).join(", ");
	let message = list ?
		`${data ? `${list.length > 1 ? 'List of channels' : 'List of channel'} matching [${data}]` : `${list !== "general" ? 'List of all channels' : 'The lonely channel'}`} : ${list}.` :
		`There is no channel matching [${data}], ${insult.say()}.`;
	socket.emit("display message", message, list ? '#1ac85d' : '#F5C830');
}