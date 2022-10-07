const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 5, segments: 32 },
    scene
  );
  var camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 25, 0),
    scene
  );
  var cylinder = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {
    diameter: 1,
    segments: 3,
  });

  var mirrorMaterial = new BABYLON.StandardMaterial("texture4", scene);

  mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture(
    "mirror",
    512,
    scene,
    true
  ); //Create a mirror texture

  mirrorMaterial.reflectionTexture.renderList = [cylinder, ground0];
  mirrorMaterial.reflectionTexture.level = 1; //Select the level (0.0 > 1.0) of the reflection
  sphere.material = mirrorMaterial;
  camera.attachControl(canvas, true);
  camera.keysUp = [87];
  camera.keysDown = [83];
  camera.keysLeft = [65];
  camera.keysRight = [68];
  camera.inertia = 0.2;
  camera.fov = 1.5;
  camera.minZ = 0;
  camera.angularSensibility = 500;
  camera.speed = 2.5;
  scene.gravity = new BABYLON.Vector3(0, -0.6, 0);
  scene.collisionsEnabled = true;
  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(0.25, 1.5, 0.25);
  camera._needMoveForGravity = true;
  camera.position.y = 1;
  camera.position.y = 3;
  sphere.position.y = 4;
  // var followBehavior = new BABYLON.FollowBehavior();
  // followBehavior.attach(cylinder);
  // followBehavior.maximumDistance = -1;
  // followBehavior.lerpTime = 0;
  // followBehavior.maxViewVerticalDegrees = 0;
  // followBehavior.maxViewHorizontalDegrees = 0;
  // followBehavior.ignoreCameraPitchAndRoll = true;
  // // Move the sphere upward 1/2 its height

  // Our built-in 'ground' shape.

  var ground0 = BABYLON.Mesh.CreateGround("ground0", 250, 250, 2, scene);
  ground0.checkCollisions = true;
  var light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 32: // Space
        if (wj == true) {
          grav = 0.7;
          wj = false;
          spood += 0.5;
        }
        break;

      case 16: // Shift
        speed = 5;
        break;
    }
  };

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 32: // Space
        break;

      case 16: // Shift
        speed = 2.5;
        break;

      case 82: // R
        care = true;
        break;
    }
  };

  canvas.addEventListener("keydown", onKeyDown, false);
  canvas.addEventListener("keyup", onKeyUp, false);

  scene.onDispose = function () {
    canvas.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("keyup", onKeyUp);
  };
  canvas.onclick = function () {
    canvas.requestPointerLock();
  };

  canvas.addEventListener("pointerlockchange", lockChangeLog, false);

  function lockChangeLog() {
    if (canvas.pointerLockElement === canvas) {
      control = true;
      divObj.innerHTML = "The pointer is locked. Press Esc to unlock.";
      canvas.addEventListener("mousemove", mousemoveCallback, false);
    } else {
      control = false;
      divObj.innerHTML = "The pointer is unlocked.";
      canvas.removeEventListener("mousemove", mousemoveCallback, false);
    }
  }
  var wj = true;
  var grav = -0.6;
  var speed = 2.5;
  var spood = 0;
  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 32: // Space
        if (wj == true) {
          grav = 0.7;
          wj = false;
          spood += 0.5;
        }
        break;

      case 16: // Shift
        speed = 5;
        break;
    }
  };

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 32: // Space
        break;

      case 16: // Shift
        speed = 2.5;
        break;

      case 82: // R
        care = true;
        break;
    }
  };

  canvas.addEventListener("keydown", onKeyDown, false);
  canvas.addEventListener("keyup", onKeyUp, false);

  scene.onDispose = function () {
    canvas.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("keyup", onKeyUp);
  };
  const update = function () {
    camera.speed = speed + spood;
    camera.onCollide = function (colMesh) {
      if (colMesh.uniqueId === ground0.uniqueId) {
        wj = true;
      }
    };
    scene.gravity.y = grav;
    if (grav > -0.4) {
      grav -= 0.05;
    }
  };

  scene.registerBeforeRender(function () {
    update();
  });
  cylinder.position = camera.position;
  camera.fov = 360;
  return scene;
};
const scene = createScene(); //Call the createScene function

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
window.addEventListener("resize", function () {
  engine.resize();
});
