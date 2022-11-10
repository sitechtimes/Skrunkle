import { AdvancedDynamicTexture, Control, Grid } from "@babylonjs/gui"
import { PlayerItem } from "./items"


export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture
  private _currentSlot: number = 0
  private _slots: Array<PlayerItem | null>
  private _currentVersion: number = 13
  private _baseSnippet: string = "UW33M7"
  private _children: any
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
    let grid:any = this._mainGUI.getChildren()[0].children[0]
    this._children = grid._childControls

    for (let i = 1; i < 11; i++) {
      let temp = this._children.filter((control: Control) => control.name === `slot-${i}`)[0]
      this._guiSlots.set(i, temp)

      temp.onPointerClickObservable.add(() => {
        this.current = i
      })
    }

    this.current = 1
    
    console.log(this._guiSlots)
  }

  public async init() {
    await this.load()
    this.listen()
  }

  private listen() {
    onkeydown = (event) => {
      switch(event.code) {
        case "Digit1":
          this.current = 1
          break
        case "Digit2":
          this.current = 2
          break
        case "Digit3":
          this.current = 3
          break
        case "Digit4":
          this.current = 4
          break
        case "Digit5":
          this.current = 5
          break
        case "Digit6":
          this.current = 6
          break
        case "Digit7":
          this.current = 7
          break
        case "Digit8":
          this.current = 8
          break
        case "Digit9":
          this.current = 9
          break
        case "Digit0":
          this.current = 10
          break
      }
    }
    onwheel = (event) => {
      let direction = event.deltaY < 0 ? "up" : "down"
      switch (direction) {
        case "up":
          this.decrement()
          break
        case "down":
          this.increment()
          break
      }
    }
  }

  // on scroll wheel
  public async increment() {
    if (this._currentSlot === 10) this.current = 1
    else this.current = this._currentSlot + 1
  }

  public async decrement() {
    if (this._currentSlot === 1) this.current = 10
    else this.current = this._currentSlot - 1
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
    return this._slots[this._currentSlot]
  }
  
  public set current(slot: number) {
    if (this._currentSlot !== 0) {
      let oldControl = this._guiSlots.get(this._currentSlot)
      oldControl.children[0].background = "#cccccc"
    }
    this._currentSlot = slot
    let slotControl = this._guiSlots.get(slot)
    slotControl.children[0].background = "#fbff00"
  }
}