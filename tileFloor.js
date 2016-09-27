// x, y, z is top left
function getSquare(x, y, z, size)
{
	var s = size;
	return [
		x, y, z+s, 1,
		x+s, y, z, 1,
		x, y, z, 1,

		x+s, y, z, 1,
		x, y, z+s, 1,
		x+s, y, z+s, 1
	];
}


function newTileFloor(radius, tilesPerSide){
"use strict";

radius = radius || 75;
tilesPerSide = tilesPerSide || 10;

var _normPart = [0, 5, 0, 0];
var floor;

/* Create floor */
floor = newTriPoly([], []);
var isBlack = false;

var bar = []; // black tile points array
var war = []; // white tile points array
var min = -radius;
var max = radius;
var size = 2*radius/tilesPerSide;
var startRowBlack=isBlack;
// Build tiles
for(var z=min; z<max; z+=size)
{
	for(var x=min; x<max; x+=size)
	{
		if(isBlack)
			bar = bar.concat(getSquare(x, 0, z, size));
		else
			war = war.concat(getSquare(x, 0, z, size));
		isBlack = !isBlack;
	}
	startRowBlack = !startRowBlack;
	isBlack = startRowBlack;
}

// build normals
var bnorm = [];
for (var i = 0; i < bar.length/4; i++) 
	bnorm = bnorm.concat(_normPart);

var wnorm = [];
for (var i = 0; i < war.length/4; i++) 
	wnorm = wnorm.concat(_normPart);



var blackTiles = newTriPoly(bar, bnorm, Materials.Black_Plastic);
floor.add(blackTiles);

var whiteTiles = newTriPoly(war, wnorm, Materials.Chrome);
floor.add(whiteTiles);

return floor;
}


function newBox()
{
	var bar = [
			//TOP
			-1, 1, 1, 1, //P4
			1, 1, -1, 1, //P2
			-1, 1, -1, 1, //P1
			1, 1, -1, 1, //P2
			-1, 1, 1, 1, //P4
			1, 1, 1, 1, //P3
			//RIGHT
			1, -1, 1, 1, //P7
			1, 1, -1, 1, //P2
			1, 1, 1, 1, //P3
			1, 1, -1, 1, //P2
			1, -1, 1, 1, //P7
			1, -1, -1, 1, //P6
			//BACK
			-1, -1, -1, 1, //P5
			1, 1, -1, 1, //P2
			1, -1, -1, 1, //P6
			1, 1, -1, 1, //P2
			-1, -1, -1, 1, //P5
			-1, 1, -1, 1, //P1
			//LEFT
			-1, -1, -1, 1, //P5
			-1, 1, 1, 1, //P4
			-1, 1, -1, 1, //P1
			-1, 1, 1, 1, //P4
			-1, -1, -1, 1, //P5
			-1, -1, 1, 1, //P8
			//FRONT
			-1, -1, 1, 1, //P8
			1, 1, 1, 1, //P3
			-1, 1, 1, 1, //P4
			1, 1, 1, 1, //P3
			-1, -1, 1, 1, //P8
			1, -1, 1, 1, //P7
			//BOTTOM
			-1, -1, -1, 1, //P5
			1, -1, 1, 1, //P7
			-1, -1, 1, 1, //P8
			1, -1, 1, 1, //P7
			-1, -1, -1, 1, //P5
			1, -1, -1, 1 //P6
		];
	var n = 1;
	var norms = [
		//TOP
		0, n, 0, 0, //P4
		0, n, 0, 0, //P2
		0, n, 0, 0, //P1
		0, n, 0, 0, //P2
		0, n, 0, 0, //P4
		0, n, 0, 0, //P3
		//RIGHT
		n, 0, 0, 0, //P7
		n, 0, 0, 0, //P2
		n, 0, 0, 0, //P3
		n, 0, 0, 0, //P2
		n, 0, 0, 0, //P7
		n, 0, 0, 0, //P6
		//BACK
		0, 0, -n, 0, //P5
		0, 0, -n, 0, //P2
		0, 0, -n, 0, //P6
		0, 0, -n, 0, //P2
		0, 0, -n, 0, //P5
		0, 0, -n, 0, //P1
		//LEFT
		-n, 0, 0, 0, //P5
		-n, 0, 0, 0, //P4
		-n, 0, 0, 0, //P1
		-n, 0, 0, 0, //P4
		-n, 0, 0, 0, //P5
		-n, 0, 0, 0, //P8
		//FRONT
		0, 0, n, 0, //P8
		0, 0, n, 0, //P3
		0, 0, n, 0, //P4
		0, 0, n, 0, //P3
		0, 0, n, 0, //P8
		0, 0, n, 0, //P7
		//BOTTOM
		0, -n, 0, 0, //P5
		0, -n, 0, 0, //P7
		0, -n, 0, 0, //P8
		0, -n, 0, 0, //P7
		0, -n, 0, 0, //P5
		0, -n, 0, 0 //P6
	];

	return newTriPoly(bar, norms, Materials.Brass);
}