import { AdvancedDynamicTexture, Control, TextBlock } from "@babylonjs/gui";
import type { PlayerItem } from "./items";
import { Generation } from "../world/generation";

export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture;
  private _currentSlot: number = 1;
  private _slots: Map<number, PlayerItem>;
  private _currentVersion: number = 13;
  private _baseSnippet: string = "UW33M7";
  private _children: any;
  private _guiSlots: Map<number, any>;
  private _healthBar: TextBlock | null = null;
  private _playerInventory: Map<number, PlayerItem>;
  private _generator: Generation | undefined

  constructor(mainGUI: AdvancedDynamicTexture) {
    this._mainGUI = mainGUI;
    this._slots = new Map();
    this._guiSlots = new Map();
    this._playerInventory = new Map();
  }

  public async init(gen: Generation) {
    this._generator = gen
    await this.load();
    this.listen();
  }

  private async load() {
    await this._mainGUI.parseFromSnippetAsync(
      `${this._baseSnippet}#${this._currentVersion}`
    );
    let grid: any = this._mainGUI.getChildren()[0].children[0];
    this._children = grid._childControls;

    for (let i = 1; i < 11; i++) {
      let temp = this._children.filter(
        (control: Control) => control.name === `slot-${i}`
      )[0];
      this._guiSlots.set(i, temp);

      temp.onPointerClickObservable.add(() => {
        this.currentSlot = i;
      });

      if (this._slots.has(i)) {
        let text = new TextBlock();
        text.text = this._slots.get(i)!._metadata;
        text.color = "black";
        text.fontSize = 10;

        temp.addControl(text);
      }
    }

    {
      let health = new TextBlock();
      health.text = "Health: 100";
      health.name = "health-bar";
      health.color = "red";
      health.fontSize = 20;
      health.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      health.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      health.topInPixels = -500;
      this._mainGUI.addControl(health);
      this._healthBar = <TextBlock>this._mainGUI.getChildren()[0]._children[4];
    }

    this.currentSlot = 1;
  }

  private loadSlot(item: PlayerItem, slot: number) {
    let grid: any = this._mainGUI.getChildren()[0].children[0];
    let children = grid._childControls;
    let temp = children.filter(
      (control: Control) => control.name === `slot-${slot}`
    )[0];
    this._guiSlots.set(slot, temp);

    if (temp.children.length === 1) {
      let text = new TextBlock();
      text.text = item._metadata;
      text.color = "black";
      text.fontSize = 10;

      temp.addControl(text);
    } else {
      let text = temp.children[1];
      text.text = item._metadata;
      text.color = "black";
      text.fontSize = 10;
    }

    this._guiSlots.set(slot, temp);
  }

  private releaseSlot(slot: number = this._currentSlot) {
    let grid: any = this._mainGUI.getChildren()[0].children[0];
    let children = grid._childControls;
    let temp = children.filter(
      (control: Control) => control.name === `slot-${slot}`
    )[0];

    if (temp.children.length > 1) {
      let text = temp.children[1];
      text.text = "";
      text.color = "black";
      text.fontSize = 10;
    }

    this._guiSlots.set(slot, temp)
  }

  private listen() {
    onkeydown = (event) => {
      switch (event.code) {
        case "Digit1":
          this.currentSlot = 1;
          break;
        case "Digit2":
          this.currentSlot = 2;
          break;
        case "Digit3":
          this.currentSlot = 3;
          break;
        case "Digit4":
          this.currentSlot = 4;
          break;
        case "Digit5":
          this.currentSlot = 5;
          break;
        case "Digit6":
          this.currentSlot = 6;
          break;
        case "Digit7":
          this.currentSlot = 7;
          break;
        case "Digit8":
          this.currentSlot = 8;
          break;
        case "Digit9":
          this.currentSlot = 9;
          break;
        case "Digit0":
          this.currentSlot = 10;
          break;
        case "KeyZ":
          this.drop();
          break;
      }
    };
    onwheel = (event) => {
      let direction = event.deltaY < 0 ? "up" : "down";
      switch (direction) {
        case "up":
          this.decrement();
          break;
        case "down":
          this.increment();
          break;
      }
    };
  }

  // on scroll wheel
  public async increment() {
    if (this._currentSlot === 10) this.currentSlot = 1;
    else this.currentSlot = this._currentSlot + 1;
  }

  public async decrement() {
    if (this._currentSlot === 1) this.currentSlot = 10;
    else this.currentSlot = this._currentSlot - 1;
  }

  public healthChange(new_health: number) {
    this._healthBar!.text = `Health: ${new_health}`;
  }

  public use(id?: string) {
    this.current?.use(id);
  }

  public add(item: PlayerItem, slot: number): boolean {
    this._slots.set(slot, item);
    this._playerInventory.set(slot, item);
    this.loadSlot(item, slot);
    // console.log(slot, item);

    return true;
  }

  public drop() {
    if (this.current) {
      this._generator!.GENERATE.ENTITY(this.current!)
    }
    this._slots.delete(this._currentSlot)
    this.releaseSlot(this._currentSlot)
  }

  public get current(): PlayerItem | undefined {
    // this is to stop circular data json error
    return this._slots.get(this._currentSlot);
  }

  public set currentSlot(slot: number) {
    if (this._currentSlot !== 0) {
      let oldControl = this._guiSlots.get(this._currentSlot);
      oldControl.children[0].background = "#cccccc";
    }
    this._currentSlot = slot;
    let slotControl = this._guiSlots.get(slot);
    slotControl.children[0].background = "#fbff00";
  }

  public get inventory(): Map<number, PlayerItem> {
    return this._playerInventory;
  }

  public set inventory(inv: Map<number, PlayerItem>) {
    this._playerInventory = inv;
  }
}
