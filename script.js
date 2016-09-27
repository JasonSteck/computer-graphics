"use strict";
/* * * * * * * * * * * * * * * * * * * * *
 * Jason Steck
* * * * * * * * * * * * * * * * * * * * */

var unitSpheres = [];
var unitNormals = [];
var iterations = 5;
var debug;

// Contains all objects in world
var scene = [];

// Represents an object composed of triangles.
function newTriPoly(vertices, normals, material)
{
    var pub = {};
    pub.children = [];
    pub.VertexPositionBuffer = {};
    pub.VertexNormalBuffer = {};
    //pub.VertexColorBuffer = {};
    pub.texture = null;
    pub.hasTexture = 0.0;
    pub.material = material || Materials.Silver;

    function setBuffer(buffer, arr, itemSize)
    {
        buffer.buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buf);

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
        buffer.buf.itemSize = itemSize;
        buffer.buf.numItems = arr.length/itemSize;
    }

    // Will need to be called before this object will render
    pub.initBuffer = function()
    {
        setBuffer(pub.VertexPositionBuffer, vertices, 4);
        setBuffer(pub.VertexNormalBuffer, normals, 4);
        //setBuffer(pub.VertexColorBuffer, colors, 4);

        for(var i=0;i<pub.children.length;i++)
            pub.children[i].initBuffer();
    }

    // To be replaced by user
    pub.animate = function(elapsed){};

    // To be replaced by user
    pub.scale = [1.0, 1.0, 1.0];

    // To be replaced by user
    pub.applyMatrices = function(){};

    // Gives the object an image
    pub.setTexture = function( image ) {
        pub.texture = gl.createTexture();
        gl.bindTexture( gl.TEXTURE_2D, pub.texture );
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
             gl.RGB, gl.UNSIGNED_BYTE, image );
        gl.generateMipmap( gl.TEXTURE_2D );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                          gl.NEAREST_MIPMAP_LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        pub.hasTexture = 1.0;
    }

    // Simply appends the given tripoly object to the children's list
    pub.add = function(child)
    {
        pub.children.push(child);
    }

    /* This section allows for scaling an object 
     * without affecting it's children */
    var invScale;
    function doScale(){
        S(pub.scale);
        pub.invScale = [1/pub.scale[0], 1/pub.scale[1], 1/pub.scale[2]];
    };
    function undoScale()
    {
        S(pub.invScale);
    }

    // The main draw loop
    pub.draw = function()
    {
        // Save our progress
        pushMatrix();

        // Apply the necessary transformations for the current object
        pub.applyMatrices();

        // Do unique scaling for this object
        doScale();

        /* Pass values to the gl */

        // Vertex Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexPositionBuffer.buf);
        gl.vertexAttribPointer(program.vertexPositionAttribute, this.VertexPositionBuffer.buf.itemSize, gl.FLOAT, false, 0, 0);

        // Vertex Normals
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexNormalBuffer.buf);
        gl.vertexAttribPointer(program.vNormal, this.VertexNormalBuffer.buf.itemSize, gl.FLOAT, false, 0, 0);

        // Vertex Color
        gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), pub.material.am);
        gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), pub.material.dif);
        gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), pub.material.spec);
        gl.uniform1f(gl.getUniformLocation(program, "shininess"), pub.material.shin);
        gl.uniform1f(gl.getUniformLocation(program, "emissive"), (pub.material.emissive || 0.0));
        
        gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), light.pos);
        gl.uniform1f(gl.getUniformLocation(program, "intensity"), light.intensity);
        gl.uniform4fv(gl.getUniformLocation(program, "eyePosition"), camera.eye.concat(1));

        gl.uniform1f(gl.getUniformLocation(program, "hasTexture"), pub.hasTexture);
        gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

        // Don't inverse the normal matrix
        normalMatrix = [mvMatrix[0], mvMatrix[1], mvMatrix[2], 
                        mvMatrix[4], mvMatrix[5], mvMatrix[6], 
                        mvMatrix[8], mvMatrix[9], mvMatrix[10]];

        // Perspective and ModelView Matricies
        gl.uniformMatrix4fv(program.modelViewMatrix, false, mvMatrix);
        gl.uniformMatrix4fv(program.projectionMatrix, false, pMatrix);
        gl.uniformMatrix3fv(program.normalMatrix, false, normalMatrix);

        // Draw!
        gl.drawArrays(gl.TRIANGLES, 0, this.VertexPositionBuffer.buf.numItems);

        // undo the unique scaling
        undoScale();

        // Now draw children
        for(var i=0;i<pub.children.length;i++)
            pub.children[i].draw();

        // Restore order!
        popMatrix();
    }

    return pub;
}

// Shortcut to create a new object
function part(applyMaticesFunc, iterations)
{
    iterations = iterations || 4;
    var part = newTriPoly(unitSpheres[iterations], unitNormals[iterations]);
    part.applyMatrices = applyMaticesFunc;
    return part;
}

var light;
var floor;
var snowman;
var box;
var ball;
// Sets up the scene with all objects we're going to see
function initScene(){
    /* Create the light */
    light = part(function(){
        T(light.pos);
        S(.3);
    });
    light.material = Materials.Light;
    light.pos = [0, 0, 0, 1];
    light.follow = false;
    scene.push(light);

    /* Create floor */
    floor = newTileFloor();
    scene.push(floor);

    /* Add snowman */
    snowman = newSnowman();
    snowman.pos = [10, 5, -1];
    scene.push(snowman);

    /* Add Box */
    box = newBox();
    box.applyMatrices = function(){
        T(box.pos);
        S(5);
    }
    box.pos = [-12, 5, -1];
    scene.push(box);

    /* Add big ball */
    ball = part(function(){
        T(ball.pos);
        S(6);
    });
    ball.pos = [0, 10, -10];
    ball.material = Materials.Chrome;
    scene.push(ball);
}

function initBuffers(){
    for(var i=0;i<scene.length;i++)
        scene[i].initBuffer();
}

// Camera settings
var camera = {
    eye: [0, 0, 10],
    at: [0, 0, 0]
}

function drawScene(){
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //eye, at ,up
    var res = mat4.lookAt(camera.eye, camera.at, [0.0, 1.0, 0.0]);

    mat4.perspective(80, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0, pMatrix);
    mat4.multiply(pMatrix, res);


    mat4.identity(mvMatrix);

    //mat4.translate(mvMatrix, [0.0, 0.0, -30.0]);

    for(var i=0;i<scene.length;i++)
    {
        scene[i].draw();
    }
}

function subArrays(a1, a2)
{
    var a3 = [];
    for(var i=0;i<a2.length;i++)
        a3.push(a1[i] - a2[i]);
    return a3;
}
function addArrays(a1, a2)
{
    for(var i=0;i<a1.length;i++)
        a2[i] += a1[i];
}

var lastTime = 0;
var lastEye = camera.eye.slice(0);
// Do calculations
function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = (timeNow - lastTime)/1000.0;

        for(var i=0; i<scene.length; i++)
            scene[i].animate(elapsed);

        // Check if we need to update the light location
        if(light.follow)
        {
            // Determine difference in camera location
            var diff = subArrays(camera.eye, lastEye);

            // Apply difference to light location
            addArrays(diff, light.pos);

            // Update the last
            lastEye = camera.eye.slice(0);
        }
    }
    lastTime = timeNow;
}


function render() {
    requestAnimFrame(render);
    drawScene();
    animate();
}

var sliderEventType = new Event('input');

function sliderHooks(id, fun)
{
    var i = document.getElementById(id),
        o = document.getElementById(id+"val");

    o.innerHTML = i.value;

    i.addEventListener('input', function () {
      var val = parseFloat(i.value)/1000;
      o.innerHTML = val;
      fun(val);
    }, false); 

    trig(i);
}

function trig(i)
{
    // Trigger the event for initial settings
    i.dispatchEvent(sliderEventType);
}

function set(id, value)
{
    var a = document.getElementById(id); 
    a.value=value;
    trig(a);
}

function resetPos()
{
    var sliders = document.getElementsByClassName('slider');
    for(var i=0;i<sliders.length;i++)
    {
        //sliders[i].setAttribute("value", sliders[i].getAttribute("def"));
        sliders[i].value = sliders[i].getAttribute("def");
        trig(sliders[i]);
    }

    light.follow = false;
}

window.onload = function init() {

    for(var i=0; i<iterations+1; i++)
    {
        var sp = newUnitSphere(i);
        unitSpheres.push(sp.vertices);
        unitNormals.push(sp.normals);
    }

    var canvas = document.getElementById("gl-canvas");
    initGL(canvas);
    initShaders();
    initScene();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // = = = = Setup controlls = = = =
    // Setup shortcut key to reset the dog's position
    document.addEventListener("keydown", keyDownTextField, false);
    function keyDownTextField(e) {
        if(e.keyCode==82)
            resetPos();
    }


    // -- Light values --
    sliderHooks('lightint', function(val){
        light.intensity = val;
        var min = .2;
        light.material.am = [val + min, val + min, val + min, 1.0];
    });
    sliderHooks('lightx', function(val){
        light.pos[0] = val;
    });
    sliderHooks('lighty', function(val){
        light.pos[1] = val;
    });
    sliderHooks('lightz', function(val){
        light.pos[2] = val;
    });

    // -- Camera Eye values --
    sliderHooks('camx', function(val){
        camera.eye[0] = val;
    });
    sliderHooks('camy', function(val){
        camera.eye[1] = val;
    });
    sliderHooks('camz', function(val){
        camera.eye[2] = val;
    });

    // -- Camera Look at values --
    sliderHooks('lookx', function(val){
        camera.at[0] = val;
    });
    sliderHooks('looky', function(val){
        camera.at[1] = val;
    });
    sliderHooks('lookz', function(val){
        camera.at[2] = val;
    });


    resetPos();

    render();
}
