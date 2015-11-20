//TODO lifetime, render byggt á update du mun ekki nota þetta strax
//þarf að hafa sprite sheet með?

//achievements: ég náði að haxxa inn basic looking effects eftir að hafa reynt við
// að gera þetta elegant, gafst ég upp vegna þess að ég var í erfiðleikum með að
//vefja höfðinu um kóðann, svo þetta er enn WIP.
//svo fór ég líka og gerði sprites transparent svo þau væru ekki að klippast yfir.
//all in all solid 10 hrs of work, örugglega 6 wasted I að lesa kóðann og klóra mér í höfðinu xD

//honestly pæla að taka bullet.js og fitta það fyrir þetta
function effect(descr) 
{
	for (var property in descr) {
        this[property] = descr[property];
    }
	
	
}

effect.prototype.showEffect = true;

effect.prototype.sx = 0;

effect.prototype.sy = 0;

effect.prototype.sw = 50;

effect.prototype.sh = 50;
/*
effect.prototype.cx = 50;

effect.prototype.cy = 50;

*/



effect.prototype.render = function(ctx) {
	//breyta hard numbers
	if(this.showEffect === true) {
		g_sprites.effect.drawCropped(ctx, this.sx, this.sy, this.sw, this.sh, 
			cx, cy, g_canvas.width*0.625, g_canvas.height*0.125,100,100
		
		);
	}

}


//two seperate things to handle effects on seperate pokemon
//these things will "show" when effect is "in effect" heh
var g_effects_player = new effect({
	
	//TODO maybe add more variables to this
	
	cx: 100,
	cy: 400,

	
});
	
var g_effects_enemy = new effect({
	
	//TODO maybe add more variables to this
	//sx, sy eru coordds a sprite myndinni til ad croppa
	//sw sh er crop width height
	cx: 100,
	cy: 400,
	
	
	});
	
	
	