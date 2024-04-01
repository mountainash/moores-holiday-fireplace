import { clearMessages, getFormValues, setCellHandlers, updateCellsBG } from './helpers-dom.js';
import { colorsToPattern, randomColor, rgbToArray, sendToServer } from './helpers-lights.js';
import { fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7, palette_cycles } from './patterns.js';

const form = document.forms[0];

let timeoutID;

const uiReset = () => {
	clearMessages();
	clearTimeout(timeoutID);
};

const setLights = async (lightsPattern) => {
	if (await sendToServer({ 'host': getFormValues().host, 'pattern': lightsPattern })) {
		updateCellsBG(lightsPattern);
	} else {
		console.error('Clear timeoutID');
		clearTimeout(timeoutID);
	}
};

const submit = async (e) => {
	if (e) e.preventDefault();

	uiReset();

	let lightsPattern = [];

	// Get the current pattern from the DOM table
	for (let i = 0; i < 49; i++) {
		let bgColor = window.getComputedStyle(document.getElementById(`light${i}`)).getPropertyValue('background-color');
		lightsPattern.push(rgbToArray(bgColor));
	}

	setLights(lightsPattern);
};

// Init
setCellHandlers({ callback: submit });
form.addEventListener('submit', submit);

// find any cells that match the color and change them to the new color
const findAndChange = (id, color) => {
	// TODO: need to link to the event listener below
	const cells = document.querySelectorAll(`[style*="${id}"]`);

	for (let i = 0; i < cells.length; i++) {
		cells[i].style.backgroundColor = color;
	}
};


// gets the currently set colors from both color inputs, then updates the cells
// 'input' allows getting the event as the user is changing it
form.aliveColour.addEventListener('input', submit, false);
form.deadColour.addEventListener('input', submit, false);

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
		// don't overright the coloured cells in the previous pattern, only update the black cells

		setLights(lightsPattern);

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

		setLights(lightsPattern);

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

		setLights(lightsPattern);

	}, getFormValues().timing);
});

/* Preset: RANDOM */
document.getElementById('preset-random').addEventListener('click', () => {
	uiReset();

	timeoutID = setInterval(async () => {
		clearMessages();

		const lightsPattern = Array(50).fill(randomColor());

		setLights(lightsPattern);

	}, getFormValues().timing);
});
