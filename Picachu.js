"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Picachu(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}
Picachu.prototype.KEY_W = 'W'.charCodeAt(0);
Picachu.prototype.KEY_S  = 'S'.charCodeAt(0);
Picachu.prototype.KEY_A  = 'A'.charCodeAt(0);
Picachu.prototype.KEY_D  = 'D'.charCodeAt(0);

Picachu.prototype.health = 100;
Picachu.prototype.level = 1;

var x = [g_canvas.width*0.4475,g_canvas.width*0.7425];
var y = [g_canvas.height*0.7625,g_canvas.height*0.87];
var j = 0; // x-hnit
var i = 0; // y-hnit


Picachu.prototype.update = function (du) {
        //i og j stýra hvar örin í menu er
        // p stýrir hvar örin í attack moves er
    if (eatKey(this.KEY_A)) {
        j=0;
    }
    if (eatKey(this.KEY_W)) {
        i=0;
        p-=1;
        if(p===-1) p=3;
    }
    if (eatKey(this.KEY_D)) {
        j=1;       
    }
    if (eatKey(this.KEY_S)) {
        i=1;    
        p+=1;
        if(p===4) p=0; 
    }    

};

Picachu.prototype.isDead = function(){
    if(this.health<=0){
        g_inBattle = false;
        g_sounds.battle.pause();
        g_sounds.battle.currentTime = 0;
        g_sounds.route1.play();
        entityManager.step = 0;
        entityManager.battl = 0;
        entityManager.move = "";
        entityManager.rattata.health = 60;
        this.health = 100;
        return;
    }
    else return;               
}

Picachu.prototype.getPos = function(){  //nota til að velja með pointer
	var cx = x[j];
	var cy = y[i];
	var pos=[cx,cy];
	return pos;
}

Picachu.prototype.render = function (ctx) {
    util.fillBox(ctx, g_canvas.width*0.58 ,g_canvas.height*0.52, 208, 15, "grey");
    util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, 200, 10, "white");
	util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, this.health*2, 10, "black"); //health bar hjá picachu
    util.writeText(ctx, "Pikachu", g_canvas.width*0.5425,g_canvas.height*0.4725, 1.5);
    g_sprites.picachu.drawAtSize(ctx,g_canvas.width*0.1125,g_canvas.height*0.375,g_canvas.width*0.25,g_canvas.height*0.25);       //Rendera picachu
    if(entityManager.battl===1) g_sprites.pointer.drawAtSize(ctx,x[j],y[i],20,30);  //ef battl=1 þá teikna pointer

};