"use strict";
/* * * * * * * * * * * * * * * * * * * * *
 * Assignment 4
 * By Jason Steck
* * * * * * * * * * * * * * * * * * * * */

// code skeleton borrowed from http://learningwebgl.com/blog/?p=239 rather than using the class's skeleton
var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var program;
function useShader(name)
{
    var vertexShader = getShader(gl, name + "-vs");
    var fragmentShader = getShader(gl, name + "-fs");

    var temp = gl.createProgram();
    gl.attachShader(temp, vertexShader);
    gl.attachShader(temp, fragmentShader);
    gl.linkProgram(temp);

    if (!gl.getProgramParameter(temp, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(temp);

    /* Get attribute variables */
    // Setup vPosition attribute
    temp.vertexPositionAttribute = gl.getAttribLocation(temp, "vPosition");
    gl.enableVertexAttribArray(temp.vertexPositionAttribute);

    // Setup vNormal attribute
    temp.vNormal = gl.getAttribLocation(temp, "vNormal");
    gl.enableVertexAttribArray(temp.vNormal);

    // Setup attribute vColor attribute
    //temp.vertexColorAttribute = gl.getAttribLocation(temp, "vColor");
    //gl.enableVertexAttribArray(temp.vertexColorAttribute);

    /* Grab Uniform variables */
    temp.modelViewMatrix = gl.getUniformLocation(temp, "modelViewMatrix");
    temp.projectionMatrix = gl.getUniformLocation(temp, "projectionMatrix");
    temp.normalMatrix = gl.getUniformLocation(temp, "normalMatrix");

    program = temp;
}

function initShaders() {
    //*
    useShader("phong"); /*/
    useShader("gouraud"); //*/
}
