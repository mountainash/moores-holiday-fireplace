var _ = require('underscore')._;

var tick = function(worldBools) {
    var sideLength = 7;

    var pointToIndex = function(point) {
        return point.x + (point.y * sideLength); 
    }

    var indexToPoint = function(index) {
        var pointX = index % sideLength;  
        var pointY = Math.floor(index/sideLength); 
        return { x: pointX, y: pointY };
    }

    var pointEquals = function(p1, p2) {
        return p1.x == p2.x && p1.y == p2.y;
    }
 
    var neighbours = function(p) {
        return [{x: p.x-1, y: p.y-1},{x: p.x,   y: p.y-1},{x: p.x+1, y: p.y-1},   
                {x: p.x-1, y: p.y},  {x: p.x+1, y: p.y},   
                {x: p.x-1, y: p.y+1},{x: p.x,   y: p.y+1},{x: p.x+1, y: p.y+1}]
               .map(wrapPoints);
    };

    var wrapPoints = function(point) {
        return {x: inBound(point.x), y: inBound(point.y)};
    }

    var inBound = function(coord) {
        if (coord == -1) { return sideLength - 1; } 
        if (coord >= sideLength) { return coord % sideLength; }
        return coord;
    }
 
    var livePoints = worldBools.reduce(function(acc, elem, index) { 
        if(elem) { acc.push(index); }
        return acc;
    }, []).map(indexToPoint); 

    var containsPoint = function(pointList, point) {
        return _.find(pointList, _.partial(pointEquals, point)); 
    };

    var liveNeighbours = function(point, livePoints) {
        return _.filter(neighbours(point), function(neighbour) {
            return containsPoint(livePoints, neighbour);
        }); 
    };
 
    var survivors = _.filter(livePoints, function(point) {
        var live = liveNeighbours(point, livePoints).length;
        return live == 2 || live == 3;
    }); 

    var spawnCandidates = _.filter(_.reduce(livePoints, function(acc, point) {
        return acc.concat(neighbours(point)); 
    }, []), function(point) {
        return ! containsPoint(livePoints, point); 
    });

    var spawned = _.filter(_.uniq(spawnCandidates, false, pointEquals), function(point) {
        return liveNeighbours(point, livePoints).length == 3; 
    });

    var newWorld = survivors.concat(spawned);

    var newWorldBools = Array.apply(null, new Array(sideLength * sideLength)).map(Boolean.prototype.valueOf, false);
    _.each(newWorld, function(point) {
        newWorldBools[pointToIndex(point)] = true;
    });
    return newWorldBools;
};

module.exports = tick 
