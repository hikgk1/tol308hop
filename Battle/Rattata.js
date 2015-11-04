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

var c = [290,312,332,354];
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


Rattata.prototype.render = function (ctx) {
	if(entityManager.step>1) util.fillBox(ctx, 79, 55, this.health*2, 10, "black");    //Rattata healthbar
    g_sprites.rattata.drawAt(ctx,250,50,100,100);       //renderar rattata

    if(entityManager.battl==-1){   // battl=-1 þá erum við í battl move
     	g_sprites.pointer.drawAt(ctx,100,c[p],20,30); // Teikna pointer
        util.fillBox(ctx, 236, 208, entityManager.picachu.health*1.25, 10, "black"); //Því picachu er ekki renderaður í þessum glugga þá þarf að teikna healthið hér
    	if(p==0) g_sprites.pointer.write(ctx,"Lightning attack",30,250,16)  // Það sem stendur í boxinu
    	if(p==1) g_sprites.pointer.write(ctx,"Physical attack",30,250,16)
    	if(p==2) g_sprites.pointer.write(ctx,"Tail whipping...",30,250,16)
    	if(p==3) g_sprites.pointer.write(ctx,"No Move",30,250,16)

    }

};