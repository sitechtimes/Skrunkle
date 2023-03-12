import { MeshBuilder, StandardMaterial, Color3, Scene, Mesh, PhysicsImpostor, Vector2, Vector3, SceneLoader, VertexBuffer } from "babylonjs"
import { World } from "./world"
import { state_machine } from "./state_machine"
import { Entities, createEntity } from "./entity/entities"
import { Vec3 } from "cannon-es"
import { Logger } from "./logger"

// required imports
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

// required imports
import xhr2 from 'xhr2'

// @ts-ignore
global.XMLHttpRequest = xhr2.XMLHttpRequest


export class Generation {
  private _world: World
  private _scene: Scene
  private logger: Logger
  
  constructor(world: World, scene: Scene) {
    this._world = world
    this._scene = scene
    this.logger = new Logger("Generation")
  }

  public GENERATE = {
    Cylinder: (position: Vector3, name?: string): Entities => {
      let item = MeshBuilder.CreateCylinder(`${name ?? "Cylinder"}-${Math.random()*100000}` ?? `Cylinder-${Math.random()*100000}`, { height: 5, diameter: 3 }, this._scene);
      item.position = position
      item.metadata = "Cylinder"
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      let entity = createEntity(this._scene, "generate_cylinder", item.position, item, PhysicsImpostor.CylinderImpostor, 90, 1)
      state_machine.add_entity(entity.id, entity)

      return entity
    }, 
    Box: (position: Vector3, name?: string): Entities => {
      let item = MeshBuilder.CreateBox(`${name ?? "Box"}-${Math.random()*100000}` ?? `Box-${Math.random()*100000}`, { size: 2, height: 2, width: 2}, this._scene)
      item.position = position
      item.metadata = "Box"
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;
      let entity = createEntity(this._scene, "generate_box", item.position, item, PhysicsImpostor.BoxImpostor, 90, 1)
      state_machine.add_entity(entity.id, entity)

      return entity
    },
    Tree: async(position: Vector3, name?: string): Promise<Entities> => {

      position.y = 0

      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        "http://localhost:3001/static/meshes/",
        "tree1.glb",
        this._scene
      );
      
      let meshes: Mesh[] = []
      bodies.meshes.forEach((m: any)=>{
        if (!m.getVerticesData(VertexBuffer.PositionKind)){
          // console.log("problems with: " + m.name);
        }else{
          m.metadata = "Tree"
          // m.position = position
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 10000, restitution: 0 }, this._scene)
          meshes.push(m)
        }
      })

      let parent: Mesh = Mesh.MergeMeshes(meshes, true, false, undefined, false, true)
      parent.metadata = "Tree";

      parent.position = position

      let entity: Entities = createEntity(this._scene, "tree", position, parent, PhysicsImpostor.BoxImpostor, 0, 0)
      state_machine.add_entity(entity.id, entity)

      return entity
    }
  }

  public async RANDOMIZE(item: Entities, count: number = 5, squareRange: number = 20) {
    
    let items: Entities[] = []

    for (let i = 1; i < count; i++) {
      let pos = new Vector3((Math.random()*squareRange) - (squareRange/2), 1, (Math.random()*squareRange) - (squareRange/2))
      let newItem: Entities = await this.GENERATE[item.metadata as "Cylinder" | "Box" | "Tree"](pos)
      items.push(newItem)
    }

    return items
  }
}