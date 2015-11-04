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

var x = [179,297];
var y = [305,348];
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
        if(p==-1) p=3;
    }
    if (eatKey(this.KEY_D)) {
        j=1;       
    }
    if (eatKey(this.KEY_S)) {
        i=1;    
        p+=1;
        if(p==4) p=0; 
    }    

};

Picachu.prototype.getPos = function(){  //nota til að velja með pointer
	var cx = x[j];
	var cy = y[i];
	var pos=[cx,cy];
	return pos;
}

Picachu.prototype.render = function (ctx) {
	util.fillBox(ctx, 236, 208, this.health*1.25, 10, "black");  //health bar hjá picachu
	g_sprites.picachu.write(ctx,"Picachu",217,197,16);      
    g_sprites.picachu.drawAt(ctx,45,150,100,100);       //Rendera picachu
     if(entityManager.battl==1) g_sprites.pointer.drawAt(ctx,x[j],y[i],20,30);  //ef battl=1 þá teikna pointer

};