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
//  TODO!: gera animation fyrir pokekúlu menu og velja pokemon menu, klára að bugfixa ef þeir deija, gera kerfið fallegra
var entityManager = {

// "PRIVATE" DATA
step: 0,
battl: 0,
move: "",
rattata: 0,
picachu: [],
id: 0,
Playerid: [0],
i:0,
poke_img: [],
poke_imgF: [],
_npcs    : [],
enemyMove: 0,
selectPokemon: false,
effects: [],

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
                //[{x,y}standing anim, {x,y}walking anim]  on the sprite file
                //First line facing down
                //Second line facing up
                //Third line facing left
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

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._npcs];
},

init: function() {
	entityManager.displayNpc(this.npcList.mainChar, 240, 240, true,false);
    entityManager.displayNpc(this.npcList.npc1, 208, 240, false,false);
    entityManager.displayNpc(this.npcList.npc1, 176, -336, false,false);
    entityManager.displayNpc(this.npcList.npc1, 496, -720, false,true);
    entityManager.moveMultNpc(3, 2, 0);
    spatialManager.manageWallsAndGrass();
    this.generatePokemon();
    entityManager._npcs[1].chatText = "WASD to move around";
    entityManager._npcs[2].chatText = "Use the item to    capture pokemon";
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
        this.picachu[this.i].isDead();
        if(this.step===3) this.battl=1;
},

act: function(){
        if(this.battl===2) {
            this.endBattle();
        }

        if(this.battl===3) { //picachu attacks, bara til að birta myndina
            this.enemyMove=util.randomNum(1,3); //ákveður attack move hjá enemy
            this.battl=4;
            this.rattata.isDead();
            return;
        }

        if(this.battl===4){ //rattata attacks
            if(g_PokemonList[this.id][this.enemyMove+4]!=0) this.picachu[this.i].health -= g_PokemonList[this.id][this.enemyMove+4]+this.rattata.level*2;
            this.battl=1
            this.picachu[this.i].isDead();
            return;
        }

        if(this.battl==5){
            this.battl=6;
            return;
        }
        if(this.battl==6){
            var pos = this.picachu[this.i].getPos();
            if(this.picachu[pos].health>0){
                this.i=pos;
                g_sprites.picachu = new Sprite(this.poke_imgF[this.Playerid[this.i]]);
                g_PokemonList[this.Playerid[this.i]][9].play();
                this.enemyMove=util.randomNum(1,3); //ákveður attack move hjá enemy
                this.battl=7;
                return;
            }
            else return;
        }
        if(this.battl==7){ //Go selected pokemon!
            this.battl=4;
            return;
        }
        if(this.battl==8 || this.battl==9){ // pokemon faints, end battle
            this.endBattle();
            return;
        }
        if(this.battl==10){//item menu
            var pos = this.picachu[this.i].getPos();
            if(pos==0){
                if(this.Playerid.length===6){
                    console.log("You can only have 6 pokemons");
                    return;
                }
                var h = ((this.rattata.health/this.rattata.scale)/200)*10 //get the % of what's left of enemy health
                var j = util.randomNum(1,h); //calculate if pokemon is caught
                if(j!=1){
                    console.log("It got away")
                    this.enemyMove=util.randomNum(1,3); //decides enemys attack move
                    this.battl=4;
                    return;
                }
                this.picachu.push(new Picachu(this.poke_imgF[this.id],{health:40+this.rattata.level*20
                    ,level:this.rattata.level, scale:(40+this.rattata.level*20)/200}))
                this.Playerid.push(this.id);
                console.log("You cought it");
                this.endBattle();
            }
            if(pos==1){
                this.battl=1;
                return;
            }
        }
        if(this.battl===-1){ // bardaga move
            var pos = this.rattata.getPos()  //Sæki pos á pointer til að vita hvaða move er valið
            if(pos===g_canvas.height*0.725){
                if(g_PokemonList[this.Playerid[this.i]][5]!=0) this.rattata.health -= g_PokemonList[this.Playerid[this.i]][5]+this.picachu[this.i].level*2.5;
                this.move=g_PokemonList[this.Playerid[this.i]][1];
            }

            if(pos===g_canvas.height*0.78){
                if(g_PokemonList[this.Playerid[this.i]][6]!=0) this.rattata.health -= g_PokemonList[this.Playerid[this.i]][6]+this.picachu[this.i].level*2.5;
                this.move= g_PokemonList[this.Playerid[this.i]][2];
            }

            if(pos===g_canvas.height*0.83){
                if(g_PokemonList[this.Playerid[this.i]][7]!=0) this.rattata.health -= g_PokemonList[this.Playerid[this.i]][7]+this.picachu[this.i].level*2.5;
                this.move=g_PokemonList[this.Playerid[this.i]][3];
            }

            if(pos===g_canvas.height*0.885){
                if(g_PokemonList[this.Playerid[this.i]][8]!=0) this.rattata.health -= g_PokemonList[this.Playerid[this.i]][8]+this.picachu[this.i].level*2.5;
                this.move=g_PokemonList[this.Playerid[this.i]][4];
            }

            this.battl=3;  //Hoppum í picachu attacks
        }

        if(this.battl===1){ // menu
            var pos = this.picachu[0].getPos()  //Sæki pos á pointer til að vita hvað við ætlum að gera

            if(pos[0]===g_canvas.width*0.7425 && pos[1]===g_canvas.height*0.87) this.battl=2 //run chosen

            if(pos[0]===g_canvas.width*0.4475 && pos[1]===g_canvas.height*0.7625) this.battl=-1;  //Fight chosen, move to battlemoves window

            if(pos[0]===g_canvas.width*0.7425 && pos[1]===g_canvas.height*0.7625) {  //PKMN chosen, switch betweene pokemons
                console.log("Skiptum í næsta pokemon");
                this.battl=5;
                return;
            }
            if(pos[0]===g_canvas.width*0.4475 && pos[1]===g_canvas.height*0.87) {  // ITEM valið
                console.log("Kastar Poke kúlu");
                this.battl=10;
                return;
                
        }
    }
},
endBattle: function(){
                this.generateEnemy();
                g_inBattle = false;
                g_sounds.battle.pause();
                g_sounds.battle.currentTime = 0;
                g_sounds.route1.play();
                this.step = 0;
                this.battl = 0;
                this.move = "";
                this.i=0;
                g_sprites.picachu = new Sprite(this.poke_imgF[this.Playerid[this.i]]);
                return;
},
generateEnemy: function() {
        this.poke_img=[g_images.picafront,g_images.rat,g_images.pidgeyfront,g_images.catterpiefront];
        this.id=util.randomNum(0,this.poke_img.length);
        this.rattata = new Rattata(this.poke_img[this.id]);

},

generatePokemon : function() {
        this.poke_imgF=[g_images.pica,g_images.rattataback,g_images.pidgeyback,g_images.catterpieback]
        this.generateEnemy();
        this.picachu.push(new Picachu(this.poke_imgF[0]));
},

battleUpdate: function(du) {
        this.picachu[this.i].update(du);  //Update picachu
        this.rattata.update(du);  //Update rattata
},

battleRender: function(ctx) {
    if(this.step===0){//Teikna upphafsmyndina
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        for(var i=0; i<this.picachu.length-1; i++){
        g_sprites.pokeball.drawAtSize(ctx,390+i*32,327,28,28);
        }
        util.writeText(ctx, "A wild " + g_PokemonList[this.id][0] + " appears", g_canvas.width*0.1,g_canvas.height*0.8, 2);
    }

    if(this.step===1){//Rendera rattata
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        for(var i=0; i<this.picachu.length-1; i++){
        g_sprites.pokeball.drawAtSize(ctx,390+i*32,327,28,28);
        }
        this.rattata.render(ctx);
        util.writeText(ctx,"Go "+g_PokemonList[this.Playerid[this.i]][0],g_canvas.width*0.1,g_canvas.height*0.8, 2)
    }

    if(this.step>=2){//Næsta umhverfi
        g_sprites.battle2.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        this.rattata.render(ctx);
        this.picachu[this.i].render(ctx);
    }

    if(this.battl===1){ //Grunnurinn í bardaganum, erum í menu með battle2 í bakrun, pointerinn er renderaður í gegnum picachu
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
    }

    if(this.battl===-1){  //Battle moves, pointerinn er renderaður í gegnum rattata, battle3 er bakrunnurinn í þessu statei
        g_sprites.battle3.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);

        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl " +this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][1],g_canvas.width*0.375,g_canvas.height*0.745, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][2],g_canvas.width*0.375,g_canvas.height*0.80, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][3],g_canvas.width*0.375,g_canvas.height*0.855, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][4],g_canvas.width*0.375,g_canvas.height*0.91, 2);

        this.rattata.render(ctx);
    }

    if(this.battl===2){ //If Run is selected
        g_sprites.battle4.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        this.rattata.render(ctx);
    }

    if(this.battl===3){//Picachu gerir árás
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][0]+" uses " + this.move, g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
        ctx.drawImage(g_sprites.effects.image, 70, 350, 80, 80, 400, 50, 100, 100);
    }

    if(this.battl===4){//Rattata gerir árás
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, "enemy " + g_PokemonList[this.id][0]+" uses "+g_PokemonList[this.id][this.enemyMove],g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
        ctx.drawImage(g_sprites.effects.image, 70, 350, 80, 80, 50, 150, 120, 120);
    }
    if(this.battl==5){//Swap pokemon
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx,g_PokemonList[this.Playerid[this.i]][0] + " come back!",g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.rattata.render(ctx);
    }
    if(this.battl==6){//Swap pokemon
            this._npcs[0].drawPokeMenu(ctx);
            this.picachu[0].renderpointer(ctx);
    }
    if(this.battl==7){//Go selected pokemon!
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
        util.writeText(ctx,"Go "+g_PokemonList[this.Playerid[this.i]][0] + "!",g_canvas.width*0.1,g_canvas.height*0.8, 2);
    }
    if(this.battl==8){
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, "enemy " + g_PokemonList[this.id][0]+" fainted",g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu[this.i].render(ctx);
    }
    if(this.battl==9){
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, "You have no pokemons left",g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.rattata.render(ctx);
    }
    if(this.battl==10){
        util.drawBoarderBox(ctx, g_canvas.width-(8*32), 64, 8, 10);
        util.writeText(ctx, "Pokeball", g_canvas.width-(7*32), 100, 2);
        util.writeText(ctx, "Cancel", g_canvas.width-(7*32), 140, 2);
        this.picachu[0].renderpointer1(ctx);
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
    for (var c = 0; c < this._categories.length; ++c) {
        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
            aCategory[i].render(ctx);
        }
    }

    //Unfortunate side-effect of having the main char an npc is that this needs to be drawn here, so that the other npcs don't get drawn over the menus
    if(this._npcs[0]._inMenu) {
        this._npcs[0].drawMenu(ctx);
    }

    if(this._npcs[0]._inPokeMenu) {
        this._npcs[0].drawPokeMenu(ctx,1);
    }
}

}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();
