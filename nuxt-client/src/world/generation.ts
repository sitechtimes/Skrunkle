import { World } from "./world";
import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  Scene,
  Mesh,
} from "@babylonjs/core";

export class Generation {
  private _world: World;
  private _scene: Scene;

  constructor(world: World, scene: Scene) {
    this._world = world;
    this._scene = scene;
    console.log(this._world);
  }

  public GENERATE = {
    Cylinder: (mesh: any): Mesh => {
      let item = MeshBuilder.CreateCylinder(mesh.name, {
        height: 5,
        diameter: 3,
      });
      item.position = mesh.position;
      item.metadata = mesh.metadata;
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      return item;
    },
    Box: (mesh: any): Mesh => {
      var material = new StandardMaterial("box color", this._scene);
      material.alpha = 1;
      material.diffuseColor = new Color3(1.0, 0.2, 0.7);
      let box = MeshBuilder.CreateBox(
        mesh.name,
        { size: 3, width: 3, height: 3 },
        this._scene
      );
      box.position = mesh.position;
      box.metadata = mesh.metadata;
      box.material = material;

      return box;
    },
    ENTITY: (mesh: any): Mesh => {
      // spawn dropped entity
      
      return
    }
  };

  public RANDOMIZE(item: Mesh, count: number = 5, squareRange: number = 20) {
    item.position.x = Math.random() * squareRange - squareRange / 2;
    item.position.z = Math.random() * squareRange - squareRange / 2;
    for (let i = 1; i < count; i++) {
      let newItem = item.clone(`${item.name}-${count}`);
      newItem.position.x = Math.random() * squareRange - squareRange / 2;
      newItem.position.z = Math.random() * squareRange - squareRange / 2;
    }
  }
}
