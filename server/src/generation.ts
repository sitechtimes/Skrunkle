import { MeshBuilder, StandardMaterial, Color3, Scene, Mesh, PhysicsImpostor, Vector2, Vector3, SceneLoader, VertexBuffer } from "babylonjs"
import { World } from "./world"
import { state_machine } from "./state_machine"
import { Entities, createEntity } from "./entity/entities"
import { Vec3 } from "cannon-es"
import { Logger } from "./logger"


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
    Cylinder: (name?: string): Entities => {
      let item = MeshBuilder.CreateCylinder(`${name ?? "Cylinder"}-${Math.random()*100000}` ?? `Cylinder-${Math.random()*100000}`, { height: 5, diameter: 3 }, this._scene);
      item.position.x = 3;
      item.position.y = 100;
      item.position.z = 10;
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
    Box: (name?: string): Entities => {
      let item = MeshBuilder.CreateBox(`${name ?? "Box"}-${Math.random()*100000}` ?? `Box-${Math.random()*100000}`, { size: 2, height: 2, width: 2}, this._scene)
      item.position.x = 3;
      item.position.y = 100;
      item.position.z = 10;
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
    Tree: async(name?: string): Entities => {

      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        "tree1.glb",
        this._scene
      );
      
      let meshes: Mesh[] = []
      bodies.meshes.forEach((m: any)=>{
        if (!m.getVerticesData(VertexBuffer.PositionKind)){
          console.log("problems with: " + m.name);
        }else{
          m.metadata = "Tree"
          m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
          meshes.push(m)
        }
      })

      console.log(meshes)
    
      let parent: Mesh = Mesh.MergeMeshes(meshes, true, false, undefined, false, true)
      parent.metadata = "Tree";

      let entity = createEntity(this._scene, "tree", new Vector3(0, 1, 0), parent, null, 10000, 0)
      state_machine.add_entity(entity.id, entity)

      return entity
    }
  }

  public RANDOMIZE(item: Entities, count: number = 5, squareRange: number = 20) {
    
    let items: Entities[] = []

    for (let i = 1; i < count; i++) {
      console.log("INIT TREE")
      let newItem: Entities = this.GENERATE[item.metadata as "Cylinder" | "Box" | "Tree"]()
      newItem.position.x = (Math.random()*squareRange) - (squareRange/2)
      newItem.position.z = (Math.random()*squareRange) - (squareRange/2)
      items.push(newItem)
    }

    return items
  }
}