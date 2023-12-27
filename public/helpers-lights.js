
var tick = function (worldBools) {
	var sideLength = 7;

	var pointToIndex = function (point) {
		return point.x + (point.y * sideLength);
	}

	var indexToPoint = function (index) {
		var pointX = index % sideLength;
		var pointY = Math.floor(index / sideLength);
		return { x: pointX, y: pointY };
	}

	var pointEquals = function (p1, p2) {
		return p1.x == p2.x && p1.y == p2.y;
	}

	var neighbours = function (p) {
		return [{ x: p.x - 1, y: p.y - 1 }, { x: p.x, y: p.y - 1 }, { x: p.x + 1, y: p.y - 1 },
		{ x: p.x - 1, y: p.y }, { x: p.x + 1, y: p.y },
		{ x: p.x - 1, y: p.y + 1 }, { x: p.x, y: p.y + 1 }, { x: p.x + 1, y: p.y + 1 }]
			.map(wrapPoints);
	};

	var wrapPoints = function (point) {
		return { x: inBound(point.x), y: inBound(point.y) };
	}

	var inBound = function (coord) {
		if (coord == -1) { return sideLength - 1; }
		if (coord >= sideLength) { return coord % sideLength; }
		return coord;
	}

	var livePoints = worldBools.reduce(function (acc, elem, index) {
		if (elem) { acc.push(index); }
		return acc;
	}, []).map(indexToPoint);

	});

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

};

module.exports = tick