var sets = require('simplesets');
var _ = require('underscore')._;

var tick = function(world) {
    var sideLength = 7;

    var pointToIndex = function(point) {
        return point.x + (point.y * sideLength); 
    }

    var indexToPoint = function(index) {
        var pointX = index % sideLength;  
        var pointY = Math.floor(index/sideLength); 
        return { x: pointX, y: pointY };
    }

    var neighbours = function(point) {
        return [{x: point.x -1,y: point.y -1},{x: point.x,y: point.y -1},{x: point.x +1,y: point.y -1},   
                {x: point.x -1,y: point.y}, {x: point.x +1,y: point.y},   
                {x: point.x -1,y: point.y +1},{x: point.x,y: point.y +1},{x: point.x +1,y: point.y +1}].map(wrapPoints);
    };

    var wrapPoints = function(point) {
        return {x: inBound(point.x), y: inBound(point.y)};
    }

    var inBound = function(coord) {
        if (coord === -1) { return sideLength - 1; } 
        if (coord === sideLength) { return 0; }
        return coord;
    }
 
    var worldIndicies = world.reduce(function(acc, elem, index) { 
        if(elem) { acc.push(index); }
        return acc;
    }, []); 

    var livePoints = worldIndicies.map(indexToPoint);

    var liveNeighbours = function(point, livePoints) {
        return _.filter(neighbours(point), function(neighbour) {
            result = false;
            _.each(livePoints, function(livePoint) {
                if (livePoint.x == neighbour.x && livePoint.y == neighbour.y) {
                    result = true;
                }
            });
            return result;
        }); 
    }
 
    var stillAlive = _.filter(livePoints, function(point) {
        var live = liveNeighbours(point, livePoints).length;
        return live == 2 || live == 3;
    }); 

    var possibilities = _.foldl(livePoints, function(acc, point) {
        return acc.concat(neighbours(point)); 
    }, []);

    var uniquePossibilities = new sets.Set(possibilities).array();

    var resurrected = _.filter(uniquePossibilities, function(point) {
        return liveNeighbours(point, livePoints).length == 3; 
    });

    var newWorld = new sets.Set(stillAlive.concat(resurrected));

    var newWorldArr = Array.apply(null, new Array(sideLength * sideLength)).map(Boolean.prototype.valueOf, false);
    _.each(newWorld.array(), function(point) {
        newWorldArr[pointToIndex(point)] = true;
    });

    return newWorldArr;
};

module.exports = tick 
