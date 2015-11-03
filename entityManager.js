/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_npcs    : [],

// "PRIVATE" METHODS

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

npcList : {
    mainChar : [
                [{ax : 324, ay : 36}, {ax : 306, ay : 162}],
                [{ax : 324, ay : 54}, {ax : 306, ay : 180}],
                [{ax : 306, ay : 144}, {ax : 306, ay : 198}]
               ],
    npc1 : [
            [{ax : 288, ay : 72}, {ax : 288, ay : 126}],
            [{ax : 288, ay : 90}, {ax : 288, ay : 0}],
            [{ax : 288, ay : 108}, {ax : 288, ay : 18}]
           ]
	  
		   
},
obsticleList: {
	
	obsticle1 : [
            [{ax : 288, ay : 72}, {ax : 288, ay : 126}],
            [{ax : 288, ay : 90}, {ax : 288, ay : 0}],
            [{ax : 288, ay : 108}, {ax : 288, ay : 18}]
           ]
	
},

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._npcs];
},

init: function() {
    entityManager.displayNpc(this.npcList.mainChar, 208, 208, true,true);
    entityManager.displayNpc(this.npcList.npc1, 208, 240, false,true);
	entityManager.fillObsticles();
    //this.moveNpc(1, 0);
},

displayNpc : function (spArr, cx, cy, mainChar,visible) {
    this._npcs.push(new Npc({
        _spr : spArr,
        _width : 16,
        _height : 16,
        isMainChar : mainChar,
		isVisible : visible,
        cx : cx,
        cy : cy
    }));
},

moveNpc : function (npcNo, udlr) {
    this._npcs[npcNo].move(udlr);
},

moveMultNpc : function (npcNo, udlr, nr) {
    this._npcs[npcNo].moveMult(udlr, nr);
},

setScale : function (scale) {
    for(var i = 0; i < this._npcs.length; i++) {
        this._npcs[i].setScale(scale);
    }
},

update: function(du) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];
        var i = 0;

        while (i < aCategory.length) {

            var status = aCategory[i].update(du);

            if (status === this.KILL_ME_NOW) {
                // remove the dead guy, and shuffle the others down to
                // prevent a confusing gap from appearing in the array
                aCategory.splice(i,1);
            }
            else {
                ++i;
            }
        }
    }

},

render: function(ctx) {

    var debugX = 10, debugY = 100;

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {

            aCategory[i].render(ctx);
            //debug.text(".", debugX + i * 10, debugY);

        }
        debugY += 10;
    }
},

fillObsticles: function() {
	//right wall
	for(var i = 0; i < 19; i++ ) {
		this.displayNpc(this.npcList.object1, 16, 16+i*32, false,false);
	}
	//water
	for(var i = 0; i < 4; i++ ) {
		for(var j = 0; j < 5; j++ ) {
			this.displayNpc(this.npcList.object1, 144+i*32, 432+j*32, false,false);
		}
	}
	//house 1
	this.displayNpc(this.npcList.object1, 16+3*32, 16+4*32, false,false);
	for(var i = 0; i < 4; i++ ) {
		for(var j = 0; j < 3; j++ ) {
			this.displayNpc(this.npcList.object1, 16+4*32+i*32, 16+2*32+j*32, false,false);
		}
	}
	//house 2
	this.displayNpc(this.npcList.object1, 16+11*32, 16+4*32, false,false);
	for(var i = 0; i < 4; i++ ) {
		for(var j = 0; j < 3; j++ ) {
			this.displayNpc(this.npcList.object1, 16+12*32+i*32, 16+2*32+j*32, false,false);
		}
	}
	//top wall
	for(var i = 0; i < 9; i++ ) {
		this.displayNpc(this.npcList.object1, 16+32+i*32, 16, false,false);
	}
	for(var i = 11; i < 19; i++ ) {
		this.displayNpc(this.npcList.object1, 16+32+i*32, 16, false,false);
	}
	//left wall
	for(var i = 0; i < 19; i++ ) {
		this.displayNpc(this.npcList.object1, 16+19*32, 16+i*32, false,false);
	}
	// bottom wall
	this.displayNpc(this.npcList.object1, 16+1*32, 16+16*32, false,false);
	for(var i = 0; i < 3; i++ ) {
		this.displayNpc(this.npcList.object1, 16+32+i*32, 16+17*32, false,false);
	}
	for(var i = 0; i < 11; i++ ) {
		for(var j = 0; j < 2; j++ ) {
			this.displayNpc(this.npcList.object1, 16+8*32+i*32, 16+16*32+j*32, false,false);
		}
	}
	//fence 1
	for(var i = 0; i < 4; i++ ) {
		this.displayNpc(this.npcList.object1, 16+4*32+i*32, 16+8*32, false,false);
	}
	//fence 2
	for(var i = 0; i < 6; i++ ) {
		this.displayNpc(this.npcList.object1, 16+10*32+i*32, 16+12*32, false,false);
	}
	//PokeLab
	for(var i = 0; i < 6; i++ ) {
		for(var j = 0; j < 4; j++ ) {
			this.displayNpc(this.npcList.object1, 16+10*32+i*32, 16+7*32+j*32, false,false);
		}
	}
	
	
	
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

