// ==========
// SHIP STUFF
// ==========

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Npc(descr) {

    // Common inherited setup logic from Entity
    this.setup(descr);
    
    // Default sprite, if not otherwise specified
    this.sprite = this.sprite || g_sprites.npcs;
    
    // Set normal drawing scale, and warp state off
    this._scale = 2;

    this._spr = this._spr || [];
    this._dir = 0;

    this._width = this._width || 0;
    this._height = this._height || 0;

    this._animFrame = 0;
    this._isMoving = false;
    this._isJumping = false;
    this._stepsRemain = 0;
    this._oneTileTime = 0.4;
    this._animTimer = this._oneTileTime * SECS_TO_NOMINALS;

    this.oldX = this.cx;
    this.oldY = this.cy;
    this.targetX = this.cx;
    this.targetY = this.cy;
    this.tmpX = this.cx;
    this.tmpY = this.cy;
};

Npc.prototype = new Entity();

Npc.prototype.KEY_UP = 'W'.charCodeAt(0);
Npc.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Npc.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Npc.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Npc.prototype.KEY_ACTION   = ' '.charCodeAt(0);

// Initial, inheritable, default values
Npc.prototype.cx = 208;
Npc.prototype.cy = 208;
//Npc.prototype.numSubSteps = 1;
Npc.prototype.isMainChar = false;
    
Npc.prototype.update = function (du) {
    
    spatialManager.unregister(this);

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

    if(this.targetX !== this.cx ||
       this.targetY !== this.cy) {
        this.moveToTarget(du);
    }

    if(spatialManager.findNonEntityInRange(this.cx, this.cy) === 3) {
        this.move(0);
        this._isJumping = true;
    }

    // Perform movement substeps
    //var steps = this.numSubSteps;
    //var dStep = du / steps;
    if(this.isMainChar) {
        //for (var i = 0; i < steps; ++i) {
            this.computeSubStep(du);
        //}
    }

    if(this._stepsRemain > 0 && 
       this.targetX === this.cx &&
       this.targetY === this.cy) {
        this.move(this._dir);
        this._stepsRemain -= 1;
    }

    // Handle firing
    this.maybeAction();

    spatialManager.register(this);

};

Npc.prototype.setScale = function (scale) {
    this._scale = scale;
};

Npc.prototype.moveToTarget = function (du) {
    var ratio = du / (this._oneTileTime * SECS_TO_NOMINALS);
    if(this._animTimer > 0.55 * this._oneTileTime * SECS_TO_NOMINALS &&
       this._animTimer < 0.95 * this._oneTileTime * SECS_TO_NOMINALS) {
        this._animFrame = 1;
    }
    if(this._animTimer > 0.45 * this._oneTileTime * SECS_TO_NOMINALS &&
       this._animTimer < 0.55 * this._oneTileTime * SECS_TO_NOMINALS) {
        this._animFrame = 0;
    }
    if(this._animTimer < 0.45 * this._oneTileTime * SECS_TO_NOMINALS) {
        if(this._dir === 0 || this._dir === 1) {
            this._scale = -Math.abs(this._scale);
        }
        this._animFrame = 1;
    }

    this.tmpX += (this.targetX-this.oldX)*ratio;
    this.tmpY += (this.targetY-this.oldY)*ratio;

    if(!this._isJumping) {
        this.cx = this.tmpX;
        this.cy = this.tmpY;
    } else {
        this.cx = this.tmpX;
        this.cy = this.targetY - (-0.095*util.square(((this.targetY-this.tmpY)-20.5)) + 40);
    }

    this._animTimer -= du;
    if(this._animTimer < 0) {
        this.cx = this.targetX;
        this.cy = this.targetY;
        this.oldX = this.cx;
        this.oldY = this.cy;
        this.tmpX = this.cx;
        this.tmpY = this.cy;
        this._isMoving = false;
        this._isJumping = false;
        this._animTimer = this._oneTileTime * SECS_TO_NOMINALS;
        this._animFrame = 0;
    }
};

Npc.prototype.computeSubStep = function (du) {
    if(this._isMoving) return;
	
    if(eatKey(this.KEY_DOWN)) {
        this.move(0);
        return;
    }

    if(eatKey(this.KEY_UP)) {
        this.move(1);
        return;
    }

    if(eatKey(this.KEY_RIGHT)) {
        this.move(3);
        return;
    }

    if(eatKey(this.KEY_LEFT)) {
        this.move(2);
        return;
    }
};

Npc.prototype.move = function (udlr) {
	
    //console.log((this.cx-16)/32,(-this.cy+560)/32);
    this._scale = Math.abs(this._scale);
	
    switch(udlr) {
        case 0:
			if(this._dir !== udlr) { break;} 
            if(spatialManager.findEntityInRange(this.cx, this.cy+(16 * this._scale), (8 * this._scale))) { return;}
			var inWay = spatialManager.findNonEntityInRange(this.cx, this.cy+(16 * this._scale));
            if(inWay === 1) { return;}
            this.targetY += (16 * this._scale);
			this._isMoving = true;
            break;
        case 1:
			if(this._dir !== udlr) break;
            if(spatialManager.findEntityInRange(this.cx, this.cy-(16 * this._scale), (8 * this._scale))) return;
            var inWay = spatialManager.findNonEntityInRange(this.cx, this.cy-(16 * this._scale));
			if(inWay === 1 || inWay === 3) { return;}
            this.targetY -= (16 * this._scale);
			this._isMoving = true;
            break;
        case 2:
			if(this._dir !== udlr) break;
            if(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, (8 * this._scale))) return;
            var inWay = spatialManager.findNonEntityInRange(this.cx-(16 * this._scale), this.cy);
			if(inWay === 1 || inWay === 3) { return;}
            this.targetX -= (16 * this._scale);
			this._isMoving = true;
            break;
        case 3:
			
            this._scale = -Math.abs(this._scale);
			if(this._dir !== udlr) break;
            if(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, -(8 * this._scale))) return;
            var inWay = spatialManager.findNonEntityInRange(this.cx-(16 * this._scale), this.cy);
			if(inWay === 1 || inWay === 3) { return;}
            else if(inWay === 3) { return;}
            this.targetX -= (16 * this._scale);
			this._isMoving = true;
            break;
    }
	this._dir = udlr;
    
};

Npc.prototype.moveMult = function (udlr, nr) {
    this._dir = udlr;
    this._stepsRemain = nr;
};

Npc.prototype.maybeAction = function () {

    if (keys[this.KEY_ACTION]) {
           
    }
    
};

Npc.prototype.render = function (ctx) {
	if(this.isVisible) {
		var origScale = this.sprite.scale;
		var direction;
		if(this._dir === 3) direction = 2;
		else direction = this._dir;
		// pass my scale into the sprite, for drawing
		this.sprite.scale = this._scale;
		
		this.sprite.drawAnimFrame(ctx, this.cx, this.cy, this._spr[direction][this._animFrame].ax, this._spr[direction][this._animFrame].ay, this._width, this._height);
		this.sprite.scale = origScale;
	}
};
