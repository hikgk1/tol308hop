// ======
// Rattata
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Rattata(img,descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    g_sprites.rattata = new Sprite(img);
    Rattata.prototype.level = util.randomNum(1,5);

Rattata.prototype.KEY_FIRE = ' '.charCodeAt(0);  //Space bar
Rattata.prototype.health = 40+this.level*20;
Rattata.prototype.scale = this.health/200;
Rattata.prototype.xPosition = 700;
Rattata.prototype.yPosition = 72;
Rattata.prototype.dMovement = 5;
}
var c = [g_canvas.height*0.725, g_canvas.height*0.78, g_canvas.height*0.83, g_canvas.height*0.885];
var p = 0; // y-cords for battle move
Rattata.prototype.getPos = function(){  //get pointer cords
    var cy = c[p];
	return cy;
}

Rattata.prototype.update = function (du) {
        if (eatKey(this.KEY_FIRE)) {  //Space bar navigates through the combat
            if(entityManager.step === 1) entityManager.nextStep();
            if(entityManager.step === 3) entityManager.nextStep();
            
	   		if(entityManager.step>=4) entityManager.act();//Battle starts and act() navigates

    }
	
	if (entityManager.battl == 0 && entityManager.step == 0) {
		this.xPosition -= 5;
		if (this.xPosition < 440) {
			this.xPosition = 450;
			entityManager.battl = 0;
			entityManager.step = 1;
			g_PokemonList[entityManager.id][9].play();
		}
	}
	
};

Rattata.prototype.isDead = function(){
    if(this.health<=0){
        entityManager.picachu[entityManager.i].experience+=50+this.level*10; //gain exp when we win combats
        entityManager.battl=8;
        return;
    }
    else return;               
}

Rattata.prototype.render = function (ctx) {
	if(entityManager.step>1){
    util.fillBox(ctx, g_canvas.width*0.1925 ,g_canvas.height*0.1325, 205, 15, "grey");
    util.fillBox(ctx, g_canvas.width*0.1975 ,g_canvas.height*0.1375, 198, 10, "white");
    if(this.health > 0) util.fillBox(ctx, g_canvas.width*0.1975,g_canvas.height*0.1375, this.health/this.scale, 10, "black");    //Rattata healthbar
    }
    g_sprites.rattata.drawAtSize(ctx,this.xPosition,this.yPosition,100,100);       //render rattata

    if(entityManager.battl==-1){   // battl=-1 þá erum við í battl move
     	g_sprites.pointer.drawAtSize(ctx,g_canvas.width*0.25,c[p],20,30); // draw pointer
        util.fillBox(ctx, g_canvas.width*0.58 ,g_canvas.height*0.52, 208, 15, "grey");
        util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, 200, 10, "white");
        util.fillBox(ctx, g_canvas.width*0.585,g_canvas.height*0.525,
        entityManager.picachu[entityManager.i].health/entityManager.picachu[entityManager.i].scale, 10, "black"); //Því picachu er ekki renderaður í þessum glugga þá þarf að teikna healthið hér
        if(p===0) util.writeText(ctx,"Attack move 1",g_canvas.width*0.075,g_canvas.height*0.625, 2); 
        if(p===1) util.writeText(ctx,"Attack move 2",g_canvas.width*0.075,g_canvas.height*0.625, 2);
        if(p===2) util.writeText(ctx,"Attack move 3",g_canvas.width*0.075,g_canvas.height*0.625, 2);
        if(p===3) util.writeText(ctx,"No Move",g_canvas.width*0.075,g_canvas.height*0.625, 2);

    }


};