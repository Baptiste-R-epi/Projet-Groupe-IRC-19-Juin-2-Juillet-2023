import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Header from './Components/Header';
import "./Scss/style.css"
import './Scss/index.css'

const socket = io.connect("http://localhost:3001");

const App = () => {
	const call_window = () => {
		window.addEventListener("keydown", (key) => {
			if (key.key === "c" && key.ctrlKey && username)
				refSideNavOpen.current ? closeNav() : openNav();
			if (key.key === "Escape")
				closeNav();
		});

		window.addEventListener('click', (click) => {
			if (refSideNavOpen.current && !(click.target.id === "mySidenav" || click.target.className === "span-sidenav"))
				closeNav();
		});
	};

	// Responsable pour fermer la Sidebar apres un click soit sur le boutton prevue a cet effet soit au click sur une commande
	const closeNav = () => {
		refSideNav.current.style.width = "0%";
		refSideNavOpen.current = false;
	};

	const openNav = () => {
		refSideNav.current.style.width = "30%";
		refSideNavOpen.current = true;
	};

	const [username, setUsername] = useState("");
	const [channel, setChannel] = useState("");
	const [hasError, setErrors] = useState(false);
	const [stan, setStan] = useState(false);

	const refListMessages = useRef();
	const refInputMessage = useRef();
	const refFormMessage = useRef();
	const refInputUsername = useRef();
	const refUserSet = useRef(false);
	const refSideNav = useRef();
	const refSideNavOpen = useRef(false);
	const refStan = useRef(false);
	const refStanIntervalId = useRef();
	const refCommands = useRef([
		"nick",
		"list",
		"create",
		"delete",
		"join",
		"leave",
		"users",
		"msg"
	]);

	const updateStan = (action, value) => {
		switch (action) {
			case "add":
				if (!refStan.current)
					return;
				refStan.current += value;
				setStan(refStan.current);
				break;
			case "set":
				refStan.current = value;
				setStan(value);
				break;
			default:
				return;
		}

		if (refStan.current >= 100) {
			socket.emit("stan", "loose");
			window.location.reload()
		} else if (refStan.current <= 0) {
			socket.emit("stan", "win");
			display_msg(`You have defeated the Great Beast! Stan hys laas!`, "#1ac85d");
		} else
			return;

		clearInterval(refStanIntervalId.current);
		refStan.current = false;
		setStan(false);
	}

	// S'execute lorsque le username est validé. Add events là car sinon, ils sont activés deux fois. 
	useEffect(() => {
		if (!username || refUserSet.current)
			return;

		display_msg(`You have logged on as ${username}!`);

		refSideNav.current = document.getElementById("mySidenav");
		document.getElementsByClassName("span-sidenav")[0].onclick = openNav;
		document.getElementsByClassName("closebtn")[0].onclick = closeNav;

		socket.on("display message", (data, color) => {
			let scrHeight = refListMessages.current.scrollHeight,
				scrTop = refListMessages.current.scrollTop,
				offHeight = refListMessages.current.offsetHeight;
			const isBottom = scrHeight === 0 || scrTop === scrHeight - offHeight;

			const message = document.createElement('li');
			message.textContent = data;
			if (color)
				message.style.color = color;
			refListMessages.current.appendChild(message);
			if (isBottom)
				message.scrollIntoView();
		});

		// Mets à jour les info client pour le front
		socket.on("command", (type, data) => {
			switch (type) {
				case "nick":
					setUsername(data);
					break;
				case "join":
					setChannel(data);
					break;
				case "stan":
					if (refStan.current) {
						display_msg(`Your invocation only strengthened Stan !`, "#D32522");
						updateStan("add", 5);
						break;
					}
					refInputMessage.current.disabled = true;
					display_msg(`Something dark is lurking the IRC…`, "#FFFF00");
					setTimeout(() => display_msg(`The Great BEAST is approaching…`, "#FFA500"), 2000);
					setTimeout(() => display_msg(`/!\\ FINAL BOSS INCOMING /!\\`, "#FF4500"), 4000);
					setTimeout(() => {
						display_msg(`/!\\ STAN HAS AWOKEN /!\\ SUBMIT OR BE DESTROYED /!\\`, "#D32522");
						updateStan("set", 87);
						refInputMessage.current.disabled = false;
						let interval = setInterval(() => {
							updateStan("add", 1);
						}, 2000);
						refStanIntervalId.current = interval;
					}, 6000);
					break;
				default:
					break;
			}
		});

		call_window();

		refUserSet.current = true;

		// eslint-disable-next-line
	}, [username]);

	// Fonction intelligente créée par Baptiste Le Grand IIème du nom, créer une reference a la liste de message pour y ajouter un nouvel element content un <msg>
	const display_msg = (msg, color) => {
		let scrHeight = refListMessages.current.scrollHeight,
			scrTop = refListMessages.current.scrollTop,
			offHeight = refListMessages.current.offsetHeight;
		const isBottom = scrHeight === 0 || scrTop === scrHeight - offHeight;

		if (!username)
			return;
		const message = document.createElement('li');
		if (color)
			message.style.color = color;
		message.textContent = msg;
		refListMessages.current.appendChild(message);
		if (isBottom)
			message.scrollIntoView();
	}

	const sendMessage = (e) => {
		e.preventDefault();
		let message = refInputMessage.current.value.trim();

		if (message === "")
			return;
			
		if (message[0] === "/") {
			let command = message.split(" ", 1)[0];
			command = command.substring(1);
			message = message.substring(command.length + 2);
			socket.emit("command", command, message);
		} else
			socket.emit("send message", message);

		refInputMessage.current.value = '';
		updateStan("add", -message.length / 2);
	};

	// sendUsername senvoie la sasie traitée grace à l'event send username
	const sendUsername = (e) => {
		e.preventDefault();
		const message = refInputUsername.current.value.trim();
		socket.emit("send username", message);
	};

	socket.on("user exists", (data, test) => {
		if (!test) {
			refInputUsername.current.value = '';
			setUsername(data);
			setChannel("general");
		} else
			setErrors(data);
	});

	// Fontion créée par Yoann De GrosSciHairté 1er du nom
	// qui a pour role de supplenter toute saisie post-click et d'y coller la valeur de la commande cliquée et redonner le focus dans la saisie
	const pasteCommand = (e) => {
		closeNav();
		refInputMessage.current.value = e.target.textContent + " ";
		refInputMessage.current.focus();
	};

	return (
		<>
			{username ? (
				<>
					<Header commands={refCommands.current} currentChannel={channel} stan_status={stan} clicked={(e) => { pasteCommand(e) }} />
					<ul ref={refListMessages} id="messages"></ul>
					<form ref={refFormMessage} id="form-message" className='display-f justify-sb mt-1' onSubmit={(e) => { sendMessage(e) }}>
						<input ref={refInputMessage} id="input-message" autoFocus autoComplete="new-password" placeholder='type your message here or try a command like /nick <new username>...' />
						<button type="submit">Send message</button>
					</form>
				</>
			) : (
				<>
					<div className="container">
						<div className="row justify-center">
							<div className="card">
								<div className="card-body align-center">
									<h1 className="card-title">My_IRC ( ͡° ͜ʖ ͡°)</h1>
									<p className='m-2'>
										Wellcome to My_IRC, the chillest chat area 😎!
									</p>
									{hasError ? (<h2 className='alert-error'>ERROR : The name {hasError} has already been taken!</h2>) : (<></>)}
								</div>
							</div>
						</div>
					</div>
					<div className='continer form-user'>
						<h2 className='m-2'>Enter a username to enter the vaste world of My_IRC</h2>
						<form className='display-f justify-center' onSubmit={(e) => { sendUsername(e) }}>
							<input className="username-input" ref={refInputUsername} autoFocus autoComplete="new-password" pattern='\w{3,25}' />
							<button className="btn-custom" type="submit">Log in</button>
						</form>
					</div>
				</>
			)}
		</>
	);
};

export default App;
