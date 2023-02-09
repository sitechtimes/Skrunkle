import { MeshBuilder, StandardMaterial, Color3, Scene, Mesh, PhysicsImpostor, Vector2, Vector3 } from "babylonjs"
import { World } from "./world"
import { state_machine } from "./state_machine"
import { Entities } from "./entity/entities"
import { Vec3 } from "cannon-es"


export class Generation {
  private _world: World
  private _scene: Scene
  
  constructor(world: World, scene: Scene) {
    this._world = world
    this._scene = scene
  }

  public GENERATE = {
    Cylinder: (name?: string): Mesh => {
      let item = MeshBuilder.CreateCylinder(`${name ?? "Cylinder"}-${Math.random()*100000}` ?? `Cylinder-${Math.random()*100000}`, { height: 5, diameter: 3 });
      item.position.x = 3;
      item.position.y = 1;
      item.position.z = 10;
      item.metadata = "Cylinder"
      var myMat = new StandardMaterial("myMat", this._scene);
      myMat.specularColor = new Color3(0.15, 0.76, 0.9);
      myMat.diffuseColor = new Color3(0.95, 0.16, 0.9);
      myMat.emissiveColor = new Color3(1, 0.1, 1);
      myMat.ambientColor = new Color3(0.58, 0.6, 0.9);
      item.material = myMat;

      let physicsImpostor = new PhysicsImpostor(item, PhysicsImpostor.CylinderImpostor, {mass: 100, restitution: 0.1 }, this._scene)
      item.physicsImpostor = physicsImpostor

      let entity: Entities = new Entities("generated-cylinder", new Vector3(0, 0, 0), item)
      state_machine.entities.set(entity.id, entity)

      return item
    }, 
    Box: (name?: string): Mesh => {
      let item = MeshBuilder.CreateBox(`${name ?? "Box"}-${Math.random()*100000}` ?? `Box-${Math.random()*100000}`, { size: 2, height: 2, width: 2}, this._scene)
      item.metadata = "Box"

      let physicsImpostor = new PhysicsImpostor(item, PhysicsImpostor.BoxImpostor, {mass: 100, restitution: 0.1 }, this._scene)
      item.physicsImpostor = physicsImpostor

      let entity: Entities = new Entities("generated-box", new Vector3(0, 0, 0), item)
      state_machine.entities.set(entity.id, entity)

      return item
    }
  }

  public RANDOMIZE(item: Mesh, count: number = 5, squareRange: number = 20) {
    let items: Mesh[] = []

    item.position.x = (Math.random()*squareRange) - (squareRange/2)
    item.position.z = (Math.random()*squareRange) - (squareRange/2)
    items.push(item)
    for (let i = 1; i < count; i++) {
      let newItem: Mesh = this.GENERATE[item.metadata as "Cylinder" | "Box"]()
      newItem.position.x = (Math.random()*squareRange) - (squareRange/2)
      newItem.position.z = (Math.random()*squareRange) - (squareRange/2)
      this._world.addEntity(newItem)
      items.push(newItem)
    }
    
    return items
  }
}