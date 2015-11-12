// =========
// ASTEROIDS
// =========
/*

A sort-of-playable version of the classic arcade game.


HOMEWORK INSTRUCTIONS:

You have some "TODO"s to fill in again, particularly in:

spatialManager.js

But also, to a lesser extent, in:

Rock.js
Bullet.js
Ship.js


...Basically, you need to implement the core of the spatialManager,
and modify the Rock/Bullet/Ship to register (and unregister)
with it correctly, so that they can participate in collisions.

Be sure to test the diagnostic rendering for the spatialManager,
as toggled by the 'X' key. We rely on that for marking. My default
implementation will work for the "obvious" approach, but you might
need to tweak it if you do something "non-obvious" in yours.
*/

"use strict";

/* jshint browser: true, devel: true, globalstrict: true */

var g_canvas = document.getElementById("myCanvas");
var g_ctx = g_canvas.getContext("2d");
var g_inBattle = false;

/*
0        1         2         3         4         5         6         7         8
12345678901234567890123456789012345678901234567890123456789012345678901234567890
*/

// =============
// GATHER INPUTS
// =============

function gatherInputs() {
    // Nothing to do here!
    // The event handlers do everything we need for now.
}


// =================
// UPDATE SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `update` routine handles generic stuff such as
// pausing, single-step, and time-handling.
//
// It then delegates the game-specific logic to `updateSimulation`


// GAME-SPECIFIC UPDATE LOGIC

function updateSimulation(du) {
    
    processDiagnostics();
    
    if(!g_inBattle) {
        entityManager.update(du);
    } else {
        entityManager.battleUpdate(du);
        eatKey(Rattata.prototype.KEY_FIRE);
    }
}

// GAME-SPECIFIC DIAGNOSTICS

var g_renderSpatialDebug = false;

var KEY_SPATIAL = keyCode('X');

function processDiagnostics() {

    if (eatKey(KEY_SPATIAL)) g_renderSpatialDebug = !g_renderSpatialDebug;
}


// =================
// RENDER SIMULATION
// =================

// We take a very layered approach here...
//
// The primary `render` routine handles generic stuff such as
// the diagnostic toggles (including screen-clearing).
//
// It then delegates the game-specific logic to `gameRender`


// GAME-SPECIFIC RENDERING

function renderSimulation(ctx) {
	if(!g_inBattle) {
        ctx.save();

        ctx.translate(304-entityManager._npcs[0].cx,272-entityManager._npcs[0].cy)
        ctx.drawImage(g_images.route1,0,-1152);
        ctx.drawImage(g_images.palletTown,-286,-94);
		ctx.drawImage(g_images.pokelab,896,-416)

        entityManager.render(ctx);
        if(entityManager._npcs[0]._isTalking) {
            util.chatBoxText(entityManager._npcs[0]._chatText);
        }

        if (g_renderSpatialDebug) spatialManager.render(ctx);
        ctx.restore();
    } else {
        entityManager.battleRender(ctx);
    }
}


// =============
// PRELOAD STUFF
// =============

var g_images = {};

function requestPreloads() {

    var requiredImages = {
        npcSheet   : "./sheets/asheet.png",
		palletTown   : "./sheets/pallet_town.png",
		route1   : "./sheets/route1test.png",
        battle1: "./sheets/Battle1.png",
        rat: "./sheets/rat.png",
        battle2: "./sheets/Battle2.png",
        pica: "./sheets/Pica.png",
        battle3: "./sheets/Battle3.png",
        battle4: "./sheets/Battle4.png",
        pointer: "./sheets/Pointer.png",
        rattattack: "./sheets/ratattack.png",
        font: "./sheets/font.png",
		grasspatch: "./sheets/grasspatch.png",
		pokelab: "./sheets/pokelab.png",
        boarder: "./sheets/boxboarder.png"
    };

    imagesPreload(requiredImages, g_images, preloadDone);
}

var g_sprites = {};

function preloadDone() {

    g_sprites.npcs  = new Sprite(g_images.npcSheet);
    g_sprites.battle1 = new Sprite(g_images.battle1);
    g_sprites.battle2 = new Sprite(g_images.battle2);
    g_sprites.rattata = new Sprite(g_images.rat);
    g_sprites.picachu = new Sprite(g_images.pica);
    g_sprites.battle3 = new Sprite(g_images.battle3);
    g_sprites.battle4 = new Sprite(g_images.battle4);
    g_sprites.pointer = new Sprite(g_images.pointer);
    g_sprites.rattattack = new Sprite(g_images.rattattack);
    g_sprites.font = new Sprite(g_images.font);
    g_sprites.boarder = new Sprite(g_images.boarder);

    entityManager.init();

    main.init();
}

// Kick it off
requestPreloads();