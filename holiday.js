var http = require("http");

var holidayHost = "192.168.23.254";
var setLightsPath = "/iotas/0.1/device/moorescloud.holiday/localhost/setlights";
var setLightsUrl = "http://" + holidayHost + setLightsPath;
var alive = "#360A5E";
var dead = "#2A40C7";

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
        colours[0] = "#000000"; 
        return colours;
    };

    var lightJson = JSON.stringify({ "lights": boolsToLights(bools) });

    var setLightsOpts = {
        host: holidayHost, 
        port: 80,
        path: setLightsPath, 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(lightJson, 'utf8')
        }
    };
    
    var setLightsReq = http.request(setLightsOpts); 
    console.log("Sending request");
    setLightsReq.write(lightJson);
    setLightsReq.end();
    setLightsReq.on('error', function(e) {
        console.error(e);
    });
};

module.exports = sendLights
