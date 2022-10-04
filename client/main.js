const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  const camera = new BABYLON.UniversalCamera(
    "camera",
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.attachControl(canvas, true);
  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 2, segments: 32 },
    scene
  );
  camera.parent = sphere;
  // Move the sphere upward 1/2 its height
  sphere.position.y = 1;
  // Our built-in 'ground' shape.
  const ground = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 6, height: 6 },
    scene
  );
  return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
  var dsm = initializeInput(scene, camera);
});
var initializeInput = function (scene, camera) {
  let dsm = new BABYLON.DeviceSourceManager(scene.getEngine());
  dsm.onDeviceConnectedObservable.add((device) => {
    // KEYBOARD CONFIG
    if (device.deviceType === BABYLON.DeviceType.Keyboard) {
      scene.onBeforeRenderObservable.add(() => {
        let transformMatrix = BABYLON.Matrix.Zero();
        let localDirection = BABYLON.Vector3.Zero();
        let transformedDirection = BABYLON.Vector3.Zero();
        let isMoving = false;

        // WASD will move and strafe
        if (device.getInput(37) === 1) {
          localDirection.x = -0.1;
          isMoving = true;
        }
        if (device.getInput(39) === 1) {
          localDirection.x = 0.1;
          isMoving = true;
        }

        if (device.getInput(38) === 1) {
          localDirection.z = 0.1;
          isMoving = true;
        }
        if (device.getInput(40) === 1) {
          localDirection.z = -0.1;
          isMoving = true;
        }
        if (isMoving) {
          camera.getViewMatrix().invertToRef(transformMatrix);
          BABYLON.Vector3.TransformNormalToRef(
            localDirection,
            transformMatrix,
            transformedDirection
          );
          camera.position.addInPlace(transformedDirection);
        }
      });
    }
  });

  return dsm;
};
