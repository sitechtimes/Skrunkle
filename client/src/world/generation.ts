import { World } from "./world";
import {
  Scene,
  Mesh,
  SceneLoader
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
      item.position.x = 3;
      item.position.y = 1;
      item.position.z = 10;
      item.metadata = "item";
      return item;
    },
    TestCyclinder2: async (): Promise<Mesh> => {
      let item2: any = SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "treemesh.glb",
        this._scene
      );
      item2.position.x = 15;
      item2.position.y = 1;
      item2.position.z = 0;
      item2.metadata = "item";
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
