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
step: 0,
battl: 0,
move: "",
_rocks   : [],
_bullets : [],
_ships   : [],
_picachu : [],
_bShowRocks : false,

// "PRIVATE" METHODS

_generateRocks : function() {

        
        
    


    // TODO: Make `NUM_ROCKS` Rocks!
},


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

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._bullets, this._picachu];
},

nextStep: function(){
        this.step++;
        if(this.step==3) this.battl=1;

},
act: function(){
        if(this.battl==3) { //rattata attacks
            this._categories[1][0].health -=10*this._categories[1][0].level;
            this.battl=4;
            return;
        }
        if(this.battl==4){
            this.battl=1
            return;
        }
        if(this.battl==-1){ // bardaga move
            var pos = this._categories[0][0].getPos()
            if(pos==290){
                this._categories[0][0].health -=10*this._categories[0][0].level;
                this.move="Thunder bolt"
            } 
            if(pos==312){
                this._categories[0][0].health -=15*this._categories[0][0].level;
                this.move="Tackle"

            }
            if(pos==332){
                this._categories[1][0].health -=10*this._categories[1][0].level;
                this.move="Tail whip"
            }
            if(pos==354){
                this.move="nothing"
            }
            this.battl=3;
        } 
        if(this.battl==1){ // menu
            var pos = this._categories[1][0].getPos()
            console.log(pos);
            if(pos[0]==297 && pos[1]==348) this.battl=2 //run
            if(pos[0]==179 && pos[1]==305) this.battl=-1;
            if(pos[0]==297 && pos[1]==305) {
                console.log("Ekki með í demo");
                this.battl=1;
            }
            if(pos[0]==179 && pos[1]==348) {
                console.log("Ekki með í demo");
                this.battl=1;
            }
        }
        console.log(this.battl);
},
fireBullet: function(cx, cy, velX, velY, rotation) {

    
},
generateShip : function() {
        this._categories[0].push(new Bullet());
        this._categories[1].push(new Picachu());
    },


update: function(du) {

        this._categories[1][0].update(du);  
        this._categories[0][0].update(du); 

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
},

render: function(ctx) {
    if(this.step==0){
        g_sprites.battle1.drawAt(ctx,0,0,400,400)
    g_sprites.battle1.write(ctx,"A wild challanger appears",40,320,20);
    }
    if(this.step>=1){
        g_sprites.battle1.drawAt(ctx,0,0,400,400)
        this._categories[0][0].render(ctx);
    }
    if(this.step>=2){
        g_sprites.battle2.drawAt(ctx,0,0,400,400)
        g_sprites.rattata.write(ctx,"Rattata",28,44,16);
        this._categories[0][0].render(ctx);
    }
    if(this.battl==1){
        this._categories[1][0].render(ctx); 
        this._categories[0][0].render(ctx);  
    }
    if(this.battl==-1){
        g_sprites.battle3.drawAt(ctx,0,0,400,400)
        g_sprites.battle3.write(ctx,"Rattata",28,44,16);
        g_sprites.battle3.write(ctx,"Ligthning Bolt",150,310,16);
        g_sprites.battle3.write(ctx,"Tackle",150,332,16);
        g_sprites.battle3.write(ctx,"Tail Whip",150,354,16);
        g_sprites.battle3.write(ctx,"-----------",150,376,16);
        this._categories[0][0].render(ctx);    
    }
    if(this.battl==2){
        g_sprites.battle4.drawAt(ctx,0,0,400,400)
        this._categories[0][0].render(ctx); 
    }
    if(this.battl==3){
        g_sprites.rattattack.drawAt(ctx,0,0,400,400)
        g_sprites.rattattack.write(ctx,"Picachu uses "+this.move,40,320,16);
        this._categories[1][0].render(ctx); 
        this._categories[0][0].render(ctx); 
    }    
    if(this.battl==4){
        g_sprites.rattattack.drawAt(ctx,0,0,400,400)
        g_sprites.rattattack.write(ctx,"Rattata uses tackle",40,320,16);
        this._categories[1][0].render(ctx); 
        this._categories[0][0].render(ctx); 
    }
    /*for(var i=0;i<this._categories[2].length;i++){
        this._categories[2][i].render(ctx);  
    } 
    for(var k = 0; k < 4; k++){
        if(this._bShowRocks==true){ this._categories[0][k].render(ctx); 
        }
    }   
    for(var j = 0; j<this._categories[1].length; j++) {
    if(this._categories[1][j]) this._categories[1][j].render(ctx);
    }
    // TODO: Implement this
    // NB: Remember to implement the ._bShowRocks toggle!
    // (Either here, or if you prefer, in the Rock objects)
*/
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
