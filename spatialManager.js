/*
spatialManager.js

A module which handles spatial lookup, as required for...
e.g. general collision detection.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

var spatialManager = {

// "PRIVATE" DATA
_nextSpatialID : 1, // make all valid IDs non-falsey (i.e. don't start at 0)
_entities : [],
// walls, grass
_nonentities : [],

// "PRIVATE" METHODS

// PUBLIC METHODS
getNewSpatialID : function() {
    return this._nextSpatialID++;
},

register: function(entity) {
    var pos = entity.getPos();
    var spatialID = entity.getSpatialID();
    
    this._entities[spatialID] = {posX : pos.posX, posY : pos.posY, radius : entity.getRadius(), obj : entity};
},

unregister: function(entity) {
    var spatialID = entity.getSpatialID();

    if(spatialID in this._entities) {
        delete this._entities[spatialID];
    }
},

findEntityInRange: function(posX, posY, radius) {
    for(var ID in this._entities) {
        var e = this._entities[ID];

        if(util.distSq(posX, posY, e.posX, e.posY) < util.square(radius + e.radius)) {
            return e.obj;
        }
    }
},

findNonEntityInRange: function(posX,posY) {
	if(this._nonentities[(posX-16)/32] === undefined) return;
	var result = this._nonentities[(posX-16)/32][((-1*posY)+560)/32];
	return result;
},

render: function(ctx) {
    ctx.save();
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.font = "bold 20px 'Arial'";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
        ctx.fillText(ID-1, e.posX-6, e.posY+8);
    }

    for (var i = -10; i < this._nonentities.length; i++) {
        for (var j = 0; j < this._nonentities[i].length; j++) {
            if(this._nonentities[i][j] === 1) {
                util.fillBox(ctx, i*32, -(j*32)+544, 32, 32, "rgba(255, 0, 0, 0.5)");
            } else if (this._nonentities[i][j] === 2) {
                util.fillBox(ctx, i*32, -(j*32)+544, 32, 32, "rgba(0, 255, 0, 0.5)");
            } else if (this._nonentities[i][j] === 3) {
                util.fillBox(ctx, i*32, -(j*32)+544, 32, 32, "rgba(255, 0, 255, 0.5)");
            }
        }
    }
    ctx.restore();
},

manageWallsAndGrass : function() {
	fillCollisionMatrix(this);
}

}
