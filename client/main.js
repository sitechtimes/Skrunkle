const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const box = new BABYLON.MeshBuilder.CreateBox("box", {
    width: 5,
    length: 5,
    depth: 5,
  });
  const box2 = new BABYLON.MeshBuilder.CreateBox("box2", {
    width: 5,
    length: 5,
    depth: 5,
  });
  const box3 = new BABYLON.MeshBuilder.CreateBox("box2", {
    width: 5,
    length: 5,
    depth: 5,
  });
  var camera = new BABYLON.FreeCamera(
    "camera",
    new BABYLON.Vector3(0, 25, 0),
    scene
  );
  var cylinder = new BABYLON.MeshBuilder.CreateCylinder("cylinder", {
    diameter: 1,
    segments: 3,
  });
  scene.ambientColor = new BABYLON.Color3(96, 67, 95);
  var contrastMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
  contrastMaterial.diffuseColor = new BABYLON.Color3(128, 0, 0);
  contrastMaterial.specularColor = new BABYLON.Color3(128, 0, 0);
  contrastMaterial.emissiveColor = new BABYLON.Color3(128, 0, 0);
  contrastMaterial.ambientColor = new BABYLON.Color3(128, 0, 0);
  box.material = contrastMaterial;
  box2.material = contrastMaterial;
  box3.material = contrastMaterial;
  camera.attachControl(canvas, true);
  camera.keysUp = [87];
  camera.keysDown = [83];
  camera.keysLeft = [65];
  camera.keysRight = [68];
  camera.inertia = 0.2;
  camera.fov = 1.5;
  camera.minZ = 0;
  camera.angularSensibility = 500;
  camera.speed = 2;
  scene.gravity = new BABYLON.Vector3(0, -0.6, 0);
  scene.collisionsEnabled = true;
  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.ellipsoid = new BABYLON.Vector3(0.25, 1.5, 0.25);
  camera._needMoveForGravity = true;
  camera.position.y = 3;
  camera.position.x = 3;
  box.position.y = 2;
  box.collisionsEnabled = true;
  box.checkCollisions = true;
  box2.position.y = 4;
  box2.position.z = 8;
  box2.collisionsEnabled = true;
  box2.checkCollisions = true;
  box3.position.y = 10;
  box3.position.z = 8;
  box3.collisionsEnabled = true;
  box3.checkCollisions = true;
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
  var grav = -0.6;
  var speed = 2.5;
  var spood = 0;
  var onKeyDown = function (event) {
    switch (event.keyCode) {
      case 32: // Space
        if (wj == true) {
          grav = 0.7;
          wj = false;
          camera.speed = 0;
        }
        break;

      case 16: // Shift
        speed = 5;
        break;
    }
  };

  var onKeyUp = function (event) {
    switch (event.keyCode) {
      case 32:
        camera.keysUp = [87];
        camera.keysDown = [83];
        camera.keysLeft = [65];
        camera.keysRight = [68]; // Space
        break;

      case 16: // Shift
        speed = 2.5;
        break;
    }
  };

  canvas.addEventListener("keydown", onKeyDown, false);
  canvas.addEventListener("keyup", onKeyUp, false);

  scene.onDispose = function () {
    canvas.removeEventListener("keydown", onKeyDown);
    canvas.removeEventListener("keyup", onKeyUp);
  };
  const colMeshes = [ground0, box, box2, box3];
  const update = function () {
    camera.speed = speed + spood;
    camera.onCollide = function (colMesh) {
      colMeshes.forEach((i) => {
        if (colMesh.uniqueId === i.uniqueId) {
          wj = true;
        }
      });
    };
    scene.gravity.y = grav;
    if (grav > -0.4) {
      grav -= 0.05;
    }
    cylinder.position = camera.position;
    camera.fov = 90;
  };
  scene.registerBeforeRender(function () {
    update();
  });

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
