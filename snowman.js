
function newSnowman(){
"use strict";

var base = part(function(){
	T(base.pos);
	S(5);
});
base.material = Materials.Copper;

var mid = part(function(){
	T(mid.pos);
	S(.75);
});
mid.material = Materials.Brass;
mid.pos = [0, 1.5, 0];
base.add(mid);

var top = part(function(){
	T(top.pos);
	S(.75);
});
top.material = Materials.Pewter;
top.pos = [0, 1.5, 0];
mid.add(top);

return base;
}