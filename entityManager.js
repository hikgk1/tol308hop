"use strict";

var entityManager = {

// "PRIVATE" DATA
step: 0,
battl: 0,
move: "",
rattata: 0,
picachu: [],
visibleThunder : false,
visibleAttack : false,
id: 0,
Playerid: [0],
i:0,
poke_img: [],
poke_imgF: [],
_npcs    : [],
enemyMove: 0,
selectPokemon: false,
effects: [],


_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
        fn.call(aCategory[i]);
    }
},


KILL_ME_NOW : -1,

npcList : {
    mainChar : [
                //[{x,y}standing frame, {x,y}walking frame]  on the sprite file
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
           ],
    npc2 : [
            [{ax : 180, ay : 36}, {ax : 162, ay : 162}],
            [{ax : 180, ay : 54}, {ax : 162, ay : 180}],
            [{ax : 162, ay : 144}, {ax : 162, ay : 198}]
           ],
    npc3 : [
            [{ax : 216, ay : 36}, {ax : 198, ay : 162}],
            [{ax : 216, ay : 54}, {ax : 198, ay : 180}],
            [{ax : 198, ay : 144}, {ax : 198, ay : 198}]
           ],
    oak : [
           [{ax : 306, ay : 36}, {ax : 288, ay : 162}],
           [{ax : 306, ay : 54}, {ax : 288, ay : 180}],
           [{ax : 288, ay : 144}, {ax : 288, ay : 198}]
          ],
    invis : [
             [{ax : 0, ay : 216}, {ax : 0, ay : 216}],
             [{ax : 0, ay : 216}, {ax : 0, ay : 216}],
             [{ax : 0, ay : 216}, {ax : 0, ay : 216}]
            ]
},

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._npcs];
},

init: function() {
	this.generateNpcs();
    spatialManager.manageWallsAndGrass();
    this.generatePokemon();
},

generateNpcs : function () {
    entityManager.displayNpc(this.npcList.mainChar, 240, 240, true, false);
    entityManager.displayNpc(this.npcList.npc1, 208, 240, false, false, "WASD to move around");
    entityManager.displayNpc(this.npcList.npc1, 176, -336, false, false, "Use the item to    capture pokemon");
    entityManager.displayNpc(this.npcList.npc1, 496, -720, false, true, "Some more text");
    entityManager.displayNpc(this.npcList.oak, 1392, 48, false, false, "Welcome to the     world of Pokemon!");
    entityManager.displayNpc(this.npcList.invis, 240, 272, false, false, "Welcome to         Pallet Town");
    entityManager.displayNpc(this.npcList.invis, 112, 144, false, false, "Your home");
    entityManager.displayNpc(this.npcList.invis, 368, 144, false, false, "Your neighbors        house");
    entityManager.displayNpc(this.npcList.invis, 432, 400, false, false, "Oaks Poke-lab");
    entityManager.displayNpc(this.npcList.invis, 304, -272, false, false, "Route 1");
    entityManager.displayNpc(this.npcList.invis, 368, -1328, false, false, "Welcome to         Viridian City");
    entityManager.displayNpc(this.npcList.invis, 240, -1712, false, false, "This is a sign");
    entityManager.displayNpc(this.npcList.invis, 304, -2224, false, false, "No more content");
    entityManager.displayNpc(this.npcList.invis, 560, -2032, false, false, "Viridian City Gym  Closed");
    entityManager.displayNpc(this.npcList.npc2, 272, -2224, false, false, "No more content");
    entityManager.displayNpc(this.npcList.npc3, 240, -2224, false, false, "No more content");
    entityManager.displayNpc(this.npcList.npc1, 336, 464, false, false);

    entityManager.moveMultNpc(3, 2, 0);
    entityManager.moveMultNpc(14, 2, 0);
    entityManager.moveMultNpc(15, 3, 0);

    entityManager._npcs[16].script = [0, 3, 496, 2, 336];
},

displayNpc : function (spArr, cx, cy, mainChar, inGrass, text) {
    this._npcs.push(new Npc({
        _spr : spArr,
        _width : 16,
        _height : 16,
        isMainChar : mainChar,
        inGrass : inGrass,
        cx : cx,
        cy : cy,
        chatText : text
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
        this.step++;  //Use this to render through till step=3, then the battle has begun and we use act
        this.picachu[this.i].isDead();
        if(this.step===3) this.battl=1;
},

act: function(){ //Navigates through the stages of the combat
        if(this.battl===2) { //Run selected in menu
            this.endBattle();
        }

        if(this.battl===3) { //display picachu attacks
            this.enemyMove=util.randomNum(1,3); //decide which move enemy will use
            this.battl=4;
            this.rattata.isDead(); //check if enemy rattata is dead
            return;
        }

        if(this.battl===4){ //Display rattata attack
            if(g_PokemonList[this.id][this.enemyMove+4]!=0) this.picachu[this.i].health -= g_PokemonList[this.id][this.enemyMove+4]+this.rattata.level*2;
            this.battl=1
            this.picachu[this.i].isDead();//check if picachu is dead
            return;
        }

        if(this.battl==5){//Render battl 5 till we press space bar
            this.battl=6;
            return;
        }
        if(this.battl==6){//Swap pokemon menu
			var oldi = this.i;
            var pos = this.picachu[this.i].getPos(); //get pos of pointer
            if(this.picachu[pos].health>0){
                this.i=pos;
				
                g_sprites.picachu = new Sprite(this.poke_imgF[this.Playerid[this.i]]);
                g_PokemonList[this.Playerid[this.i]][9].play(); //Pokemon battlecry
				this.picachu[this.i].xPosition = 75;
                this.enemyMove=util.randomNum(1,3);
                this.battl=7;
				this.picachu[oldi].xPosition = -100;
                return;
            }
            else return;
        }
        if(this.battl==7){ //Go selected pokemon!
			this.picachu[this.i].xPosition = 75;
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
                this.Playerid.push(this.id);
                this.picachu.push(new Picachu(this.poke_imgF[this.id],{health:40+this.rattata.level*20
                    ,level:this.rattata.level, scale:(40+this.rattata.level*20)/200})) //create our new pokemon object
                console.log("You cought it");
                this.battl=11;
                return;
            }
            if(pos==1){ //Cancel selected
                this.battl=1;
                return;
            }
        }
        if(this.battl==11){
            this.endBattle();
            return;
        }
        if(this.battl===-1){ // fight moves
            var pos = this.rattata.getPos()  //gets pos of pointer to decide which move is picked
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

            this.battl=3;  //Go to picachu attacks
        }

        if(this.battl===1){ // menu
            var pos = this.picachu[0].getPos()  //get pos on pointer to know what we selected

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
endBattle: function(){ //end battle function
                this.generateEnemy();
                g_inBattle = false;
                g_sounds.battle.pause();
                g_sounds.battle.currentTime = 0;
                g_sounds.route1.play();
                this.step = 0;
                this.battl = 0;
				
                this.move = "";
                this.i=0;
                g_sprites.picachu = new Sprite(this.poke_imgF[this.Playerid[this.i]]); //we always want to start witch picachu if we can
                return;
},
generateEnemy: function() {
        this.poke_img=[g_images.picafront,g_images.rat,g_images.pidgeyfront,g_images.catterpiefront];
        this.id=util.randomNum(0,this.poke_img.length); //random enemy
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
    if(this.step===0){//Render the beginning
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        for(var i=0; i<this.picachu.length-1; i++){
        g_sprites.pokeball.drawAtSize(ctx,390+i*32,327,28,28); //draw pokeballs
        }
        util.writeText(ctx, "A wild " + g_PokemonList[this.id][0] + " appears", g_canvas.width*0.1,g_canvas.height*0.8, 2);
			this.rattata.render(ctx); 
    }

    if(this.step===1){//Render enemy
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        for(var i=0; i<this.picachu.length-1; i++){
        g_sprites.pokeball.drawAtSize(ctx,390+i*32,327,28,28);
        }
        this.rattata.render(ctx);
        util.writeText(ctx,"Go "+g_PokemonList[this.Playerid[this.i]][0],g_canvas.width*0.1,g_canvas.height*0.8, 2)
    }

    if(this.step>=2){//Render picachu and enemy and menu, pointer render through picachu
        g_sprites.battle2.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        this.rattata.render(ctx);
        this.picachu[this.i].render(ctx);
    }

    if(this.battl===1){
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
    }

    if(this.battl===-1){  //Battle moves, pointer is rended through rattata
        g_sprites.battle3.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);

        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl " +this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][1],g_canvas.width*0.375,g_canvas.height*0.745, 2); // our moves
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][2],g_canvas.width*0.375,g_canvas.height*0.80, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][3],g_canvas.width*0.375,g_canvas.height*0.855, 2);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][4],g_canvas.width*0.375,g_canvas.height*0.91, 2);

        this.rattata.render(ctx);
    }

    if(this.battl===2){ //If Run is selected
        g_sprites.battle4.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        this.rattata.render(ctx);
    }

    if(this.battl===3){//Picachu attacks
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height)
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, g_PokemonList[this.Playerid[this.i]][0]+" uses " + this.move, g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu[this.i].render(ctx);
        this.rattata.render(ctx);
        ctx.drawImage(g_sprites.effects.image, 70, 350, 80, 80, 400, 50, 100, 100);
    }

    if(this.battl===4){//Enemy attacks
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
    if(this.battl==8){//enemy fainted
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, "enemy " + g_PokemonList[this.id][0]+" fainted",g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.picachu[this.i].render(ctx);
    }
    if(this.battl==9){//all your pokemons are dead
        g_sprites.rattattack.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        util.writeText(ctx, g_PokemonList[this.id][0]+" lvl "+this.rattata.level, g_canvas.width*0.07,g_canvas.height*0.09, 1.5);
        util.writeText(ctx, "You have no pokemons left",g_canvas.width*0.1,g_canvas.height*0.8, 2);
        this.rattata.render(ctx);
    }
    if(this.battl==10){//Item menu
        util.drawBoarderBox(ctx, g_canvas.width-(8*32), 64, 8, 10);
        util.writeText(ctx, "Pokeball", g_canvas.width-(7*32), 100, 2);
        util.writeText(ctx, "Cancel", g_canvas.width-(7*32), 140, 2);
        this.picachu[0].renderpointer1(ctx);
    }
    if(this.battl==11){//Pokemon captured
        g_sprites.battle1.drawAtSize(ctx,0,0,g_canvas.width,g_canvas.height);
        g_sprites.pokeball.drawAtSize(ctx,g_canvas.width*0.645,g_canvas.height*0.135,32,32);
        util.writeText(ctx, "You cought "+g_PokemonList[this.id][0]+"!",g_canvas.width*0.1,g_canvas.height*0.8, 2);
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
