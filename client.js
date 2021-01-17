var gametick = require('./game');
var timeoutID;

var setHandlers = function (handler) {
	for (var i = 0; i < 49; i++) {
		var elem = document.getElementById(i);
		elem.onclick = handler
	}
};

var toggleState = function () {
	if (this.className === 'alive') {
		this.className = 'dead';
	} else {
		this.className = 'alive';
	}
};

var submit = function (e) {
	e.preventDefault();

	var tickDelay = getValue('tickDelay');
	var aliveColour = getValue('aliveColour');
	var deadColour = getValue('deadColour');
	var worldPattern = [];

	if (document.getElementsByTagName('pre').length > 0) {
		document.getElementsByTagName('pre')[0].remove();
	}

	for (var i = 0; i < 49; i++) {
		var state = document.getElementById(i).className;

		if (state === 'alive') {
			worldPattern.push(true);
		} else {
			worldPattern.push(false);
		}
	}

	var data = {
		'host': getValue('holidayHost'),
		'delay': tickDelay,
		'alive': aliveColour,
		'dead': deadColour,
		'pattern': worldPattern
	};

	var http = new XMLHttpRequest();
	http.open('POST', '/holiday', true);
	http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
	http.onreadystatechange = function () {
		if (http.readyState == 4 && http.status == 200) {
			setMessage('Pattern sent');
			displayTicks(worldPattern, tickDelay, aliveColour, deadColour);
		} else if (http.readyState == 4) {
			setMessage('Network error');
		}
	};
	http.send(JSON.stringify(data));
};

var updateCells = function (cellBools) {
	for (var i = 0; i < 49; i++) {
		var newState = cellBools[i];
		var cell = document.getElementById(i);
		if (newState) {
			cell.className = 'alive';
		} else {
			cell.className = 'dead';
		}
	}
};

var displayTicks = function (seedPattern, delay, alive, dead) {
	updateCellCss(alive, dead);
	doTick(seedPattern, delay);
};

var doTick = function (state, delay) {
	clearTimeout(timeoutID); // clear the old one before creating a new one
	timeoutID = setTimeout(function () {
		if (state.indexOf(true) != -1) {
			var newWorld = gametick(state);
			updateCells(newWorld);
			doTick(newWorld, delay);
		}
	}, delay);
}

var updateCellCss = function (newAlive, newDead) {
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
}

var setMessage = function (msg) {
	var message = document.createElement('pre');
	message.innerHTML = msg;
	document.body.insertBefore(message, document.forms[0]);
};

var getValue = function (elemId) {
	return document.getElementById(elemId).value;
};

// Init
setHandlers(toggleState);
document.forms[0].onsubmit = submit;