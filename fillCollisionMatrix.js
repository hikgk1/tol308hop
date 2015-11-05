// fillCollisionMatrix.js
//


"use strict";
//Assign each spot with 0 for passable, 1 for obsticle, 2 for grass

function fillCollisionMatrix(x){
	for (var i = 0; i <20; i++) {
		x._nonentities[i] = [];
	}
	
	//set all values of matrix as 0 first	
	for (var i = 0; i <20; i++) {
		for (var j = 0; j<55;j++) {
			x._nonentities[i][j] = 0;
			
		}
	}
	//PalletTown left wall
	for (var j = 0; j <20; j++) {
		x._nonentities[0][j] = 1;
	}
	//PalletTown right wall 
	for (var j = 0; j <20; j++) {
		x._nonentities[19][j] = 1;
	}
	//PalletTown bottom wall
	x._nonentities[1][1] = 1;
	x._nonentities[2][0] = 1;
	x._nonentities[3][0] = 1;
	for (var i = 8; i <20; i++) {
		x._nonentities[i][1] = 1;
	}
	//PalletTown water
	for (var i = 4; i < 8; i++) {
		for (var j = 1; j<5;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}	
	//PalletTown left house
	x._nonentities[11][13] = 1;
	for (var i = 12; i < 16; i++) {
		for (var j = 13; j<16;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	//PalletTown right house
	x._nonentities[3][13] = 1;
	for (var i = 4; i < 8; i++) {
		for (var j = 13; j<16;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	//PalletTown  Pokelab
	
	for (var i = 10; i < 16; i++) {
		for (var j = 7; j<11;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	//PalletTown  fences
	
	for (var i = 4; i < 8; i++) {
		
		x._nonentities[i][9] = 1;
	}	
	for (var i = 10; i < 16; i++) {
		
		x._nonentities[i][5] = 1;
	}	
	//PalletTown and Route 1 intersection walls
	for (var i = 1; i < 10; i++) {
		for (var j = 17; j<22;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	for (var i = 12; i < 20; i++) {
		for (var j = 17; j<22;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}

	//Route 1 left wall and right wall
	for (var i = 22; i < 53; i++) {
		x._nonentities[3][i] = 1;
		x._nonentities[18][i] = 1;
	}

	//Route 1 sign
	x._nonentities[9][26] = 1;

	//Route 1 walls
	for (var i = 4; i < 12; i++) {
		x._nonentities[i][30] = 1;
	}
	for (var i = 4; i < 6; i++) {
		x._nonentities[i][40] = 1;
	}
	for (var i = 10; i < 14; i++) {
		x._nonentities[i][40] = 1;
	}
	for (var i = 44; i < 50; i++) {
		x._nonentities[9][i] = 1;
	}
	for (var i = 4; i < 10; i++) {
		x._nonentities[i][52] = 1;
	}
	for (var i = 12; i < 18; i++) {
		x._nonentities[i][52] = 1;
	}

	//Route 1 grass fields
	for (var i = 10; i < 12; i++) {
		for (var j = 17; j < 22; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 4; i < 8; i++) {
		for (var j = 22; j < 24; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 6; i < 10; i++) {
		for (var j = 24; j < 26; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 12; i < 16; i++) {
		for (var j = 22; j < 24; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 14; i < 18; i++) {
		for (var j = 24; j < 26; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 12; i < 16; i++) {
		for (var j = 28; j < 32; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 14; i < 18; i++) {
		for (var j = 38; j < 42; j++) {
			x._nonentities[i][j] = 2;
		}
	}
	for (var i = 10; i < 18; i++) {
		for (var j = 44; j < 48; j++) {
			x._nonentities[i][j] = 2;
		}
	}
}
