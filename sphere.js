"use strict";
/* * * * * * * * * * * * * * * * * * * * *
 * Assignment 4
 * By Jason Steck
* * * * * * * * * * * * * * * * * * * * */

// Wrap all the code into a single function so that we don't bleedover
var newUnitSphere = function(iterations){
	

var pointsArray = [];
var normalsArray = [];

var va = [0.0, 0.0, 1.0, 1.0];
var vb = [0.0, 0.942809, -0.333333, 1.0];
var vc = [-0.816497, -0.471405, -0.333333, 1.0];
var vd = [0.816497, -0.471405, -0.333333, 1.0];

// Finds the midpoint and normalizes the resulting vector
function midpointNormalized( a, b )
{
    var v = [];
    // Get the sum of the points
    for(var i=0; i < 3; i++)
        v.push(a[i]+b[i]);

    // find the normalizing scalar
    var len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);

    // Apply the scaler
    for ( var i = 0; i < v.length; ++i ) {
        v[i] /= len;
    }

    v.push(1.0); // the fourth 
    return v;
}

// Adds the given points to the object
function triangle(a, b, c) 
{
    pointsArray = pointsArray.concat(a).concat(b).concat(c);

    normalsArray.push(a[0], a[1], a[2], 0.0);
    normalsArray.push(b[0], b[1], b[2], 0.0);
    normalsArray.push(c[0], c[1], c[2], 0.0);
}

// Recursive function to refine the triangles
function divideTriangle(a, b, c, ileft) {
    if ( ileft > 0 ) {

        // Find the midpoints of the three sides
        var ab = midpointNormalized(a, b);
        var ac = midpointNormalized(a, c);
        var bc = midpointNormalized(b, c);

        // Create the 4 new triangles (and their triangles)
        divideTriangle(a, ab, ac, ileft - 1 );
        divideTriangle(ab, b, bc, ileft - 1 );
        divideTriangle(bc, c, ac, ileft - 1 );
        divideTriangle(ab, bc, ac, ileft - 1 );
    }
    else {
        triangle( a, b, c );
    }
}

// Use the default points from the unit tetrahedron
divideTriangle(va, vb, vc, iterations);
divideTriangle(vd, vc, vb, iterations);
divideTriangle(va, vd, vb, iterations);
divideTriangle(va, vc, vd, iterations);

return {vertices: pointsArray, normals: normalsArray};
}