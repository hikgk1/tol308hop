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
};

Sprite.prototype.drawAt = function (ctx, x, y) {
    ctx.drawImage(this.image, 
                  x, y);
};

//til að gera sprite ur spritesheet "effects"
Sprite.prototype.drawCropped = function (ctx, sx, sy, sw, sh, dx, dy, dw, dh) {
	//sx, sy eru hnit a effects sheet,  sw sh width height a spritesheet
	//dx,dy,dw,dh eru canvas hnit width height
    ctx.drawImage(this.img, sx, sy, sw, sh, dx, dy, dw, dh);
};

Sprite.prototype.drawAtSize = function (ctx, x, y,z,w) {
    ctx.drawImage(this.image, 
                  x, y,z,w);
};

Sprite.prototype.write = function (ctx,w,x,y,z){
    ctx.save();
    ctx.font = " bold "+z+"px 'Arial'";
    ctx.fillStyle = "black";
    ctx.fillText(w, x, y);
    ctx.restore();
};

Sprite.prototype.drawCentredAt = function (ctx, cx, cy, rotation) {
    if (rotation === undefined) rotation = 0;
    
    var w = this.width,
        h = this.height;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(this.scale, this.scale);
    
    // drawImage expects "top-left" coords, so we offset our destination
    // coords accordingly, to draw our sprite centred at the origin
    ctx.drawImage(this.image, 
                  -w/2, -h/2);
    
    ctx.restore();
};  

Sprite.prototype.drawWrappedCentredAt = function (ctx, cx, cy, rotation) {
    // Get "screen width"
    var sw = g_canvas.width;
    
    // Draw primary instance
    this.drawWrappedVerticalCentredAt(ctx, cx, cy, rotation);
    
    // Left and Right wraps
    this.drawWrappedVerticalCentredAt(ctx, cx - sw, cy, rotation);
    this.drawWrappedVerticalCentredAt(ctx, cx + sw, cy, rotation);
};

Sprite.prototype.drawWrappedVerticalCentredAt = function (ctx, cx, cy, rotation) {
    // Get "screen height"
    var sh = g_canvas.height;
    
    // Draw primary instance
    this.drawCentredAt(ctx, cx, cy, rotation);
    
    // Top and Bottom wraps
    this.drawCentredAt(ctx, cx, cy - sh, rotation);
    this.drawCentredAt(ctx, cx, cy + sh, rotation);
};

Sprite.prototype.drawAnimFrame = function (ctx, cx, cy, ax, ay, width, height) {
    ctx.save();
    ctx.translate(cx, cy);
    if(this.scale < 0) ctx.scale(this.scale, -this.scale)
    else ctx.scale(this.scale, this.scale);
    ctx.drawImage(this.image, ax, ay, width, height, -width/2, -height/2, width, height);
    ctx.restore();
};
