const Header = ({ commands, currentChannel, stan_status, clicked }) => {

	return (
		<header className="container-fluid p-1 pl-0 bg-darkpurple" style={{ position: "sticky", top: 0 }}>
			<div className="width-max">
				<div id="mySidenav" className="sidenav">
					<button className="closebtn">
						&times;
					</button>
					{commands.map((command) => (
						<div key={command + "-command"} className="text-white mb-2" onClick={clicked}>/{command}</div>
					))}
				</div>
				<div className="display-f justify-sb align-center width-max">
					<div className="display-f">
						<span className="span-sidenav">
							&#9776; Commands
						</span>
					</div>
					<div className="boss-bar" style={{ opacity: stan_status ? "100%" : "0%" }}>
						<div className="stan-bar" style={{ width: `${stan_status}%` }} />
					</div>
					<div className="mr-2 text-white">Current channel : <strong>{currentChannel}</strong></div>
				</div>
			</div>
		</header>
	);
};
export default Header;
