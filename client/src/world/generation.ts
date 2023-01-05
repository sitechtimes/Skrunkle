import { World } from "./world";
import { MeshBuilder, StandardMaterial, Color3, Scene, Mesh } from "@babylonjs/core";

export class Generation {
  private _world: World
  private _scene: Scene
  
  constructor(world: World, scene: Scene) {
    this._world = world
    this._scene = scene
    
  }

  public GENERATE = {
    TestCyclinder: (): Mesh => {
      let item = MeshBuilder.CreateCylinder("item", { height: 5, diameter: 3 });
      item.position.x = 3;
      item.position.y = 1;
      item.position.z = 10;
      item.metadata = "item";
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      return item
    }, 
  }

  public RANDOMIZE(item: Mesh, count: number = 5, squareRange: number = 20) {
    item.position.x = (Math.random()*squareRange) - (squareRange/2)
    item.position.z = (Math.random()*squareRange) - (squareRange/2)
    for (let i = 1; i < count; i++) {
      let newItem = item.clone(`${item.name}-${count}`)
      newItem.position.x = (Math.random()*squareRange) - (squareRange/2)
      newItem.position.z = (Math.random()*squareRange) - (squareRange/2)
    }
  }
}