/**
 * Created by cizekm on 21.4.2016.
 */
var showAxis = function(size,scene) {
    var makeTextPlane = function(text, color, size, scene) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = new BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
        return plane;
    };

    var axisX = BABYLON.Mesh.CreateLines("axisX", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10, scene);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
    ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10, scene);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
    ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10, scene);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

function addWSADtoCamera(camera) {
    camera.keysUp.push(87);
    camera.keysDown.push(83);
    camera.keysLeft.push(65);
    camera.keysRight.push(68);
    camera.keysUpz = [81];
    camera.keysDownz = [69];

    window.addEventListener("keydown", function(event) {
        var keyCode = event.keyCode;
        if (camera.keysUpz.indexOf(keyCode) > -1)
        {
            // console.log("Going up");
            // camera.position.y += 0.05;
            camera.cameraDirection.addInPlace(new BABYLON.Vector3(0, 0.25, 0));
        }
        else if (camera.keysDownz.indexOf(keyCode) > -1) {
            // console.log("Going down");
            // camera.position.y -= 0.05;
            camera.cameraDirection.addInPlace(new BABYLON.Vector3(0, -0.25, 0));
        }
    });
}


var createSceneKostky = function() {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3( .5, .5, .5);

    // camera
    var camera = new BABYLON.ArcRotateCamera("camera1",  0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, -20));
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var pl = new BABYLON.PointLight("pl", BABYLON.Vector3.Zero(), scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.specular = new BABYLON.Color3(1, 1, 1);
    pl.intensity = 0.8;

    var mat = new BABYLON.StandardMaterial("mat1", scene);
    mat.alpha = 1.0;
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
    //mat.backFaceCulling = false;
    //mat.wireframe = true;
    var texture = new BABYLON.Texture("http://jerome.bousquie.fr/BJS/images/spriteAtlas.png", scene);
    mat.diffuseTexture = texture;
    //mat.diffuseTexture.hasAlpha = true;

    var hSpriteNb =  6;  // 6 sprites per raw
    var vSpriteNb =  4;  // 4 sprite raws

    var faceUV = new Array(6);

    for (var i = 0; i < 6; i++) {
        faceUV[i] = new BABYLON.Vector4(i/hSpriteNb, 0, (i+1)/hSpriteNb, 1 / vSpriteNb);
    }


    var options = {
        size: 5,
        faceUV: faceUV
    };

    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene);
    //box.material = mat;

    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2.3*Math.sqrt(2.5*2.5 +2.5*2.5) }, scene);

    var boxCSG = BABYLON.CSG.FromMesh(box);
    var sphereCSG = BABYLON.CSG.FromMesh(sphere);
    var diceCSG = boxCSG.intersect(sphereCSG);
    var dice = diceCSG.toMesh("dice", mat, scene);

    var dice2 = dice.clone();
    dice2.position.x = 6;

    box.dispose();
    sphere.dispose();

    scene.registerBeforeRender(function() {
        pl.position = camera.position;
    });

    return scene;
};