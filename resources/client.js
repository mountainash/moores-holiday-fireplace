var setHandlers = function() {
    for (var i = 0; i < 49; i++) {
        var elem = document.getElementById(i);
        elem.onclick = function() {
            if (this.className === 'alive') {
                this.className = 'dead';
            } else {
                this.className = 'alive';
            }
        };
    }
};

var submit = function() {
    var button = document.getElementById('button');
    button.parentNode.removeChild(button); 

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
        'delay': getValue('tickDelay'),
        'alive': getValue('aliveColour'),
        'dead': getValue('deadColour'), 
        'pattern': worldPattern 
    }; 

    var http = new XMLHttpRequest();
    http.open('POST','/holiday',true);
    http.setRequestHeader('Content-type','application/json;charset=UTF-8');
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            setMessage('Pattern sent');
        } else if (http.readyState == 4) {
            setMessage('Error');
        }
    };
    http.send(JSON.stringify(data));
};

var setMessage = function(msg) {
    var message = document.createElement('div');
    message.className = 'message';
    message.innerHTML = msg;
    document.body.appendChild(message);
}; 

var getValue = function(elemId) {
    return document.getElementById(elemId).value;
};

