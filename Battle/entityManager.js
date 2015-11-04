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
rattata: 0,
picachu: 0,

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

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//


nextStep: function(){
        this.step++;  //Notum þetta til að rúlla í gegnum hvað á að rendera þar til step=3, þá erum við komin í bardagann sjálfann og notum act function
        if(this.step==3) this.battl=1;

},
act: function(){
        if(this.battl==3) { //picachu attacks, bara til að birta myndina
           
            this.battl=4;
            return;
        }
        if(this.battl==4){ //rattata attacks
             this.picachu.health -=10*this.rattata.level;
            this.battl=1
            return;
        }
        if(this.battl==-1){ // bardaga move
            var pos = this.rattata.getPos()  //Sæki pos á pointer til að vita hvaða move er valið
            if(pos==290){
                this.rattata.health -=10*this.picachu.level;
                this.move="Thunder bolt"
            } 
            if(pos==312){
                this.rattata.health -=15*this.picachu.level;
                this.move="Tackle"

            }
            if(pos==332){
                this.rattata.health -=10*this.picachu.level;
                this.move="Tail whip"
            }
            if(pos==354){
                this.move="nothing"
            }
            this.battl=3;  //Hoppum í picachu attacks
        } 
        if(this.battl==1){ // menu
            var pos = this.picachu.getPos()  //Sæki pos á pointer til að vita hvað við ætlum að gera

            if(pos[0]==297 && pos[1]==348) this.battl=2 //run valið
            if(pos[0]==179 && pos[1]==305) this.battl=-1;  //Fight valið, hoppum í bardaga moves gluggann
            if(pos[0]==297 && pos[1]==305) {  //PKMN valið
                console.log("Ekki með í demo");
                this.battl=1;  //Höldum áfram í menu
            }
            if(pos[0]==179 && pos[1]==348) {  // ITEM valið
                console.log("Ekki með í demo");
                this.battl=1;  //Höldum áfram í menu
            }
        }
},

generatePokemon : function() {
        this.rattata = new Rattata();
        this.picachu = new Picachu();
    },


update: function(du) {

        this.picachu.update(du);  //Update picachu
        this.rattata.update(du);  //Update rattata

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.
},

render: function(ctx) {
    if(this.step==0){//Teikna upphafsmyndina
        g_sprites.battle1.drawAt(ctx,0,0,400,400)
    g_sprites.battle1.write(ctx,"A wild challanger appears",40,320,20);
    }
    if(this.step>=1){//Rendera rattata
        g_sprites.battle1.drawAt(ctx,0,0,400,400)
        this.rattata.render(ctx);
    }
    if(this.step>=2){//Næsta umhverfi
        g_sprites.battle2.drawAt(ctx,0,0,400,400)
        g_sprites.rattata.write(ctx,"Rattata",28,44,16);
        this.rattata.render(ctx);
    }
    if(this.battl==1){ //Grunnurinn í bardaganum, erum í menu með battle2 í bakrun, pointerinn er renderaður í gegnum picachu
        this.picachu.render(ctx); 
        this.rattata.render(ctx);  
    }
    if(this.battl==-1){  //Battle moves, pointerinn er renderaður í gegnum rattata, battle3 er bakrunnurinn í þessu statei
        g_sprites.battle3.drawAt(ctx,0,0,400,400)
        g_sprites.battle3.write(ctx,"Rattata",28,44,16);
        g_sprites.battle3.write(ctx,"Ligthning Bolt",150,310,16);
        g_sprites.battle3.write(ctx,"Tackle",150,332,16);
        g_sprites.battle3.write(ctx,"Tail Whip",150,354,16);
        g_sprites.battle3.write(ctx,"-----------",150,376,16);
        this.rattata.render(ctx);    
    }
    if(this.battl==2){ //Ef valið er run í menu, ekki klárað
        g_sprites.battle4.drawAt(ctx,0,0,400,400)
        this.rattata.render(ctx); 
    }
    if(this.battl==3){//Picachu gerir árás
        g_sprites.rattattack.drawAt(ctx,0,0,400,400)
        g_sprites.rattattack.write(ctx,"Picachu uses "+this.move,40,320,16);
        this.picachu.render(ctx); 
        this.rattata.render(ctx); 
    }    
    if(this.battl==4){//Rattata gerir árás
        g_sprites.rattattack.drawAt(ctx,0,0,400,400)
        g_sprites.rattattack.write(ctx,"Rattata uses tackle",40,320,16);
        this.picachu.render(ctx); 
        this.rattata.render(ctx); 
    }

}

}

// Some deferred setup which needs the object to have been created first

