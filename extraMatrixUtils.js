"use strict";
/* * * * * * * * * * * * * * * * * * * * *
 * Assignment 4
 * By Jason Steck
* * * * * * * * * * * * * * * * * * * * */

var MatrixStack = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var normalMatrix = mat4.create();

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

//-------
function pushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    MatrixStack.push(copy);
}

function popMatrix() {
    if (MatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = MatrixStack.pop();
}


//---- Matrix Generators ------

// Returns an Identity Matrix
function mnew(){
    var a = mat4.create(); 
    mat4.identity(a); 
    return new Matrix3D(a);
}

function Matrix3D(a) {
    this.val = a
}

var mat4i = mat4.create();
mat4.identity(mat4i);
var resmat = mat4.create();

Matrix3D.prototype.multBy = function(other){
    mat4.multiply(this.val, other.val, out);
    return new Matrix3D(out);
}
//-------------------------------------------------------
// Extending Matrices manipulation
Matrix3D.prototype.S = function(sx, sy, sz) {
    sy = sy || sx;
    sz = sz || sx;
    mat4.scale(mat4i, [sx, sy, sz], resmat);
    mat4.multiply(resmat, this.val, this.val);
    return this;
}
Matrix3D.prototype.T = function(dx, dy, dz) {
    mat4.translate(mat4i, [dx, dy, dz], resmat);
    mat4.multiply(resmat, this.val, this.val);
    return this;
}
var xAxis = [1,0,0];
var yAxis = [0,1,0];
var zAxis = [0,0,1];
Matrix3D.prototype.R = function(a, axes) { //axes = [0, 1, 0]
    axes = axes || [1,1,1];
    mat4.identity(resmat);
    mat4.rotate(resmat, degToRad(a), axes);
    mat4.multiply(resmat, this.val, this.val);
    return this;
}
Matrix3D.prototype.get = function(x, y, z){
    var res = [0,0,0,1];
    mat4.multiplyVec4(this.val, [x, y, z, 1], res)
    return {x: res[0], y: res[1], z: res[2]};
}

// Functions that modify the current model view (it's reversed!!)

// Adds a Scale Matrix
function S(sx, sy, sz){
    if (sx instanceof Array)
    {
        sz = sx[2];
        sy = sx[1];
        sx = sx[0];
    }
    sy = sy || sx;
    sz = sz || sx;
    mat4.scale(mvMatrix, [sx, sy, sz]);
}

// Adds a Transformation Matrix
function T(dx, dy, dz){
    if (dx instanceof Array)
    {
        dz = dx[2];
        dy = dx[1];
        dx = dx[0];
    }
    mat4.translate(mvMatrix, [dx, dy, dz]);
}

// Adds a Rotation Matrix (given degrees)
function R(a, axes){
    mat4.rotate(mvMatrix, degToRad(a), axes);
}

// Gets the translated values of x, y and z through the model view matrix
function get(x, y, z){
    var res = [0,0,0,1];
    mat4.multiplyVec4(mvMatrix, [x, y, z, 1], res)
    return {x: res[0], y: res[1], z: res[2]};
} 

// print the matrix to the console
function log(v) {
    var s = "";
    for (var i = 0; i < 4; i++) 
        s += v[i] + "," + v[i+4] + "," + v[i+8] + "," + v[i+12] + "\n";
    console.log(s);
}