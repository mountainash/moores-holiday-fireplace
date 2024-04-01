import { clearMessages, getFormValues, setCellHandlers, updateCellsBG } from './helpers-dom.js';
import { colorNudge, colorsToPattern, controlledRandom, randomColor, rgbToArray, sendToServer } from './helpers-lights.js';
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
	uiReset(); // clear the old timer before creating a new one
	const patterns = [fireRow2, fireRow3, fireRow4, fireRow5, fireRow6, fireRow7].reverse();

	let i = 0;
	let pattern = Array.from(fireRow7); // copy the array so we don't overwrite the original

	timeoutID = setInterval(async () => {
		clearMessages();
		// don't overwrite the coloured cells in the previous pattern, only update the black cells
		pattern.forEach((rgb, index) => {
			if (rgb[0] === 0 && rgb[1] === 0 && rgb[2] === 0) {
				if (controlledRandom(0, 10 * i, 1) > 9 * i) {
					// The spread of "random" increases with the iteration. Only change if the random number is a slightly less factorlet color = controlledRandom(0, 255, 1);
					pattern[index] = patterns[i][index];
				}
			}
			let color = colorNudge(pattern[index], 4);
			if (color[0] === color[1]) { // remove greys
				color = [0, 0, 0];
			}
			pattern[index] = color;
		});

		setLights(pattern);

		i++;
		// reset the loop
		if (i >= patterns.length) {
			i = 0;
			pattern = Array.from(fireRow7);
		}
	}, getFormValues().timing);
});

/* Preset: CYCLES */
document.getElementById('preset-cycles').addEventListener('click', async () => {
	uiReset();
	let l = 1, // limit of colors to use
		g = 5; // grouping size of colors

	timeoutID = setInterval(async () => {
		clearMessages();

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

	const lightsPattern = Array(50);

	timeoutID = setInterval(async () => {
		clearMessages();

		for (let i = 0; i < lightsPattern.length; i++) { // this could be done with a map, but it's faster this way
			lightsPattern[i] = randomColor();
		};

		setLights(lightsPattern);

	}, getFormValues().timing);
});

/* Preset: GLITTERSHIMMER */
document.getElementById('preset-glittershimmer').addEventListener('click', async () => {
	uiReset();

	let lightsPattern = Array(50).fill(1).map(_ => randomColor());

	timeoutID = setInterval(async () => {
		clearMessages();

		for (let i = 0; i < lightsPattern.length; i++) {
			lightsPattern[i] = colorNudge(lightsPattern[i], 7);
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
