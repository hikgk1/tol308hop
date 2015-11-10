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
function Rattata(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
Rattata.prototype.KEY_FIRE = ' '.charCodeAt(0);  //Space bar

Rattata.prototype.health = 60;
Rattata.prototype.level = 1;

var c = [g_canvas.height*0.725, g_canvas.height*0.78, g_canvas.height*0.83, g_canvas.height*0.885];
var p = 0; // y-hnit
Rattata.prototype.getPos = function(){  //nota til að velja með pointer
	var cy = c[p];
	return cy;
}
Rattata.prototype.update = function (du) {
        if (eatKey(this.KEY_FIRE)) {  //Space bar navigatear í gegnum kerfið, next step fer í gegnum byrjunina og þegar að pointer kemur inn þá notum við act functionið
        	entityManager.nextStep();
	   		if(entityManager.step>=4) entityManager.act();

    }
};

Rattata.prototype.isDead = function(){
    if(this.health<=0){
        g_inBattle = false;
        entityManager.step = 0;
        entityManager.battl = 0;
        entityManager.move = "";
        this.health = 60;
        return;
    }
    else return;               
}

Rattata.prototype.render = function (ctx) {
	if(entityManager.step>1){
    util.fillBox(ctx, g_canvas.width*0.1925 ,g_canvas.height*0.1325, 205, 15, "grey");
    util.fillBox(ctx, g_canvas.width*0.1975 ,g_canvas.height*0.1375, 198, 10, "white");
    util.fillBox(ctx, g_canvas.width*0.1975,g_canvas.height*0.1375, this.health*3.3, 10, "black");    //Rattata healthbar
    }
    g_sprites.rattata.drawAtSize(ctx,g_canvas.width*0.625,g_canvas.height*0.125,100,100);       //renderar rattata

    if(entityManager.battl==-1){   // battl=-1 þá erum við í battl move
     	g_sprites.pointer.drawAtSize(ctx,g_canvas.width*0.25,c[p],20,30); // Teikna pointer
        util.fillBox(ctx, g_canvas.width*0.58 ,g_canvas.height*0.52, 208, 15, "grey");
        util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, 200, 10, "white");
        util.fillBox(ctx, g_canvas.width*0.585,g_canvas.height*0.525, entityManager.picachu.health*2, 10, "black"); //Því picachu er ekki renderaður í þessum glugga þá þarf að teikna healthið hér
        /*if(p===0) g_sprites.pointer.write(ctx,"Lightning attack",g_canvas.width*0.075,g_canvas.height*0.625,16)  // Það sem stendur í boxinu
    	if(p===1) g_sprites.pointer.write(ctx,"Physical attack",g_canvas.width*0.075,g_canvas.height*0.625,16)
    	if(p===2) g_sprites.pointer.write(ctx,"Tail whipping...",g_canvas.width*0.075,g_canvas.height*0.625,16)
    	if(p===3) g_sprites.pointer.write(ctx,"No Move",g_canvas.width*0.075,g_canvas.height*0.625,16)*/
        if(p===0) util.writeText(ctx,"Lightning attack",g_canvas.width*0.075,g_canvas.height*0.625, 2);
        if(p===1) util.writeText(ctx,"Physical attack",g_canvas.width*0.075,g_canvas.height*0.625, 2);
        if(p===2) util.writeText(ctx,"Tail whip",g_canvas.width*0.075,g_canvas.height*0.625, 2);
        if(p===3) util.writeText(ctx,"No Move",g_canvas.width*0.075,g_canvas.height*0.625, 2);

    }

};