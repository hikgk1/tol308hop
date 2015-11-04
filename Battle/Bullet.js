// ======
// BULLET
// ======

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// A generic contructor which accepts an arbitrary descriptor object
function Bullet(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
Bullet.prototype.KEY_FIRE = ' '.charCodeAt(0);

Bullet.prototype.health = 60;
Bullet.prototype.level = 1;

var c = [290,312,332,354];
var p = 0; // y-hnit
Bullet.prototype.getPos = function(){
	var cy = c[p];
	return cy;
}
Bullet.prototype.update = function (du) {
        if (eatKey(this.KEY_FIRE)) {
        	entityManager.nextStep();
	   		if(entityManager.step>=4) entityManager.act();

    }
};


Bullet.prototype.render = function (ctx) {
	if(entityManager.step>1) util.fillBox(ctx, 79, 55, this.health*2, 10, "black");
    g_sprites.rattata.drawAt(ctx,250,50,100,100);
    if(entityManager.battl==-1){
    	g_sprites.pointer.drawAt(ctx,100,c[p],20,30);
        util.fillBox(ctx, 236, 208, entityManager._categories[1][0].health*1.25, 10, "black");
    	if(p==0) g_sprites.pointer.write(ctx,"Lightning attack",30,250,16)
    	if(p==1) g_sprites.pointer.write(ctx,"Physical attack",30,250,16)
    	if(p==2) g_sprites.pointer.write(ctx,"Tail whipping...",30,250,16)
    	if(p==3) g_sprites.pointer.write(ctx,"No Move",30,250,16)

    }

};