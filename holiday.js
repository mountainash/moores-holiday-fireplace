var http = require('http');
var HoliUdp = require('holiday-udp');
var holiudp;
var alive;
var dead;
var black = [0,0,0];

var hexToRgb = function(hex) {
    var re = /#(\w{2})(\w{2})(\w{2})/;
    var result = re.exec(hex);
    if (result) {
        var res = [ parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16) ];
        return res;
    }
    return black;
};

var sendLights = function(bools) {
    var boolsToLights = function(boolArray) {
        // Reverse lights in rows 2, 4, and 6
        var gridFormatted = boolArray.slice(0,8)
                                     .concat(boolArray.slice(8,15).reverse()
                                           , boolArray.slice(15,22)
                                           , boolArray.slice(22,29).reverse()
                                           , boolArray.slice(29,36)
                                           , boolArray.slice(36,43).reverse()
                                           , boolArray.slice(43,50)
                                 );
        var colours = gridFormatted.map(function(bool) {
            if (bool) { return alive; }
            return dead; 
        });
        // First light not part of grid 
        colours[0] = black; 
        return colours;
    };
    sendRequest(boolsToLights(bools));
};

var sendRequest = function(lightsArray, responseFunc) {
    holiudp.send(lightsArray, function(err) {
        if (err) {
            console.log(err);
            if (responseFunc) { responseFunc(err); }
        }
    });
};

module.exports = sendLights
sendLights.init = function(holidayHost, aliveCol, deadCol) {
    alive = hexToRgb(aliveCol);
    dead = hexToRgb(deadCol);
    holiudp = new HoliUdp(holidayHost);
};
