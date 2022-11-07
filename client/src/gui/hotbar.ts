import { AdvancedDynamicTexture, Control } from "@babylonjs/gui"
import { PlayerItem } from "./items"


export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture
  private _currentSlot: number = 0
  private _slots: Array<PlayerItem | null>
  private _currentVersion: number = 13
  private _baseSnippet: string = "UW33M7"
  private _children: Control[] | [] = []
  private _guiSlots: Map<number, any>

  constructor(mainGUI: AdvancedDynamicTexture) {
    this._mainGUI = mainGUI
    this._slots = [
      null, 
      null, 
      null, 
      null, 
      null, 
      null, 
      null, 
      null, 
      null, 
      null,
    ]
    this._guiSlots = new Map()
  }

  private async load() {
    await this._mainGUI.parseFromSnippetAsync(`${this._baseSnippet}#${this._currentVersion}`)
    this._children = this._mainGUI.getChildren()[0].children

    for (let i = 0; i < 10; i++) {
      let temp = this._children.filter((control: Control) => control.name === `slot-${i + 1}`)[0]
      this._guiSlots.set(i + 1, temp)
    }
    
    console.log("slots", this._guiSlots)
  }

  public async init() {
    await this.load()
  }

  // on scroll wheel
  public async increment() {
    
  }

  public async decrement() {

  }

  public add(item: PlayerItem, slot?: number): boolean {
    /* if (!slot) {
      for (let i = 0; i < 0; i++) {
        if (!this._slots.has(i)) {
          slot = i 
          break
        }
      }
    }
    
    if (slot) {
      this._slots.set(slot, item)
      return true
    } else {
      return false
    } */
    // this._slots.set(slot, item)
    if (!slot) {
      for (let i = 0; i < 10; i++) {
        if (!this._slots[i]) {
          slot = i
        }
      }
    }

    if (!slot) {
      return false
    }

    this._slots[slot] = item

    return true
  }

  
  public get current(): any {
    return this._slots.get(this._currentSlot)
  }
  
  public set current(slot: number) {
    this._currentSlot = slot
  }
}