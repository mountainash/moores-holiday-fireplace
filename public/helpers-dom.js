export const setCellHandlers = (props) => {
	const {callback} = props;

	for (var i = 0; i < 49; i++) {
		document.getElementById(`light${i}`).onclick = (e) => {
			let currentClassName = e.currentTarget?.className;
			e.currentTarget.className = (currentClassName === 'alive') ? 'dead' : 'alive';

			console.log('setCellHandlers', callback);
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
		if (cell)
			cell.style.backgroundColor = `rgb(${pattern[i][0]}, ${pattern[i][1]}, ${pattern[i][2]})`;
	}
}

export const setMessage = (msg, error) => {
	clearMessages();
	const message = document.createElement('pre');
	message.innerHTML = msg;
	message.className = error ? 'error' : 'success';
	document.forms[0].insertBefore(message, null);
};

// Remove any existing messages
export const clearMessages = () => {
	const messages = document.getElementsByTagName('pre');

	for (let i = messages.length - 1; i >= 0; --i) {
		messages[i].remove();
	};
}