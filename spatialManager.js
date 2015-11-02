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

// "PRIVATE" METHODS

// PUBLIC METHODS

getNewSpatialID : function() {

    // TODO: YOUR STUFF HERE!
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

render: function(ctx) {
    var oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = "red";
    
    for (var ID in this._entities) {
        var e = this._entities[ID];
        util.strokeCircle(ctx, e.posX, e.posY, e.radius);
    }
    ctx.strokeStyle = oldStyle;
}

}