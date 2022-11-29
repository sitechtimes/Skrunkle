import { AdvancedDynamicTexture, Control, Grid, TextBlock } from "@babylonjs/gui"
import { PlayerItem } from "./items"


export class Hotbar {
  private _mainGUI: AdvancedDynamicTexture
  private _currentSlot: number = 1
  private _slots: Map<number, PlayerItem>
  private _currentVersion: number = 13
  private _baseSnippet: string = "UW33M7"
  private _children: any
  private _guiSlots: Map<number, any>
  private _healthBar: Control
  private _playerInventory: Map<number, PlayerItem>
  
  constructor(mainGUI: AdvancedDynamicTexture) {
    this._mainGUI = mainGUI
    this._slots = new Map()
    this._guiSlots = new Map()
    this._playerInventory = new Map()
  }
  
  public async init() {
    await this.load()
    this.listen()
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

      if (this._slots.has(i)) {
        let text = new TextBlock()
        text.text = this._slots.get(i)!._name
        text.color = "black"
        text.fontSize = 10
        
        temp.addControl(text)
      }
    }

    {
      let health = new TextBlock()
      health.text = "Health: 100"
      health.name = "health-bar"
      health.color = "red"
      health.fontSize = 20
      health.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
      health.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT
      health.topInPixels = -500
      this._mainGUI.addControl(health)
      this._healthBar = this._mainGUI.getChildren()[0]._children[4]
    }

    this.current = 1
  }
  
  private loadSlot(item: PlayerItem, slot: number) {
    let grid:any = this._mainGUI.getChildren()[0].children[0]
    let children = grid._childControls
    let temp = children.filter((control: Control) => control.name === `slot-${slot}`)[0]
    this._guiSlots.set(slot, temp)

    if (temp.children.length === 1) {
      let text = new TextBlock()
      text.text = item._name
      text.color = "black"
      text.fontSize = 10
      
      temp.addControl(text)
    } else {
      let text = temp.children[1]
      text.text = item._name
      text.color = "black"
      text.fontSize = 10
    }
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
        case "KeyE":
          this.current?.use()
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

  public healthChange(new_health: number) {
    this._healthBar.text = `Health: ${new_health}`
  }

  public add(item: PlayerItem, slot: number): boolean {
    this._slots.set(slot, item)
    this._playerInventory.set(slot, item)
    this.loadSlot(item, slot)
    console.log(slot, item)

    return true
  }

  
  public get current(): any {
    // this is to stop circular data json error
    return this._slots.get(this._currentSlot)
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

  public get inventory(): Map<number, PlayerItem> {
    return this._playerInventory
  }

  public set inventory(inv: Map<number, PlayerItem>) {
    this._playerInventory = inv
  }
}