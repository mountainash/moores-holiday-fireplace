var holiday = require('./holiday');
var tick = require('./game');

var delay = 100;
var start = [ false, false, true, true, true, true, false, 
              false, true, false, false, false, true, false, 
              false, false, false, false, false, true, false, 
              false, true, false, false, true, false, false, 
              false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false, 
              false, false, false, false, false, false, false ]; 

var doTick = function(world) {
    world.unshift(true);
    holiday(world);
                
    setTimeout(function() { 
        doTick(tick(world)); 
    }, delay);
}

doTick(start);
