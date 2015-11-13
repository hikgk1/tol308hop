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
id: 0,
Playerid: 0,
poke_img: [],
_npcs    : [],
enemyMove: 0,

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
    entityManager.displayNpc(this.npcList.mainChar, 304, 272, true,false);
    entityManager.displayNpc(this.npcList.npc1, 208, 240, false,false);
    entityManager.displayNpc(this.npcList.npc1, 176, -336, false,false);
    entityManager.displayNpc(this.npcList.npc1, 496, -720, false,true);
    entityManager.moveMultNpc(3, 2, 0);
    spatialManager.manageWallsAndGrass();
    this.generatePokemon();
    entityManager._npcs[1].chatText = "This is a test";
    entityManager._npcs[2].chatText = "This one can talk  as well";
    entityManager._npcs[3].chatText = "Some more text";
},

displayNpc : function (spArr, cx, cy, mainChar,inGrass) {
    this._npcs.push(new Npc({
        _spr : spArr,
        _width : 16,
        _height : 16,
        isMainChar : mainChar,
        inGrass : inGrass,
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

nextStep: function(){
        this.step++;  //Notum þetta til að rúlla í gegnum hvað á að rendera þar til step=3, þá erum við komin í bardagann sjálfann og notum act function
        if(this.step===3) this.battl=1;
},

act: function(){
        if(this.battl===2) {
            g_inBattle = false;
            g_sounds.battle.pause();
            g_sounds.battle.currentTime = 0;
            g_sounds.route1.play();
            this.step = 0;
            this.battl = 0;
            this.move = "";
            this.rattata.health = 60;
            return;
        }

        if(this.battl===3) { //picachu attacks, bara til að birta myndina
            this.battl=4;
            this.enemyMove=util.randomNum(1,4); //ákveður attack move hjá enemy
            this.rattata.isDead();
            return;
        }

        if(this.battl===4){ //rattata attacks
            this.picachu.health -= g_PokemonList[this.Playerid][this.enemyMove+4]*this.rattata.level;
            this.battl=1
            this.picachu.isDead();
            return;
        }

        if(this.battl===-1){ // bardaga move
            var pos = this.rattata.getPos()  //Sæki pos á pointer til að vita hvaða move er valið
            if(pos===g_canvas.height*0.725){
                this.rattata.health -= g_PokemonList[this.Playerid][5]*this.picachu.level;
                this.move=g_PokemonList[this.Playerid][1];
            }

            if(pos===g_canvas.height*0.78){
                this.rattata.health -= g_PokemonList[this.Playerid][6]*this.picachu.level;
                this.move= g_PokemonList[this.Playerid][2];
            }

            if(pos===g_canvas.height*0.83){
                this.rattata.health -= g_PokemonList[this.Playerid][7]*this.picachu.level;
                this.move=g_PokemonList[this.Playerid][3];
            }

            if(pos===g_canvas.height*0.885){
                this.rattata.health -= g_PokemonList[this.Playerid][8]*this.picachu.level;
                this.move=g_PokemonList[this.Playerid][4];
            }

            this.battl=3;  //Hoppum í picachu attacks
        }

        if(this.battl===1){ // menu
            var pos = this.picachu.getPos()  //Sæki pos á pointer til að vita hvað við ætlum að gera

            if(pos[0]===g_canvas.width*0.7425 && pos[1]===g_canvas.height*0.87) this.battl=2 //run valið
            if(pos[0]===g_canvas.width*0.4475 && pos[1]===g_canvas.height*0.7625) this.battl=-1;  //Fight valið, hoppum í bardaga moves gluggann
            if(pos[0]===g_canvas.width*0.7425 && pos[1]===g_canvas.height*0.7625) {  //PKMN valið
                console.log("Ekki með í demo");
                this.rattata = new Rattata(g_images.pica);
                this.battl=1;  //Höldum áfram í menu
            }
            if(pos[0]===g_canvas.width*0.4475 && pos[1]===g_canvas.height*0.87) {  // ITEM valið
                console.log("Ekki með í demo");
                this.battl=1;  //Höldum áfram í menu
            }
        }
},
generateEnemy: function() {
        this.poke_img=[g_images.pica,g_images.rat];
        this.id=util.randomNum(0,this.poke_img.length-1);
        this.rattata = new Rattata(this.poke_img[this.id]);

},

generatePokemon : function() {
        this.generateEnemy();
        this.picachu = new Picachu(g_images.pica);
},

battleUpdate: function(du) {
        this.picachu.update(du);  //Update picachu
        this.rattata.update(du);  //Update rattata
},

battleRender: function(ctx) {
    if(this.step===0){//Teikna upphafsmyndina
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, "A wild " + g_PokemonList[this.id][0] + " appears", g_canvas.width*0.1,g_canvas.height*0.8, 2);
    }

    if(this.step>=1){//Rendera rattata
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        this.rattata.render(ctx);
    }

    if(this.step>=2){//Næsta umhverfi
        g_sprites.battle2.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        util.writeText(ctx, g_PokemonList[this.id][0], g_canvas.width*0.07,g_canvas.height*0.09, 1.5)
        this.rattata.render(ctx);
    }

    if(this.battl===1){ //Grunnurinn í bardaganum, erum í menu með battle2 í bakrun, pointerinn er renderaður í gegnum picachu
        this.picachu.render(ctx);
        this.rattata.render(ctx);
    }

    if(this.battl===-1){  //Battle moves, pointerinn er renderaður í gegnum rattata, battle3 er bakrunnurinn í þessu statei
        g_sprites.battle3.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)

        util.writeText(ctx, g_PokemonList[this.id][0], g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, g_PokemonList[this.Playerid][1],g_canvas.width*0.375,g_canvas.height*0.745, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid][2],g_canvas.width*0.375,g_canvas.height*0.80, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid][3],g_canvas.width*0.375,g_canvas.height*0.855, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid][4],g_canvas.width*0.375,g_canvas.height*0.91, 2);

        this.rattata.render(ctx);
    }

    if(this.battl===2){ //Ef valið er run í menu, ekki klárað
        g_sprites.battle4.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        this.rattata.render(ctx);
    }

    if(this.battl===3){//Picachu gerir árás
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        util.writeText(ctx, g_PokemonList[this.Playerid][0]+" uses " + this.move, g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu.render(ctx);
        this.rattata.render(ctx);
    }

    if(this.battl===4){//Rattata gerir árás
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" uses "+g_PokemonList[this.id][this.enemyMove],g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu.render(ctx);
        this.rattata.render(ctx);
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
            } else {
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
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
