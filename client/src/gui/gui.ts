import { AdvancedDynamicTexture } from "@babylonjs/gui"
import { Scene } from "@babylonjs/core"

export class GUI {
  private _mainGUI: AdvancedDynamicTexture
  private _scene: Scene

  constructor(scene: Scene) {
    this._scene = scene
    this._mainGUI = AdvancedDynamicTexture.CreateFullscreenUI("main-gui", true, this._scene)
  }

  public async createHotbar() {
    await this._mainGUI.parseFromSnippetAsync("UW33M7#8")
  }

  public disposeGUI() {
    this._mainGUI.dispose()
  }
}