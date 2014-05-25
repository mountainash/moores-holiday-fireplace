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
        if (coord == -1) { return sideLength - 1; } 
        if (coord >= sideLength) { return coord % sideLength; }
        return coord;
    }
 
    var worldIndicies = world.reduce(function(acc, elem, index) { 
        if(elem) { acc.push(index); }
        return acc;
    }, []); 

    var livePoints = worldIndicies.map(indexToPoint);
 
    var pointEquals = function(p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    }
  
    var contains = function(pointList, point) {
        var result = false;
         _.each(pointList, function(p) {
             if (pointEquals(p, point)) {
                 result = true;
                 return false;
             }
        });
        return result;
    }

    var liveNeighbours = function(point, livePoints) {
        return _.filter(neighbours(point), function(neighbour) {
            return contains(livePoints, neighbour);
        }); 
    }
 
    var survivors = _.filter(livePoints, function(point) {
        var live = liveNeighbours(point, livePoints).length;
        return live == 2 || live == 3;
    }); 

    var possibilities = _.reduce(livePoints, function(acc, point) {
        return acc.concat(neighbours(point)); 
    }, []);

    var deadPossibilities = _.filter(possibilities, function(point) {
        return ! contains(livePoints, point); 
    });

    var uniquePossibilities = new sets.Set(deadPossibilities).array();

    var resurrected = _.filter(uniquePossibilities, function(point) {
        return liveNeighbours(point, livePoints).length == 3; 
    });

    var newWorld = survivors.concat(resurrected);

    var newWorldArr = Array.apply(null, new Array(sideLength * sideLength)).map(Boolean.prototype.valueOf, false);
    _.each(newWorld, function(point) {
        newWorldArr[pointToIndex(point)] = true;
    });
    return newWorldArr;
};

module.exports = tick 
