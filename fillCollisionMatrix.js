// fillCollisionMatrix.js
//


"use strict";
//Assign each spot with 0 for passable, 1 for obsticle, 2 for grass

function fillCollisionMatrix(x){
	for (var i = -10; i <50; i++) {
		x._nonentities[i] = [];
	}
	
	//set all values of matrix as 0 first	
	for (var i = 0; i <50; i++) {
		for (var j = 0; j<90;j++) {
			x._nonentities[i][j] = 0;
			
		}
	}
	fillPalletTown(x);
	fillRoute1(x);
	fillViridanCity(x);
	

}
function insidePokeLab(x){
	
	
	for (var j = 7; j<17;j++) {
		x._nonentities[37][j] = 1;
	}
	for (var j = 7; j<18;j++) {
		x._nonentities[48][j] = 1;
	}
	for (var i = 38; i < 48; i++) {
		for (var j = 17; j<19;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	x._nonentities[43][17] = 0;
	x._nonentities[42][17] = 0;
	
	
	for (var i = 38; i<48;i++) {
		x._nonentities[i][6] = 1;
	}
	x._nonentities[43][6] = 0;
	x._nonentities[42][6] = 0;
	
	for (var i = 38; i < 42; i++) {
		for (var j = 11; j<13;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	
	for (var i = 44; i < 48; i++) {
		for (var j = 11; j<13;j++) {
			x._nonentities[i][j] = 1;
			
		}
	}
	
	for (var i = 44; i<47;i++) {
		x._nonentities[i][15] = 1;
	}
}

function fillPalletTown(x) {
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
	x._nonentities[12][7] = 0;
	insidePokeLab(x);
	
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
}

function fillRoute1(x) {
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

	//Route 1 jump ledges
	for (var i = 4; i < 6; i++) {
		x._nonentities[i][26] = 3;
	}
	for (var i = 10; i < 18; i++) {
		x._nonentities[i][26] = 3;
	}
	for (var i = 16; i < 18; i++) {
		x._nonentities[i][30] = 3;
	}
	x._nonentities[4][34] = 3;
	for (var i = 6; i < 9; i++) {
		x._nonentities[i][34] = 3;
	}
	for (var i = 10; i < 18; i++) {
		x._nonentities[i][34] = 3;
	}
	for (var i = 4; i < 6; i++) {
		x._nonentities[i][26] = 3;
	}
	for (var i = 6; i < 10; i++) {
		x._nonentities[i][40] = 3;
	}
	for (var i = 4; i < 9; i++) {
		x._nonentities[i][44] = 3;
	}
	for (var i = 4; i < 9; i++) {
		x._nonentities[i][48] = 3;
	}
	for (var i = 10; i < 14; i++) {
		x._nonentities[i][48] = 3;
	}
	
}

function fillViridanCity(x) {
		//Viridan and Route 1 intersection walls
	for (var j = 53; j < 58; j++) {
		x._nonentities[9][j] = 1;
		x._nonentities[12][j] = 1;
	}
	//Bottom Viridan walls
	for (var i = -7; i < 26; i++) {
		x._nonentities[i][57] = 1;
	}
	x._nonentities[10][57] = 0;
	x._nonentities[11][57] = 0;
	//Viridan water
	for (var i = -2; i < 4; i++) {
		for (var j = 61; j < 65; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	//Viridan left outer wall
	for (var j = 58; j < 75; j++) {
		x._nonentities[-7][j] = 1;
	}
	x._nonentities[-6][75] = 1;
	for (var j = 75; j < 86; j++) {
		x._nonentities[-5][j] = 1;
	}
	for (var i = -4; i < 6; i++) {
		x._nonentities[i][85] = 1;
	}
	for (var j = 85; j < 89; j++) {
		x._nonentities[6][j] = 1;
	}
	
	//Viridan left tree island
	for (var j = 73; j < 83; j++) {
		x._nonentities[-3][j] = 1;
		x._nonentities[6][j] = 1;
	}
	for (var i = -2; i < 6; i++) {
		x._nonentities[i][72] = 1;
		x._nonentities[i][83] = 1;
	}
	//Viridan trees near water
	for (var i = -6; i < -2; i++) {
		x._nonentities[i][67] = 1;
	}
	x._nonentities[-2][66] = 1;
	x._nonentities[-2][65] = 1;
	x._nonentities[-1][65] = 1;
	//Viridan south ledges
	for (var i = -6; i < -2; i++) {
		x._nonentities[i][61] = 3;
	}
	for (var i = 4; i < 26; i++) {
		x._nonentities[i][61] = 3;
	}
	x._nonentities[9][61] = 0;
	x._nonentities[5][61] = 0;
	//Viridan houses
	for (var i = 12; i < 16; i++) {
		for (var j = 63; j < 67; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	for (var i = 18; i < 22; i++) {
		for (var j = 69; j < 73; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	for (var i = 10; i < 14; i++) {
		for (var j = 73; j < 75; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	for (var i = 10; i < 14; i++) {
		for (var j = 79; j < 81; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	x._nonentities[10][81] = 1;
	x._nonentities[10][82] = 1;
	for (var i = 18; i < 24; i++) {
		for (var j = 81; j < 85; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	//Right outer most wall
	for (var j = 57; j < 88; j++) {
		x._nonentities[26][j] = 1;
	}
	for (var i = 10; i < 27; i++) {
		x._nonentities[i][87] = 1;
	}
	for (var i = 10; i < 14; i++) {
		for (var j = 85; j < 87; j++) {
			x._nonentities[i][j] = 1;
		}
	}
	//Fences near the Mart
	for (var i = 10; i < 27; i++) {
		x._nonentities[i][75] = 1;
	}
	for (var i = 10; i < 14; i++) {
		x._nonentities[i][71] = 1;
	}
	//Viridan gym ledge
	for (var i = 14; i < 26; i++) {
		x._nonentities[i][79] = 3;
	}
	
	//Viridan signs
	x._nonentities[11][59] = 1;
	x._nonentities[7][71] = 1;
	x._nonentities[17][81] = 1;
	x._nonentities[9][87] = 1;
}
