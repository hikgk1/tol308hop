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
    this._isTalking = false;
    this._inMenu = false;
    this._inPokeMenu = false;
    this._stepsRemain = 0;
    this._stepsTillFight = Math.floor(util.randRange(4, 15));
    this._battleTransition = false;
    this._oneTileTime = 0.4;
    this._animTimer = this._oneTileTime * SECS_TO_NOMINALS;

    this.oldX = this.cx;
    this.oldY = this.cy;
    this.targetX = this.cx;
    this.targetY = this.cy;
    this.tmpX = this.cx;
    this.tmpY = this.cy;
	
	this.prevGrass = false;

    this._menu = {
        opt : [
               {txt : "Pokemon", update : function () {entityManager._npcs[0]._inPokeMenu = !entityManager._npcs[0]._inPokeMenu}},
               {txt : "Cancel", update : function () {entityManager._npcs[0]._inMenu = false; entityManager._npcs[0]._menu.pointer = 0}}
              ],
        pointer : 0
    }
};

Npc.prototype = new Entity();

Npc.prototype.KEY_UP = 'W'.charCodeAt(0);
Npc.prototype.KEY_DOWN  = 'S'.charCodeAt(0);
Npc.prototype.KEY_LEFT   = 'A'.charCodeAt(0);
Npc.prototype.KEY_RIGHT  = 'D'.charCodeAt(0);

Npc.prototype.KEY_ACTION   = ' '.charCodeAt(0);
Npc.prototype.KEY_MENU = '\r'.charCodeAt(0);

// Initial, inheritable, default values
Npc.prototype.cx = 208;
Npc.prototype.cy = 208;
//Npc.prototype.numSubSteps = 1;
Npc.prototype.isMainChar = false;
    
Npc.prototype.update = function (du) {
    spatialManager.unregister(this);

    if(this._isDeadNow) return entityManager.KILL_ME_NOW;

    if(this._inMenu) {
        if(eatKey(this.KEY_MENU) || eatKey(this.KEY_ACTION)) {
            this._menu.opt[this._menu.pointer].update();
        }

        if(this._inPokeMenu) return;

        if(eatKey(this.KEY_DOWN)) {
            if(this._menu.pointer < this._menu.opt.length-1) this._menu.pointer += 1;
            return;
        }

        if(eatKey(this.KEY_UP)) {
            if(this._menu.pointer > 0) this._menu.pointer -= 1;
            return;
        }
        return;
    }

    if(this._battleTransition) {
        if(this._animTimer < 0) {
            g_inBattle = true;
            this._battleTransition = false;
            this._animTimer = this._oneTileTime * SECS_TO_NOMINALS;
        } else {
            this._animTimer -= du;
        }
        return;
    }

    if(this.cy === -112 || this.cy === -1104) {
        g_sounds.palletTown.pause();
        g_sounds.viridian.pause();
        g_sounds.route1.play();
        g_sounds.palletTown.currentTime = 1;
        g_sounds.viridian.currentTime = 0;
    }

    if(this.cy === 16) {
        g_sounds.route1.pause();
        g_sounds.palletTown.play();
        g_sounds.route1.currentTime = 0;
    }

    if(this.cy === -1264) {
        g_sounds.route1.pause();
        g_sounds.viridian.play();
        g_sounds.route1.currentTime = 0;
    }

    if(this.targetX !== this.cx ||
       this.targetY !== this.cy) {
        this.moveToTarget(du);
    }

    if(this._stepsTillFight <= 0 &&
       this._isMoving === false) {
        this._battleTransition = true;
        this._animTimer = 2.5 * SECS_TO_NOMINALS;
        this._stepsTillFight = Math.floor(util.randRange(4, 15));
        g_sounds.palletTown.pause();
        g_sounds.palletTown.currentTime = 1;
        g_sounds.route1.pause();
        g_sounds.route1.currentTime = 0;
        g_sounds.battle.currentTime = 0.8;
        g_sounds.battle.play();
        return;
    }

    if(spatialManager.findNonEntityInRange(this.cx, this.cy) === 3) {
        this.move(0);
        this._isJumping = true;
    }

    if(this.isMainChar && !this._isTalking) {
        this.computeSubStep(du);
    }

    if(this._stepsRemain > 0 && 
       this.targetX === this.cx &&
       this.targetY === this.cy) {
        this.move(this._dir);
        this._stepsRemain -= 1;
    }

    // Handle actions
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
        //f(x) = -0.095(x - 20.5)^2 + 40
        //describes a "jumping" parabola from x=30 to x=0
        //f(30) = ~32       y moves by about 1-2 in the first update, so function "starts" at 30
        //f(20.5) = 40      peek
        //f(0) = ~0
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
		//Transfer from inside and outside of Pokelab
		if(this._dir == 1) {
			if((this.cx-16)/32 === 12 && (-this.cy+560)/32 === 7 ){
				this._isMoving = false;
				this.oldX=1360;
				this.tmpX=1360;
				this.cx = 1360;
				this.targetX = 1360;
			}
		}
		if(this._dir == 0) {
			if(((this.cx-16)/32 === 42 || (this.cx-16)/32 === 43) && (-this.cy+560)/32 === 6  ){
				this._isMoving = false;
				this.oldX=400;
				this.tmpX=400;
				this.cx = 400;
				this.targetX = 400;
			}
		}
    }
};

Npc.prototype.computeSubStep = function (du) {
    if(this._isMoving) return;

    if(eatKey(this.KEY_MENU)) {
        this._inMenu = true;
        return;
    }
	
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
	this.prevGrass = this.inGrass;
	this.inGrass = false;
    switch(udlr) {
        case 0:
			if(this._dir != udlr) { 
			//for grass animation
			if(spatialManager._nonentities[(this.cx-16)/32][(-this.cy+560)/32] == 2) {
				this.inGrass = true;
			}
			break;
			} 
            if(spatialManager.findEntityInRange(this.cx, this.cy+(16 * this._scale), (8 * this._scale))) {
                return;
            }
			var inWay = spatialManager.findNonEntityInRange(this.cx, this.cy+(16 * this._scale));
            if(inWay === 1) { return;}
            //for grass animation
            if(inWay === 2) { 
                this._stepsTillFight--;
                this.inGrass = true;
            }
            this.targetY += (16 * this._scale);
			this._isMoving = true;
            break;
        case 1:
			if(this._dir != udlr) { 
				//for grass animation
				if(spatialManager._nonentities[(this.cx-16)/32][(-this.cy+560)/32] == 2) {
					this.inGrass = true;
				}
				break;
			} 
            if(spatialManager.findEntityInRange(this.cx, this.cy-(16 * this._scale), (8 * this._scale))) {
                return;
            }
            var inWay = spatialManager.findNonEntityInRange(this.cx, this.cy-(16 * this._scale));
			if(inWay === 1 || inWay === 3) { return;}
            //for grass animation
			if(inWay === 2) { 
                this._stepsTillFight--;
                this.inGrass = true;
            }
            this.targetY -= (16 * this._scale);
			this._isMoving = true;
            break;
        case 2:
			if(this._dir != udlr) { 
				//for grass animation
				if(spatialManager._nonentities[(this.cx-16)/32][(-this.cy+560)/32] == 2) {
					this.inGrass = true;
				}
				break;
			} 
            if(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, (8 * this._scale))) return;
            var inWay = spatialManager.findNonEntityInRange(this.cx-(16 * this._scale), this.cy);
			if(inWay === 1 || inWay === 3) { return;}
            //for grass animation
			if(inWay === 2) { 
                this._stepsTillFight--;
                this.inGrass = true;
            }
            this.targetX -= (16 * this._scale);
			this._isMoving = true;
            break;
        case 3:
            this._scale = -Math.abs(this._scale);
			
			if(this._dir != udlr) { 
				//for grass animation
				if(spatialManager._nonentities[(this.cx-16)/32][(-this.cy+560)/32] == 2) {
					this.inGrass = true;
				}
				break;
			} 
            if(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, -(8 * this._scale))) return;
            var inWay = spatialManager.findNonEntityInRange(this.cx-(16 * this._scale), this.cy);
			if(inWay === 1 || inWay === 3) { return;}
            else if(inWay === 3) { return;}
			//for grass animation
			if(inWay === 2) { 
                this._stepsTillFight--;
                this.inGrass = true;
            }
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
    if (eatKey(this.KEY_ACTION)) {
        if(this._isTalking === false) {
            if(this._dir === 0) {
                this.talkTo(spatialManager.findEntityInRange(this.cx, this.cy+(16 * this._scale), (8 * this._scale)));
            } else if (this._dir === 1) {
                this.talkTo(spatialManager.findEntityInRange(this.cx, this.cy-(16 * this._scale), (8 * this._scale)));
            } else if (this._dir === 2) {
                this.talkTo(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, (8 * this._scale)));
            } else {
                this.talkTo(spatialManager.findEntityInRange(this.cx-(16 * this._scale), this.cy, -(8 * this._scale)));
            }
        } else {
            this._isTalking = false;
        }
    }
};

Npc.prototype.talkTo = function (npc) {
    if(npc === undefined) return;
    this._chatText = npc.chatText;
    this._isTalking = true;
};

Npc.prototype.drawMenu = function (ctx) {
    ctx.save();
    ctx.translate(entityManager._npcs[0].cx-304,entityManager._npcs[0].cy-272);
    util.drawBoarderBox(ctx, g_canvas.width-(8*32), 64, 8, 12);
    ctx.translate(g_canvas.width-(8*32), 112);
    for(var i = 0; i < this._menu.opt.length; i++) {
        util.writeText(ctx, this._menu.opt[i].txt, 64, i*48, 3);
    }
    g_sprites.pointer.drawAtSize(ctx, 32, this._menu.pointer*48-5, 20, 30);
    ctx.restore();
}

Npc.prototype.drawPokeMenu = function (ctx) {
    ctx.save();
    ctx.translate(entityManager._npcs[0].cx-304,entityManager._npcs[0].cy-272);
    util.drawBoarderBox(ctx, 0, 0, 20, 18);
    ctx.translate(64, 64);
    util.writeText(ctx, g_PokemonList[entityManager.Playerid[0]][0], 0, 0, 3);
    util.writeText(ctx, ""+entityManager.picachu[0].health + " - " + (100+entityManager.picachu[0].level*30), 256, 0, 3);
    for(var i = 1; i < entityManager.Playerid.length; i++) {
        util.writeText(ctx, g_PokemonList[entityManager.Playerid[i]][0], 0, i*64, 3);
        util.writeText(ctx, ""+entityManager.picachu[i].health + " - " + (40+entityManager.picachu[i].level*20), 256, i*64, 3);
    }

    ctx.restore();
}

Npc.prototype.render = function (ctx) {
        if(this._battleTransition && this.isMainChar) {
            ctx.save();
            ctx.translate(entityManager._npcs[0].cx-304,entityManager._npcs[0].cy-272);
            for(var i = 0; i < g_canvas.height+64; i+=128) {
                for(var j = 0; j < g_canvas.height; j+=64) {
                    if((150-this._animTimer)*4 >= j) util.fillBox(ctx, i, j, 64, 64, "black");
                }
            }
            for(var i = 64; i < g_canvas.height+64; i+=128) {
                for(var j = g_canvas.height; j >= 0; j-=64) {
                    if((150-this._animTimer)*4 >= g_canvas.height-j) util.fillBox(ctx, i, j, 64, -64, "black");
                }
            }
            ctx.restore();
        }

		var origScale = this.sprite.scale;
		var direction;
		if(this._dir === 3) direction = 2;
		else direction = this._dir;
		// pass my scale into the sprite, for drawing
		this.sprite.scale = this._scale;
		this.sprite.drawAnimFrame(ctx, this.cx, this.cy, this._spr[direction][this._animFrame].ax, this._spr[direction][this._animFrame].ay, this._width, this._height);
		this.sprite.scale = origScale;

		if ((this.inGrass && this.prevGrass) || (this.inGrass && !this._isMoving)) {
			/*ctx.drawImage(g_images.grasspatch,this.targetX-16,this.targetY-16);
			if(this.prevGrass) {  ctx.drawImage(g_images.grasspatch,this.oldX-16,this.oldY-16);}*/
            ctx.drawImage(g_images.grasspatch, this.cx-16, this.cy);
		}
};
