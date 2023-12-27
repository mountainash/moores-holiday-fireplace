import { clearMessages, getFormValues, setCellHandlers, updateCellsBG } from './helpers-dom.js';
import { colorsToPattern, randomColor, rgbToArray, sendToServer } from './helpers-lights.js';
import { fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7, palette_cycles } from './patterns.js';

console.log(fireRow7);
const form = document.forms[0],
	holidayHost = getFormValues().host;

let timeoutID;

function uiReset() {
	clearMessages();
	clearTimeout(timeoutID);
}

const submit = async (e) => {
	if (e) e.preventDefault();

	uiReset();

	let timing = getFormValues().timing,
		lightsPattern = [];

	// Get the current pattern from the DOM table
	for (let i = 0; i < 49; i++) {
		let bgColor = window.getComputedStyle(document.getElementById(`light${i}`)).getPropertyValue('background-color');
		lightsPattern.push(rgbToArray(bgColor));
	}

	if (await sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
		updateCellCss(aliveColour, deadColour);
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
	let rulesList = document.styleSheets[0].cssRules;

	if (rulesList) {
		for (let i = 0; i < rulesList.length; i++) {
			let rule = rulesList[i];
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
	const formValues = getFormValues(),
		aliveColour = formValues.aliveColour,
		deadColour = formValues.deadColour;
	updateCellCss(aliveColour, deadColour);
	submit();
};

// Init
setCellHandlers({ callback: submit });
form.addEventListener('submit', submit);

// 'input' gets the color as the user is changing it
form.aliveColour.addEventListener('input', setColorHandlers, false);
form.deadColour.addEventListener('input', setColorHandlers, false);

/* Preset: FIRE */
document.getElementById('preset-fire').addEventListener('click', () => {
	// let's make a fire
	// wrap in a timer to call based on timing
	uiReset(); // clear the old timer before creating a new one
	let i = 0;

	timeoutID = setInterval(async () => {
		clearMessages();

		// TODO: finish this....
		const patterns = [fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7].reverse();
		const lightsPattern = patterns[i];
		// const lightsPattern = window[`fireRow${i}`];

		if (await sendToServer({ 'host': holidayHost, 'pattern': lightsPattern })) {
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
	}, getFormValues().timing);
});

/* Preset: CYCLES */
document.getElementById('preset-cycles').addEventListener('click', async () => {
	uiReset();
	let l = 1, // limit of colors to use
		g = 5; // grouping size of colors
	const swatchesLength = palette_cycles.length;

	timeoutID = setInterval(async () => {
		clearMessages();

		// TODO: make pattern shift based on timing
		const lightsPattern = colorsToPattern(palette_cycles, l, g);

		if (await sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
			updateCellsBG(lightsPattern);

		l++;
		if (l > palette_cycles.length) {
			l = 1;
		}

		g--;
		if (g < 0) {
			g = 6;
		}
	}, getFormValues().timing);
});

/* Preset: GLITTERBOMB */
document.getElementById('preset-glitterbomb').addEventListener('click', async () => {
	uiReset();

	timeoutID = setInterval(async () => {
		clearMessages();

		const lightsPattern = Array(50);

		for (let i = lightsPattern.length - 1; i >= 0; --i) {
			lightsPattern[i] = randomColor();
		};

		if (await sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
			updateCellsBG(lightsPattern);

	}, getFormValues().timing);
});

/* Preset: RANDOM */
document.getElementById('preset-random').addEventListener('click', () => {
	uiReset();

	timeoutID = setInterval(async () => {
		clearMessages();

		const lightsPattern = Array(50).fill(randomColor());

		if (await sendToServer({ 'host': holidayHost, 'pattern': lightsPattern }))
			updateCellsBG(lightsPattern);

	}, getFormValues().timing);
});
