import { AdvancedDynamicTexture } from "@babylonjs/gui";
import { Scene } from "@babylonjs/core";
import { Hotbar } from "./hotbar";
import type { Generation } from "../world/generation";

export class GUI {
  private _mainGUI: AdvancedDynamicTexture;
  private _scene: Scene;
  private _hotbar: Hotbar;

  constructor(scene: Scene) {
    this._scene = scene;
    this._mainGUI = AdvancedDynamicTexture.CreateFullscreenUI(
      "main-gui",
      true,
      this._scene
    );
    this._hotbar = new Hotbar(this._mainGUI);
  }

  public async createHotbar(gen: Generation) {
    await this._hotbar.init(gen);
  }

  public disposeGUI() {
    this._mainGUI.dispose();
  }

  public get hotbar() {
    return this._hotbar;
  }
}
