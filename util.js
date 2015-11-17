// util.js
//
// A module of utility functions, with no private elements to hide.
// An easy case; just return an object containing the public stuff.

"use strict";

var util = {

// RANGES
// ======

clampRange: function(value, lowBound, highBound) {
    if (value < lowBound) {
	value = lowBound;
    } else if (value > highBound) {
	value = highBound;
    }
    return value;
},

wrapRange: function(value, lowBound, highBound) {
    while (value < lowBound) {
	value += (highBound - lowBound);
    }
    while (value > highBound) {
	value -= (highBound - lowBound);
    }
    return value;
},

isBetween: function(value, lowBound, highBound) {
    if (value < lowBound) { return false; }
    if (value > highBound) { return false; }
    return true;
},

// RANDOMNESS
// ==========

randRange: function(min, max) {
    return (min + Math.random() * (max - min));
},

// MISC
// ====

square: function(x) {
    return x*x;
},

// DISTANCES
// =========

distSq: function(x1, y1, x2, y2) {
    return this.square(x2-x1) + this.square(y2-y1);
},

wrappedDistSq: function(x1, y1, x2, y2, xWrap, yWrap) {
    var dx = Math.abs(x2-x1),
	dy = Math.abs(y2-y1);
    if (dx > xWrap/2) {
	dx = xWrap - dx;
    };
    if (dy > yWrap/2) {
	dy = yWrap - dy;
    }
    return this.square(dx) + this.square(dy);
},

// CANVAS OPS
// ==========

clearCanvas: function (ctx) {
    var prevfillStyle = ctx.fillStyle;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = prevfillStyle;
},

strokeCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
},

fillCircle: function (ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
},

fillBox: function (ctx, x, y, w, h, style) {
    var oldStyle = ctx.fillStyle;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = oldStyle;
},

writeText: function (ctx, w, x, y, scale) {
    for (var i = 0; i < w.length; i++) {
        var p = w.charAt(i);
        var tmp = g_font[p.charCodeAt(0)];
        ctx.drawImage(g_sprites.font.image, tmp[0], tmp[1], 8, 8, x, y, 8*scale, 8*scale);
        x += 8*scale;
    }
},

drawBoarderBox: function (ctx, x, y, width, height) {
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(g_sprites.boarder.image, 0, 0, 15, 15, 0, 0, 32, 32);
    
    for (var i = 1; i < width-1; i++) {
        ctx.drawImage(g_sprites.boarder.image, 16, 0, 15, 15, i*32, 0, 32, 32);
    }

    ctx.scale(-1, 1);
    ctx.drawImage(g_sprites.boarder.image, 0, 0, 15, 15, -width*32, 0, 32, 32);
    ctx.scale(-1, 1);

    for(var i = 1; i < height-1; i++) {
        ctx.drawImage(g_sprites.boarder.image, 32, 0, 15, 15, 0, i*32, 32, 32);
        ctx.scale(-1, 1);
        ctx.drawImage(g_sprites.boarder.image, 32, 0, 15, 15, -width*32, i*32, 32, 32);
        ctx.scale(-1, 1);
    }

    ctx.scale(1, -1);
    ctx.drawImage(g_sprites.boarder.image, 0, 0, 15, 15, 0, -height*32, 32, 32);
    ctx.scale(1, -1);

    ctx.scale(1, -1);
    for (var i = 1; i < width-1; i++) {
        ctx.drawImage(g_sprites.boarder.image, 16, 0, 15, 15, i*32, -height*32, 32, 32);
    }
    ctx.scale(1, -1);

    ctx.scale(-1, -1);
    ctx.drawImage(g_sprites.boarder.image, 0, 0, 15, 15, -width*32, -height*32, 32, 32);
    ctx.scale(-1, -1);

    util.fillBox(ctx, 16, 16, (width-1)*32, (height-1)*32, "white");

    ctx.restore();
},

chatBoxText: function (w) {
    g_ctx.save();
    g_ctx.translate(entityManager._npcs[0].cx-304,entityManager._npcs[0].cy-272);
    util.drawBoarderBox(g_ctx, 0, 12*32, 20, 6);
    util.writeText(g_ctx, w.substr(0,19).trim(), 1.5*32, 13.5*32, 3.5);
    util.writeText(g_ctx, w.substr(19,19).trim(), 1.5*32, 15*32, 3.5);
    g_ctx.restore()
},

randomNum: function(min,max){
    var num = min + (Math.random()*max);
    num=Math.floor(num);
    return num;
}

};
