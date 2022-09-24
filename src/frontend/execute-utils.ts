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

const setRegisterToSubtract = (firstRegister: number, secondRegister: number): void => {
  const firstValue = CPU.instance.getRegister(firstRegister)
  const secondValue = CPU.instance.getRegister(secondRegister)

  // set VX to first register - second register
  CPU.instance.setRegister(firstRegister, firstValue - secondValue)

  // modify the carry flag
  if (firstValue > secondValue) {
    CPU.instance.setRegister(0xF, 0x1)
  } else {
    CPU.instance.setRegister(0xF, 0x0)
  }
}

const setRegisterToLeftShift = (register: number): void => {
  const registerValue = CPU.instance.getRegister(register)

  // set VX to register value shifted once to the left
  CPU.instance.setRegister(register, registerValue << 0x1)

  // set VF to the most significant (leftmost) bit, assuming an 8 bit value.
  // In other words, the value has to be greater than 128 (1000000) for the MSB to be 1
  // mask off the leftmost bit (remember, this is binary, 0x80 would be the leftmost) and shift right 7 bits.
  CPU.instance.setRegister(0xF, (registerValue & 0x80) >> 0x7)
}

const setRegisterToRightShift = (register: number): void => {
  const registerValue = CPU.instance.getRegister(register)

  // set VX to register value shifted once to the right
  CPU.instance.setRegister(register, registerValue >> 0x1)

  // set VF to the least significant (rightmost) bit, assuming an 8 bit value.
  // mask off the rightmost bit
  CPU.instance.setRegister(0xF, (registerValue & 0x1))
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

const setRegisterToDelayTimer = (register: number): void => {
  CPU.instance.setRegister(register, CPU.instance.delayTimer)
}

const setDelayTimerToRegisterValue = (register: number): void => {
  CPU.instance.delayTimer = CPU.instance.getRegister(register)
}

const setSoundTimerToRegisterValue = (register: number): void => {
  CPU.instance.soundTimer = CPU.instance.getRegister(register)
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

const addToIndexRegister = (address: number): void => {
  // add value of address to index register
  CPU.instance.index += CPU.instance.getRegister(address)
}

const setIndexToFontAddress = (address: number): void => {
  // VX contains a single hexadecimal character that we want to retrieve the font sprite for
  const character = CPU.instance.getRegister(address)
  CPU.instance.index = MemoryBus.instance.getFontAddress(character)
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

const waitForKey = (address: number): void => {
  // decrement PC by 2 unless key is pressed.
  // if pressed, store key index in VX
  const keyValue = Keyboard.instance.getLastPressed()

  if (keyValue >= 0x0) {
    CPU.instance.setRegister(address, keyValue)
  } else {
    CPU.instance.increment(-2)
  }
}

const binaryDecimalConversion = (address: number): void => {
  // convert the number in VX to three decimal digits, and store the subsequent values in (index address + ...)
  // I.E 156 would become 1, 5 and 6
  const registerValue = CPU.instance.getRegister(address)
  const indexAddress = CPU.instance.index
  registerValue.toString().split('').forEach((digit, index) => {
    MemoryBus.instance.setMemoryAddress(indexAddress + index, parseInt(digit))
  })
}

const storeIntoMemory = (address: number): void => {
  // store the contents of V0...VX into the index + ... addresses
  const indexAddress = CPU.instance.index
  for (let i = 0x0; i <= address; ++i) {
    MemoryBus.instance.setMemoryAddress(indexAddress + i, CPU.instance.getRegister(i))
  }
}

const readFromMemory = (address: number): void => {
  // load the contents of index + ... into registers V0...VX
  const indexAddress = CPU.instance.index
  for (let i = 0x0; i <= address; ++i) {
    CPU.instance.setRegister(i, MemoryBus.instance.getMemoryAddress(indexAddress + i))
    MemoryBus.instance.setMemoryAddress(indexAddress + i, CPU.instance.getRegister(i))
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
  setRegisterToSubtract,
  setRegisterToLeftShift,
  setRegisterToRightShift,
  setRegisterToDelayTimer,
  setDelayTimerToRegisterValue,
  setSoundTimerToRegisterValue,
  skipIfEqual,
  skipIfNotEqual,
  skipIfRegistersEqual,
  skipIfRegistersNotEqual,
  setIndexRegister,
  addToIndexRegister,
  setIndexToFontAddress,
  generateRandom,
  skipIfKeyPressed,
  skipIfKeyNotPressed,
  waitForKey,
  binaryDecimalConversion,
  storeIntoMemory,
  readFromMemory,
  displayDraw
}
