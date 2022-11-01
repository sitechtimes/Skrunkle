import { AdvancedDynamicTexture, Button } from "@babylonjs/gui"
import { Scene } from "babylonjs"

export class GUI {
  private _mainGUI: AdvancedDynamicTexture
  private _loadedGUI
  private _scene: Scene

  constructor(scene: Scene) {
    this._scene = scene
    this._mainGUI = AdvancedDynamicTexture.CreateFullscreenUI("main-gui", true, this._scene)
  }

  public async createMenu() {
    /* const button1 = Button.CreateSimpleButton('but1', 'Click Me')
    button1.width = "150px"
    button1.height = "40px";
    button1.color = "white";
    button1.cornerRadius = 20;
    button1.background = "green";
    button1.onPointerUpObservable.add(() => {
      this._mainGUI.removeControl(button1)
    });
    this._mainGUI.addControl(button1);  */

    await this._mainGUI.parseFromSnippetAsync("UW33M7#8")
  }

  public destroyGUI() {

  }
}