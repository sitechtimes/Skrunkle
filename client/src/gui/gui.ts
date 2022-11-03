import { AdvancedDynamicTexture } from "@babylonjs/gui"
import { Scene } from "@babylonjs/core"
import { Hotbar } from "./hotbar"

export class GUI {
  private _mainGUI: AdvancedDynamicTexture
  private _scene: Scene
  private _hotbar: Hotbar

  constructor(scene: Scene) {
    this._scene = scene
    this._mainGUI = AdvancedDynamicTexture.CreateFullscreenUI("main-gui", true, this._scene)
    this._hotbar = new Hotbar(this._mainGUI)
  }

  public async createHotbar() {
    await this._hotbar.init()
  }

  public disposeGUI() {
    this._mainGUI.dispose()
  }

  public get hotbar() {
    return this._hotbar
  }
}