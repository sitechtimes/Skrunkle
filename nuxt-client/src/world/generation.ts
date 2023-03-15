import { World } from "./world";
import {
  MeshBuilder,
  StandardMaterial,
  Color3,
  Scene,
  Mesh,
  SceneLoader,
  TransformNode,
  Vector3,
} from "@babylonjs/core";
import { PlayerItem } from "../gui/items";
import { state_machine } from "../state_machine";
import {
  PhysicsImpostor,
  PhysicsJoint,
  VertexBuffer,
  Matrix
} from "@babylonjs/core";
import { Texture } from "babylonjs";

export class Generation {
  private _world: World;
  private _scene: Scene;
  private env: any;

  constructor(world: World, scene: Scene, env: any) {
    this._world = world;
    this._scene = scene;
    this.env = env
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
      var material = new StandardMaterial("box_texture", this._scene);
      material.diffuseTexture = new Texture(`${this.env['CMS']}/textures/whalen/whalen.jpg`, this._scene)
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
    ENTITY: async (mesh: PlayerItem): Promise<TransformNode> => {
      // spawn dropped entity
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        "meshes/",
        mesh._path
      );
      for (let child of bodies.meshes) {
        child.name = `${mesh._name}-${Math.random() * 100}`;
        child.metadata = mesh._metadata;
      }
      bodies.transformNodes[0].position = new Vector3(state_machine.client.position.x + 1, state_machine.client.position.y + 1, state_machine.client.position.z + 5)
      state_machine.add_entity(mesh._name, bodies.transformNodes[0])
      return bodies.transformNodes[0]
    },
    Tree1: async(mesh: any): Promise<Mesh> => {
      
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env['CMS']}/meshes/`,
        "tree1.glb",
        this._scene
      );
      
      let meshes: Mesh[] = []
      bodies.meshes.forEach((m: any)=>{
        if (!m.getVerticesData(VertexBuffer.PositionKind)){
          // console.log("problems with: " + m.name);
        }else{
          m.position.y = 0
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
          meshes.push(m)
        }
      })
    
      let parent: any = Mesh.MergeMeshes(meshes, true, false, undefined, false, true)
      parent.position = new Vector3(mesh.position.x, 0, mesh.position.z);
      parent.metadata = "Tree1";
      parent.receiveShadows = true;


      for (let i = 0 ; i < parent.material.subMaterials.length; i ++){
        parent.material.subMaterials[i].usePhysicalLightFalloff = false
      }

      
      // this._scene.createDefaultEnvironment() 
      // parent.rotation = new Vector3(Math.PI / 2, Math.PI, 0)
      // parent.scaling = new Vector3(0.25, 0.25, 0.25)

      return parent
    },
    Tree2: async(mesh: any): Promise<Mesh> => {
      
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env['CMS']}/meshes/`,
        "tree2.glb",
        this._scene
      );
      
      let meshes: Mesh[] = []
      bodies.meshes.forEach((m: any)=>{
        if (!m.getVerticesData(VertexBuffer.PositionKind)){
          // console.log("problems with: " + m.name);
        }else{
          m.position.y = 0
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
          meshes.push(m)
        }
      })
    
      let parent: any = Mesh.MergeMeshes(meshes, true, false, undefined, false, true)

      parent.position = new Vector3(mesh.position.x, 0, mesh.position.z);

      // parent.setPivotPoint(new Vector3(0, -parent.getBoundingInfo().boundingBox.extendSize.y, 0));
      // parent.computeWorldMatrix(true);

      // parent.position = new Vector3(mesh.position.x, 0, mesh.position.z);


      parent.metadata = "Tree2";
      // parent.rotation = new Vector3(Math.PI / 2, Math.PI, 0)
      // parent.scaling = new Vector3(0.25, 0.25, 0.25)

      return parent
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
