var gametick = require('./game');

var setHandlers = function(handler) {
    for (var i = 0; i < 49; i++) {
        var elem = document.getElementById(i);
        elem.onclick = handler
    }
};

var toggleState = function() {
    if (this.className === 'alive') {
        this.className = 'dead';
    } else {
        this.className = 'alive';
    }
};

var submit = function() {
    var button = document.getElementById('button');
    button.parentNode.removeChild(button); 

    var tickDelay = getValue('tickDelay');
    var aliveColour = getValue('aliveColour');
    var deadColour = getValue('deadColour');
    var worldPattern = [];
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
    http.open('POST','/holiday',true);
    http.setRequestHeader('Content-type','application/json;charset=UTF-8');
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            setMessage('Pattern sent');
            displayTicks(worldPattern, tickDelay, aliveColour, deadColour);
        } else if (http.readyState == 4) {
            setMessage('Network error');
        }
    };
    http.send(JSON.stringify(data));
};

var updateCells = function(cellBools) {
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

var displayTicks = function(seedPattern, delay, alive, dead) {
    updateCellCss(alive, dead);
    setHandlers(null);
    doTick(seedPattern, delay);
};

var doTick = function(state, delay) {
    setTimeout(function() {
        if (state.indexOf(true) != -1) {
            var newWorld = gametick(state);
            updateCells(newWorld);
            doTick(newWorld, delay);
        }
    }, delay); 
}

var updateCellCss = function(newAlive, newDead) {
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

var setMessage = function(msg) {
    var message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = msg;
    document.body.appendChild(message);
}; 

var getValue = function(elemId) {
    return document.getElementById(elemId).value;
};

// Initial setup
setHandlers(toggleState);
document.getElementById('button').onclick = submit;
