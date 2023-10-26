const adjectives = [
	"dumb",
	"stupid",
	"boring",
	"sadge",
	"faking",
	"silly",
	"smelly",
	"freaking",
	"deep",
];

const insults = [
	"donut",
	"monkey",
	"donkey",
	"bass",
	"human",
	"moron",
	"sheet",
	"dog",
	"trollop",
	"goose",
];

exports.say = () => {
	let rand = Math.floor(Math.random() * adjectives.length);
	let adjective = adjectives[rand];
	rand = Math.floor(Math.random() * insults.length);
	let insult = insults[rand];

	return adjective + " " + insult;
};