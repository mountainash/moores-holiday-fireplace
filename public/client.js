import { clearMessages, setCellHandlers, updateCellsBG } from './helpers-dom.js';
import { colorsToPattern, randomColor, rgbToArray, sendToServer } from './helpers-lights.js';
import { fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7, palette_cycles } from './patterns.js';

console.log(fireRow7);
const form = document.forms[0],
	holidayHost = form.holidayHost.value;

let timeoutID;

const submit = (e) => {
	if (e) e.preventDefault();
	console.log('submit');

	clearMessages();
	clearTimeout(timeoutID); // clear any old timers

	var timing = form.timing.value,
		aliveColour = form.aliveColour.value,
		deadColour = form.deadColour.value,
		lightsPattern = [];

	// Get the current pattern from the DOM table
	for (var i = 0; i < 49; i++) {
		let bgColor = window.getComputedStyle(document.getElementById(`light${i}`)).getPropertyValue('background-color');
		lightsPattern.push(rgbToArray(bgColor));
	}

	if (sendToServer({
		'host': holidayHost,
		'pattern': lightsPattern,
	})) {
		updateCellCss(aliveColour, deadColour);
	}
};

// TODO: replace from boolean array to color array
const updateCells = (cellBools) => {
	for (var i = 0; i < 49; i++) {
		var newState = cellBools[i];
		var cell = document.getElementById(`light${i}`);
		if (newState) {
			cell.className = 'alive';
		} else {
			cell.className = 'dead';
		}
	}
};

// Changes the colors of the on & off cells
const updateCellCss = (newAlive, newDead) => {
	var rulesList = document.styleSheets[0].cssRules;

	if (rulesList) {
		for (var i = 0; i < rulesList.length; i++) {
			var rule = rulesList[i];
			if (rule.selectorText == '.alive') {
				rule.style.background = newAlive;
			} else if (rule.selectorText == '.dead') {
				rule.style.background = newDead;
			}
		}
	}
};

// Gets the currently set colors from both color inputs, then updates the cells
const setColorHandlers = () => {
	const aliveColour = form.aliveColour.value,
		deadColour = form.deadColour.value;
	updateCellCss(aliveColour, deadColour);
	submit();
};

// Init
setCellHandlers({ callback: submit });
form.addEventListener('submit', submit);

// 'input' gets the color as the user is changing it
form.aliveColour.addEventListener('input', setColorHandlers, false);
form.deadColour.addEventListener('input', setColorHandlers, false);

document.getElementById('preset-fire').addEventListener('click', () => {
	// let's make a fire
	// wrap in a timer to call based on timing
	clearTimeout(timeoutID); // clear the old timer before creating a new one
	let i = 0;

	timeoutID = setInterval(() => {
		clearMessages();

		// TODO: finish this....
		const patterns = [fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7].reverse();
		const lightsPattern = patterns[i];
		// const lightsPattern = window[`fireRow${i}`];

		if (sendToServer({ 'host': holidayHost, 'pattern': lightsPattern })) {
			updateCellsBG(lightsPattern);
		} else {
			clearTimeout(timeoutID);
		}

		i++;
		// stop the loop
		if (i >= patterns.length) {
			// clearTimeout(timeoutID);
			i = 0;
		}
	}, form.timing.value);
});

document.getElementById('preset-cycles').addEventListener('click', () => {
	let lightsPattern = colorsToPattern(palette_cycles, 4, 4);

	if (sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
		updateCellsBG(lightsPattern);

});

document.getElementById('preset-glitterbomb').addEventListener('click', async () => {
	let lightsPattern = Array(50);

	for (let i = lightsPattern.length - 1; i >= 0; --i) {
		lightsPattern[i] = randomColor();
	};

	console.log(sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }));
	updateCellsBG(lightsPattern);
});

document.getElementById('preset-random').addEventListener('click', () => {
	const lightsPattern = Array(50).fill(randomColor());

	if (sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
		updateCellsBG(lightsPattern);
});