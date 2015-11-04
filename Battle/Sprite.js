// ============
// SPRITE STUFF
// ============

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/


// Construct a "sprite" from the given `image`,
//
function Sprite(image) {
    this.image = image;

    this.width = image.width;
    this.height = image.height;
    this.scale = 1;
}

Sprite.prototype.drawAt = function (ctx, x, y,z,w) {
    ctx.drawImage(this.image, 
                  x, y,z,w);
};

Sprite.prototype.write = function (ctx,w,x,y,z){
    ctx.font = " bold "+z+"px 'Arial'";
    ctx.fillStyle = "black";
    ctx.fillText(w, x, y);
}
