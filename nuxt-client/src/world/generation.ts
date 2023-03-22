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
} from "@babylonjs/core";
import { Texture } from "babylonjs";

export class Generation {
  private _world: World;
  private _scene: Scene;
  private env: any;

  constructor(world: World, scene: Scene, env: any) {
    this._world = world;
    this._scene = scene;
    this.env = env;
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
    Tree1: async (mesh: any): Promise<Mesh> => {
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env["CMS"]}/meshes/`,
        "tree1.glb",
        this._scene
      );

      let meshes: Mesh[] = [];
      bodies.meshes.forEach((m: any) => {
        if (!m.getVerticesData(VertexBuffer.PositionKind)) {
          // console.log("problems with: " + m.name);
        } else {
          m.scaling = new Vector3(2.5, 2.5, 2.5);
          m.checkCollisions = true;
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
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
      for (let i = 0; i < parent.material.subMaterials.length; i++) {
        parent.material.subMaterials[i].usePhysicalLightFalloff = false;
      }

      parent.position = new Vector3(mesh.position._x, 0, mesh.position._z);
      parent.metadata = "Tree1";
      parent.receiveShadows = true;

      var treeRustling = new Sound(
        "Rustling",
        `${this.env["CMS"]}/audio/rustling.mp3`,
        this._scene,
        null,
        { loop: true, autoplay: true, volume: 0.2 }
      );

      // Sound will now follow the mesh position
      treeRustling.attachToMesh(parent);

      // this._scene.createDefaultEnvironment()
      // parent.rotation = new Vector3(Math.PI / 2, Math.PI, 0)
      // parent.scaling = new Vector3(0.25, 0.25, 0.25)

      return parent;
    },
    Tree2: async (mesh: any): Promise<Mesh> => {
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env["CMS"]}/meshes/`,
        "tree2.glb",
        this._scene
      );

      let meshes: Mesh[] = [];
      bodies.meshes.forEach((m: any) => {
        if (!m.getVerticesData(VertexBuffer.PositionKind)) {
          // console.log("problems with: " + m.name);
        } else {
          m.position.y = 0;
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
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

      parent.position = new Vector3(mesh.position.x, 0, mesh.position.z);

      // parent.setPivotPoint(new Vector3(0, -parent.getBoundingInfo().boundingBox.extendSize.y, 0));
      // parent.computeWorldMatrix(true);

      // parent.position = new Vector3(mesh.position.x, 0, mesh.position.z);

      parent.metadata = "Tree2";
      // parent.rotation = new Vector3(Math.PI / 2, Math.PI, 0)
      // parent.scaling = new Vector3(0.25, 0.25, 0.25)

      return parent;
    },
    House: async (mesh: any): Promise<Mesh> => {
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env["CMS"]}/meshes/`,
        "house.glb",
        this._scene
      );

      let meshes: Mesh[] = [];
      bodies.meshes.forEach((m: any) => {
        if (!m.getVerticesData(VertexBuffer.PositionKind)) {
          // console.log("problems with: " + m.name);
        } else {
          m.scaling = new Vector3(4, 4, 4);
          m.checkCollisions = true;
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
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
      for (let i = 0; i < parent.material.subMaterials.length; i++) {
        parent.material.subMaterials[i].usePhysicalLightFalloff = false;
      }

      parent.position = new Vector3(mesh.position._x, 0, mesh.position._z);
      parent.metadata = "House";
      parent.receiveShadows = true;

      return parent;
    },
    Sheep: async (mesh: any): Promise<Mesh> => {
      let bodies: any = await SceneLoader.ImportMeshAsync(
        "",
        `${this.env["CMS"]}/meshes/`,
        "sheep.glb",
        this._scene
      );

      let meshes: Mesh[] = [];
      bodies.meshes.forEach((m: any) => {
        if (!m.getVerticesData(VertexBuffer.PositionKind)) {
          // console.log("problems with: " + m.name);
        } else {
          // m.scaling = new Vector3(4, 4, 4);
          m.checkCollisions = true;
          // m.physicsImpostor = new PhysicsImpostor(m, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this._scene)
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
      for (let i = 0; i < parent.material.subMaterials.length; i++) {
        parent.material.subMaterials[i].usePhysicalLightFalloff = false;
      }

      parent.position = new Vector3(mesh.position._x, 0, mesh.position._z);
      parent.metadata = "Sheep";
      parent.receiveShadows = true;

      var whalenSound = new Sound(
        "Rustling",
        `${this.env["CMS"]}/audio/whalen.wav`,
        this._scene,
        null,
        { loop: true, autoplay: true, volume: 1 }
      );

      // Sound will now follow the mesh position
      whalenSound.attachToMesh(parent);

      return parent;
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
