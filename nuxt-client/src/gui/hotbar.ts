import { AdvancedDynamicTexture } from "@babylonjs/gui";

export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture;

  private _currentVersion: number = 14;
  private _baseSnippet: string = "UW33M7";

  constructor(mainGUI: AdvancedDynamicTexture) {
    this._mainGUI = mainGUI;
  }

  public async init() {
    await this.load();
  }

  private async load() {
    await this._mainGUI.parseFromSnippetAsync(
      `${this._baseSnippet}#${this._currentVersion}`
    );
  }
}
