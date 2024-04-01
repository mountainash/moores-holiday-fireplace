import { setMessage } from './helpers-dom.js';

const black = [0, 0, 0];

export const hexToRgb = function (hex) {
	var re = /#(\w{2})(\w{2})(\w{2})/;
	var result = re.exec(hex);
	if (result) {
		return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
	}
	return black;
};

export const rgbToArray = (rgb) => {
	var re = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
	var result = re.exec(rgb);
	if (result) {
		return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];
	}
	return black;
};

// takes a palette array of many rgb colors and a number to limit the choice of colors
// takes an optional 3rd argument to determin the grouping of colors
// returns an array of 50 rgb colors
export const colorsToPattern = (palette, limit, group) => {
	let colorSet = [],
		colorGroup = 0;

	for (let i = 0; i < 50; i++) {
		if (group) {
			colorGroup = Math.floor(i / group);
		}
		colorSet.push(palette[(colorGroup % limit)]);
	}

	return colorSet;
};

export const controlledRandom = (min, max, step) => {
	return Math.floor(Math.random() * (max - min + 1) / step) * step + min;
};

export const randomColor = () => {
	return [controlledRandom(0, 255, 1), controlledRandom(0, 255, 1), controlledRandom(0, 255, 1)];
};

export const sendToServer = async (holidayData) => await fetch('/holiday', {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	},
	body: JSON.stringify(holidayData)
}).
	then(response => {
		if (!response.ok) {
			setMessage('Network error', 'error');
			return false;
		};

		setMessage('Pattern sent');
		return true;
	});
