export const setCellHandlers = (props) => {
	const {callback} = props;

	for (var i = 0; i < 49; i++) {
		document.getElementById(`light${i}`).onclick = (e) => {
			let currentClassName = e.currentTarget?.className;
			e.currentTarget.className = (currentClassName === 'alive') ? 'dead' : 'alive';

			if (callback) { callback(); }
		};
	}
};

export const updateCellsBG = (pattern) => {
	if (pattern.length == 50) {
		pattern.shift();
	}
	for (let i = 0; i < 49; i++) {
		let cell = document.getElementById(`light${i}`);
		cell.style.backgroundColor = `rgb(${pattern[i][0]}, ${pattern[i][1]}, ${pattern[i][2]})`;
	}
}

export const setMessage = (msg) => {
	const message = document.createElement('pre');
	message.innerHTML = msg;
	document.forms[0].appendChild(message);
};

// Remove any existing message
export const clearMessages = () => {
	const messages = document.getElementsByTagName('pre');

	for (let message of messages) {
		// I think there's a bug here... (with the browser not the code)
		message.remove();
	};
}