import { hexToRgb, rgbToArray } from './helpers-lights.js';

export const setCellHandlers = (props) => {
	const {callback} = props;

	for (var i = 0; i < 49; i++) {
		document.getElementById(`light${i}`).onclick = (e) => {
			// sets & toggles the bgColor of the cell being clicked
			const bgColor = window.getComputedStyle(e.currentTarget).getPropertyValue('background-color'),
				formValues = getFormValues(),
				aliveColour = formValues.aliveColour,
				deadColour = formValues.deadColour;

			// stringify as you can't compare arrays (which are actually objects) directly
			e.currentTarget.style.background = (JSON.stringify(rgbToArray(bgColor)) == JSON.stringify(hexToRgb(aliveColour))) ? deadColour : aliveColour;

			if (callback) { callback() }
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
	document.body.insertBefore(message, null);
};

// Remove any existing messages
export const clearMessages = () => {
	const messages = document.getElementsByTagName('pre');

	for (let i = messages.length - 1; i >= 0; --i) {
		messages[i].remove();
	};
}

// Get all the form values and return them as an object
export const getFormValues = () => {
	const form = document.forms[0];

	return {
		host: form.holidayHost.value,
		timing: form.timing.value,
		aliveColour: form.aliveColour.value,
		deadColour: form.deadColour.value,
	};
};
