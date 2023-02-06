import { World } from "./world";
import {
  Scene,
  Mesh,
  SceneLoader,
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
    TestCyclinder: async (): Promise<any> => {
      let item: any = await SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "treeModel2.glb",
        this._scene); 
        for (let mesh of item.meshes){
          mesh.position.x = 10;}
    },
    TestCyclinder2: async (): Promise<any> => {
      let item2: any = await SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "treemesh.glb",
        this._scene);
      for (let mesh of item2.meshes){
        mesh.position.x = 50;
      }
      // const oldRoot = item2;
      // const newRoot = TransformNode.prototype.clone.call(item2.meshes[0], "newRoot", null, true);
      // for (const child of oldRoot.getChildren()) {
      //     child.parent = newRoot;
      // }
      // oldRoot.dispose();
      // newRoot!.position.x = 10;
      // newRoot!.position.y = 1;
      // newRoot!.position.z = 10;

      // return newRoot;
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
