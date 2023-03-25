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
  PhysicsImpostor,
  PhysicsJoint,
  VertexBuffer,
  Matrix,
  Sound,
  Texture,
  AbstractMesh
} from "@babylonjs/core";
import { Entities, createEntity } from "../entity/entities";
import { state_machine } from "../state_machine";

class SoundLoader{
  private env: any;
  private _scene: Scene
  private _whalen: Sound;
  private _tree: Sound;

  constructor(env: any, scene: Scene){
    this.env = env
    this._scene = scene
    
    this._whalen =  new Sound("Whalen", `${this.env["CMS"]}/audio/whalen.wav`, this._scene, null, { loop: true, autoplay: false, volume: 0.2, maxDistance: 100 });
    this._tree = new Sound("Rustling", `${this.env["CMS"]}/audio/rustling.mp3`, this._scene, null, { loop: true, autoplay: false, volume: 0.2, maxDistance: 100 });
  }

  public get whalen(): Sound {
    let newSound = this._whalen.clone()
    newSound?.play()
    return newSound
  }

  public get tree(): Sound {
    let newSound = this._tree.clone()
    newSound?.play()
    return newSound
  }

}

export class Generation {
  private _world: World;
  private _scene: Scene;
  private env: any;
  private soundLoader;

  constructor(world: World, scene: Scene, env: any) {
    this._world = world;
    this._scene = scene;
    this.env = env;
  
    this.soundLoader = new SoundLoader(this.env, this._scene)
    // Sound will now follow the mesh position
    
  }

  private async add_custom_mesh(
    uid: string, mesh: any, mass: number, restitution: number, y_pos: number = 0, mesh_file_name: string, scaling: Vector3, 
    metadata: string, noise: Sound | undefined = undefined
  ): Promise<Mesh>{
    let bodies: any = await SceneLoader.ImportMeshAsync(
      "",
      `${this.env["CMS"]}/meshes/`,
      mesh_file_name,
      this._scene
    );

    let meshes: Mesh[] = [];
    bodies.meshes.forEach((m: any) => {
      if (!m.getVerticesData(VertexBuffer.PositionKind)) {
        // dont add this mesh
      } else {
        m.scaling = scaling;
        m.checkCollisions = true;
        meshes.push(m);
      }
    });

    let parent: any = Mesh.MergeMeshes(
      meshes,
      true,
      false,
      undefined,
      false,
      true
    );

    if (parent.material){
       for (let i = 0; i < parent.material.subMaterials.length; i++) {
        parent.material.subMaterials[i].usePhysicalLightFalloff = false;
      } 
    }

    if (mass === 0) {
      parent.freezeWorldMatrix()
      parent.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
    }

    parent.position = new Vector3(mesh.position._x, y_pos, mesh.position._z);
    parent.metadata = metadata;
    parent.receiveShadows = true;
    let entity: Entities = createEntity(
      this._scene,
      uid,
      mesh.name,
      mesh.position,
      parent,
      PhysicsImpostor.MeshImpostor,
      mass,
      restitution
    );
    entity.update(
      mesh.linearVelocity,
      mesh.angularVelocity,
      mesh.position,
      mesh.rotation
    );
    state_machine.add_entity(uid, entity);

    if (noise){
      noise.attachToMesh(parent);
    }

    return parent;
  }

  public GENERATE = {
    Cylinder: (mesh: any, uid: string): Mesh => {
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
    Box: (mesh: any, uid: string): Mesh => {
      var material = new StandardMaterial("box_texture", this._scene);
      material.diffuseTexture = new Texture(
        `${this.env["CMS"]}/textures/whalen/whalen.jpg`,
        this._scene
      );
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
    Tree1: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "tree1.glb", new Vector3(2.5, 2.5, 2.5),
        "Tree1", this.soundLoader.tree
      )
    },
    Tree2: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "tree2.glb", new Vector3(1, 1, 1), "Tree2", 
        this.soundLoader.tree
      )
    },
    House: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "house.glb", new Vector3(4, 4, 4),
        "House"
      )
    },
    House2: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "house2.glb", new Vector3(2, 2, 2),
        "House2"
      )
    },
    Sheep: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh, 100, 0, 0, "sheep.glb", new Vector3(1, 1, 1),
        "Sheep", this.soundLoader.whalen
      )
    },
    Slope: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "slope.glb", new Vector3(4, 4, 4),
        "Slope"
      )
    },
    Fountain: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "fountain.glb", new Vector3(3, 3, 3),
        "Fountain"
      )
    },
    Crate: async (mesh: any, uid: string): Promise<Mesh> => {
      return this.add_custom_mesh(
        uid, mesh,0, 0, 0, "crate.glb", new Vector3(3, 3, 3),
        "Crate"
      )
    },
  };

}
