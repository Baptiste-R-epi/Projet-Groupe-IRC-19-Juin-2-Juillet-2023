const nick_f = require('./Commands/nick');
const create_f = require('./Commands/create');
const join_f = require('./Commands/join');
const leave_f = require('./Commands/leave');
const delete_f = require('./Commands/delete');
const list_f = require('./Commands/list');
const msg_f = require('./Commands/msg');
const users_f = require('./Commands/users');

let io, channels, users;

exports.init = (setIo, setChannels, setUsers) => {
	io = setIo;
	channels = setChannels;
	users = setUsers;

	nick_f.init(io, channels, users);
	create_f.init(io, channels);
	join_f.init(channels);
	// no init for leave_f => no need
	delete_f.init(io, channels);
	list_f.init(channels);
	msg_f.init(users);
	users_f.init(io, channels, users);
};

exports.nick = nick_f.do;
exports.create = create_f.do;
exports.join = join_f.do;
exports.leave = leave_f.do;
exports.delete = delete_f.do;
exports.list = list_f.do;
exports.msg = msg_f.do;
exports.users = users_f.do;