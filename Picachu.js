"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

function Picachu(img,descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
    g_sprites.picachu = new Sprite(img);
    Picachu.prototype.level = 1;
Picachu.prototype.health = 100+Picachu.prototype.level*30;
Picachu.prototype.scale = Picachu.prototype.health/200;
Picachu.prototype.experience = 0;
}
Picachu.prototype.KEY_W = 'W'.charCodeAt(0);
Picachu.prototype.KEY_S  = 'S'.charCodeAt(0);
Picachu.prototype.KEY_A  = 'A'.charCodeAt(0);
Picachu.prototype.KEY_D  = 'D'.charCodeAt(0);

var f= [g_canvas.height*0.17,g_canvas.height*0.24]
var k = 0;
var d = [g_canvas.height*0.11,g_canvas.height*0.22,g_canvas.height*0.33,g_canvas.height*0.44,g_canvas.height*0.55,g_canvas.height*0.66];
var e = 0; // y-cords for selectPokemon
var x = [g_canvas.width*0.4475,g_canvas.width*0.7425];
var y = [g_canvas.height*0.7625,g_canvas.height*0.87];
var j = 0; // x-hnit
var i = 0; // y-hnit


Picachu.prototype.update = function (du) {
        //i og j stýra hvar örin í menu er
        // p stýrir hvar örin í attack moves er
    if (eatKey(this.KEY_A)) {
        if(entityManager.battl==1) j=0; //Uppdate pointer in menu
    }
    if (eatKey(this.KEY_W)) {
        if(entityManager.battl==1) i=0;
        if(entityManager.battl==-1){ //Uppdate pointer in attack moves
            p-=1;
            if(p==-1) p=3;
        }
        if(entityManager.battl==6){ //Uppdate pointer in select pokemon
            e-=1;
            if(e==-1) e=entityManager.picachu.length-1;
        }
        if(entityManager.battl==10){
            k-=1;
            if(k==-1) k=1;
        }
    }
    if (eatKey(this.KEY_D)) {
        if(entityManager.battl==1) j=1;       //Uppdate pointer in menu
    }
    if (eatKey(this.KEY_S)) {
        if(entityManager.battl==1) i=1;    
        if(entityManager.battl==-1){        //Uppdate pointer in attack moves
            p+=1;
            if(p==4) p=0;
        } 
        if(entityManager.battl==6){ //Uppdate pointer in select pokemon
            e+=1;
            if(e==entityManager.picachu.length) e=0;
        }
        if(entityManager.battl==10){
            k+=1;
            if(k==2) k=0;
        }
    }    
    if(this.experience >= 100*this.level){
        this.experience=this.experience-100*this.level;
        this.level+=1;
    }
};

Picachu.prototype.isDead = function(){
    if(this.health<=0){
        var l=entityManager.picachu.length;
        var i=entityManager.i;
        var c=0;
        while(c<l-1){
            if(i==l-1 && l>1) i=0;
            else i+=1
            if(entityManager.picachu[i].health>0){
                entityManager.i=i
                g_sprites.picachu = new Sprite(entityManager.poke_imgF[entityManager.Playerid[entityManager.i]]);
                g_PokemonList[entityManager.Playerid[entityManager.i]][9].play();
                this.enemyMove=util.randomNum(1,3); //ákveður attack move hjá enemy
                this.battl=7;
                return;
        }
        c++;
        }
        c=0
        while(c<l){
            if(c==0){
                entityManager.picachu[c].health=100+entityManager.picachu[c].level*30;
                entityManager.picachu[c].scale=entityManager.picachu[c].health/200;
            }
            else{
                entityManager.picachu[c].health=40+entityManager.picachu[c].level*20;
                entityManager.picachu[c].scale=entityManager.picachu[c].health/200;
            }
            c++;
        }
        entityManager.battl=9;
        return;
    }

    else return;               
}

Picachu.prototype.getPos = function(){  //nota til að velja með pointer
    if(entityManager.battl==6) return e;
    if(entityManager.battl==10) return k;
	var cx = x[j];
	var cy = y[i];
	var pos=[cx,cy];
	return pos;
}

Picachu.prototype.render = function (ctx) {
    util.fillBox(ctx, g_canvas.width*0.58 ,g_canvas.height*0.52, 208, 15, "grey");
    util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, 200, 10, "white");
	if(this.health > 0) util.fillBox(ctx, g_canvas.width*0.585 ,g_canvas.height*0.525, this.health/this.scale, 10, "black"); //health bar hjá picachu
    util.writeText(ctx, g_PokemonList[entityManager.Playerid[entityManager.i]][0]+" lvl "+this.level, g_canvas.width*0.5425,g_canvas.height*0.4725, 1.5);
    g_sprites.picachu.drawAtSize(ctx,g_canvas.width*0.1125,g_canvas.height*0.375,g_canvas.width*0.25,g_canvas.height*0.25);       //Rendera picachu
    if(entityManager.battl==1) g_sprites.pointer.drawAtSize(ctx,x[j],y[i],20,30);  //ef battl=1 þá teikna pointer
};
Picachu.prototype.renderpointer = function (ctx) {
    g_sprites.pointer.drawAtSize(ctx,g_canvas.width*0.05,d[e],20,30);
}
Picachu.prototype.renderpointer1 = function (ctx) {
    g_sprites.pointer.drawAtSize(ctx,g_canvas.width*0.625,f[k],10,15)
}