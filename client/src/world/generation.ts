import { World } from "./world";
import {
  Scene,
  Mesh,
  SceneLoader,
  TransformNode
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
    TestCyclinder: async (): Promise<Mesh> => {
      let item: any = SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "treeModel2.glb",
        this._scene
      );
      var CoT = new TransformNode("root");
      item.parent = CoT;
      CoT.position.x += 13;
      CoT.position.y += 1;
      CoT.position.z += 10;
      CoT.metadata = "item";
      return item;
    },
    TestCyclinder2: async (): Promise<Mesh> => {
      let item2: any = SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "treemesh.glb",
        this._scene
      );
      var CoT = new TransformNode("root");
      item2.parent = CoT;
      CoT.position.x += 15;
      CoT.position.y += 1;
      CoT.position.z += 0;
      CoT.metadata = "item";
      return item2;
    },
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
