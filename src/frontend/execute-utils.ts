import { Screen } from './screen'
import { CPU } from './cpu'
import { MemoryBus } from './mbus'

const clearScreen = (): void => {
  Screen.instance.clearDisplay()
}

const jumpAddress = (address: number): void => {
  CPU.instance.programCounter = address
}

const callSubroutine = (address: number): void => {
  // first, push the current PC value to the stack so that it can be returned to
  CPU.instance.pushToStack(CPU.instance.programCounter)

  CPU.instance.programCounter = address
}

const returnFromSubroutine = (): void => {
  CPU.instance.programCounter = CPU.instance.popFromStack()
}

const setRegister = (register: number, value: number): void => {
  CPU.instance.setRegister(register, value)
}

const addToRegister = (register: number, value: number): void => {
  CPU.instance.addToRegister(register, value)
}

const skipIfEqual = (register: number, value: number): void => {
  if (CPU.instance.getRegister(register) === value) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
}

const skipIfNotEqual = (register: number, value: number): void => {
  if (CPU.instance.getRegister(register) !== value) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
}

const setIndexRegister = (address: number): void => {
  CPU.instance.index = address
}

const displayDraw = (xRegister: number, yRegister: number, pixelHeight: number): void => {
  // get the x and y coordinates from relevant registers
  const x = CPU.instance.getRegister(xRegister)
  const y = CPU.instance.getRegister(yRegister)

  // set VF to 0 (will become 1 if any pixels are turned off)
  CPU.instance.setRegister(0xF, 0x0)

  // get the sprite data, starting at the index address
  const spriteData: Uint8Array = new Uint8Array(pixelHeight)
  const memory = MemoryBus.instance.memory
  for (let i = 0; i < pixelHeight; i++) {
    spriteData[i] = memory[CPU.instance.index + i]
  }

  /**
   * For example: DXY6 could look like this (see the 'I'?):
   *  00000000
   *  00111110
   *  00001000
   *  00001000
   *  00001000
   *  00111110
   */

  if (Screen.instance.drawSprite(x, y, spriteData)) {
    CPU.instance.setRegister(0xF, 0x1)
  }
}

export {
  clearScreen,
  jumpAddress,
  callSubroutine,
  returnFromSubroutine,
  setRegister,
  addToRegister,
  skipIfEqual,
  skipIfNotEqual,
  setIndexRegister,
  displayDraw
}
