import { Screen } from './screen'
import { CPU } from './cpu'
import { MemoryBus } from './mbus'
import { Keyboard } from './keyboard'

const clearScreen = (): void => {
  Screen.instance.clearDisplay()
}

const jumpAddress = (address: number): void => {
  CPU.instance.programCounter = address
}

const jumpAddressPlusV0 = (address: number): void => {
  CPU.instance.programCounter = address + CPU.instance.getRegister(0x0)
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

const loadIntoRegister = (firstRegister: number, secondRegister: number): void => {
  CPU.instance.setRegister(firstRegister, CPU.instance.getRegister(secondRegister))
}

const addToRegister = (register: number, value: number): void => {
  CPU.instance.addToRegister(register, value)
}

const setRegisterToAdd = (firstRegister: number, secondRegister: number): void => {
  const firstValue = CPU.instance.getRegister(firstRegister)
  const secondValue = CPU.instance.getRegister(secondRegister)

  // set VX to the sum of VX + VY
  CPU.instance.setRegister(firstRegister, firstValue + secondValue)

  // modify the carry flag (values > 255 set carry to 1)
  if ((firstValue + secondValue) > 0xFF) {
    CPU.instance.setRegister(0xF, 0x1)
  } else {
    CPU.instance.setRegister(0xF, 0x0)
  }
}

const setRegisterBinaryOR = (firstRegister: number, secondRegister: number): void => {
  const firstValue = CPU.instance.getRegister(firstRegister)
  const secondValue = CPU.instance.getRegister(secondRegister)

  // set VX to the binary OR of VX and VY
  CPU.instance.setRegister(firstRegister, firstValue | secondValue)
}

const setRegisterBinaryAND = (firstRegister: number, secondRegister: number): void => {
  const firstValue = CPU.instance.getRegister(firstRegister)
  const secondValue = CPU.instance.getRegister(secondRegister)

  // set VX to the binary AND of VX and VY
  CPU.instance.setRegister(firstRegister, firstValue & secondValue)
}

const setRegisterBinaryXOR = (firstRegister: number, secondRegister: number): void => {
  const firstValue = CPU.instance.getRegister(firstRegister)
  const secondValue = CPU.instance.getRegister(secondRegister)

  // set VX to the binary XOR of VX and VY
  CPU.instance.setRegister(firstRegister, firstValue ^ secondValue)
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

const skipIfRegistersEqual = (firstRegister: number, secondRegister: number): void => {
  if (CPU.instance.getRegister(firstRegister) === CPU.instance.getRegister(secondRegister)) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
}

const skipIfRegistersNotEqual = (firstRegister: number, secondRegister: number): void => {
  if (CPU.instance.getRegister(firstRegister) !== CPU.instance.getRegister(secondRegister)) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
}

const setIndexRegister = (address: number): void => {
  CPU.instance.index = address
}

const generateRandom = (address: number, range: number): void => {
  // generate number from 0 to range
  const randomNumber = (Math.floor(Math.random() * 255) & range)
  CPU.instance.setRegister(address, randomNumber)
}

const skipIfKeyPressed = (key: number): void => {
  if (Keyboard.instance.isPressed(key)) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
}

const skipIfKeyNotPressed = (key: number): void => {
  if (!Keyboard.instance.isPressed(key)) {
    // skip the next two-byte instruction
    CPU.instance.increment(2)
  }
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
  jumpAddressPlusV0,
  callSubroutine,
  returnFromSubroutine,
  setRegister,
  loadIntoRegister,
  setRegisterBinaryOR,
  setRegisterBinaryAND,
  setRegisterBinaryXOR,
  addToRegister,
  setRegisterToAdd,
  skipIfEqual,
  skipIfNotEqual,
  skipIfRegistersEqual,
  skipIfRegistersNotEqual,
  setIndexRegister,
  generateRandom,
  skipIfKeyPressed,
  skipIfKeyNotPressed,
  displayDraw
}
