import * as operations from './execute-utils'

export interface Instruction {
  operation: Function
  parameters: any[]
}

export const decode = (instruction: number): Instruction => {
  /**
   * Determine the operation to execute by switching on the hex nibbles.
   * The first nibble can be calculated with a binary AND
   * i.e. 0xA22A & 0xF000 = 0xA000. 0xA000 >> 12 = 0xA.
   * To shift, use this formula: (number of hexes to shift * 4)
   */
  const firstNibble = (instruction & 0xf000) >> 12
  const secondNibble = (instruction & 0x0f00) >> 8
  const thirdNibble = (instruction & 0x00f0) >> 4
  const fourthNibble = (instruction & 0x000f)
  const instructionDecoded: Instruction = { operation: () => {}, parameters: [] }

  switch (firstNibble) {
    case 0x0:
      switch (fourthNibble) {
        // clear screen
        case 0x0:
          instructionDecoded.operation = operations.clearScreen
          break
        // return from subroutine (pop from stack and set PC)
        case 0xE:
          instructionDecoded.operation = operations.returnFromSubroutine
          break
      }
      break
    case 0x1:
      // jump to memory address (set PC)
      instructionDecoded.operation = operations.jumpAddress
      instructionDecoded.parameters.push(instruction & 0x0FFF)
      break
    case 0x2:
      // call a subroutine (set PC and push to stack)
      instructionDecoded.operation = operations.callSubroutine
      instructionDecoded.parameters.push(instruction & 0x0FFF)
      break
    case 0x3:
      // skip if equal
      instructionDecoded.operation = operations.skipIfEqual
      instructionDecoded.parameters = [secondNibble, instruction & 0x00FF]
      break
    case 0x4:
      // skip if not equal
      instructionDecoded.operation = operations.skipIfNotEqual
      instructionDecoded.parameters = [secondNibble, instruction & 0x00FF]
      break
    case 0x5:
      // skip if registers are equal
      instructionDecoded.operation = operations.skipIfRegistersEqual
      instructionDecoded.parameters = [secondNibble, thirdNibble]
      break
    case 0x6:
      // set register
      instructionDecoded.operation = operations.setRegister
      instructionDecoded.parameters = [secondNibble, instruction & 0x00FF]
      break
    case 0x7:
      // add to register
      instructionDecoded.operation = operations.addToRegister
      instructionDecoded.parameters = [secondNibble, instruction & 0x00FF]
      break
    case 0x8:
      switch (fourthNibble) {
        case 0x0:
          // set load value of register into another
          instructionDecoded.operation = operations.loadIntoRegister
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x1:
          // binary OR
          instructionDecoded.operation = operations.setRegisterBinaryOR
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x2:
          // binary AND
          instructionDecoded.operation = operations.setRegisterBinaryAND
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x3:
          // binary XOR
          instructionDecoded.operation = operations.setRegisterBinaryXOR
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x4:
          // add registers
          instructionDecoded.operation = operations.setRegisterToAdd
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x5:
          // subtract VX - VY
          instructionDecoded.operation = operations.setRegisterToSubtract
          instructionDecoded.parameters = [secondNibble, thirdNibble]
          break
        case 0x6:
          // shift VX 1 bit to the right
          instructionDecoded.operation = operations.setRegisterToRightShift
          instructionDecoded.parameters = [secondNibble]
          break
        case 0x7:
          // subtract VY - VX
          instructionDecoded.operation = operations.setRegisterToSubtract
          instructionDecoded.parameters = [thirdNibble, secondNibble]
          break
        case 0xE:
          // shift VX 1 bit to the left
          instructionDecoded.operation = operations.setRegisterToLeftShift
          instructionDecoded.parameters = [secondNibble]
          break
      }
      break
    case 0x9:
      // skip if registers are not equal
      instructionDecoded.operation = operations.skipIfRegistersNotEqual
      instructionDecoded.parameters = [secondNibble, thirdNibble]
      break
    case 0xA:
      // set the index register (used by display/draw)
      instructionDecoded.operation = operations.setIndexRegister
      instructionDecoded.parameters.push(instruction & 0x0FFF)
      break
    case 0xB:
      // jump to address + V0
      instructionDecoded.operation = operations.jumpAddressPlusV0
      instructionDecoded.parameters.push(instruction & 0x0FFF)
      break
    case 0xC:
      // store random number from 0 to 0x00FF into VX
      instructionDecoded.operation = operations.generateRandom
      instructionDecoded.parameters = [secondNibble, instruction * 0x00FF]
      break
    case 0xD:
      // display / draw
      instructionDecoded.operation = operations.displayDraw
      instructionDecoded.parameters = [secondNibble, thirdNibble, fourthNibble]
      break
    case 0xE:
      switch (instruction & 0x00FF) {
        // skip instruction if key is pressed
        case 0x9E:
          instructionDecoded.operation = operations.skipIfKeyPressed
          instructionDecoded.parameters.push(secondNibble)
          break
        // skip instruction if key is not pressed
        case 0xA1:
          instructionDecoded.operation = operations.skipIfKeyNotPressed
          instructionDecoded.parameters.push(secondNibble)
          break
      }
      break
    case 0xF:
      switch (instruction & 0x00FF) {
        case 0x07:
          // set VX to the value of the delay timer
          instructionDecoded.operation = operations.setRegisterToDelayTimer
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x0A:
          // block execution until key is pressed
          instructionDecoded.operation = operations.waitForKey
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x15:
          // set the delay timer to value in VX
          instructionDecoded.operation = operations.setDelayTimerToRegisterValue
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x18:
          // set the sound timer to value in VX
          instructionDecoded.operation = operations.setSoundTimerToRegisterValue
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x1E:
          // add to Index
          instructionDecoded.operation = operations.addToIndexRegister
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x29:
          // set index to font address
          instructionDecoded.operation = operations.setIndexToFontAddress
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x33:
          // binary decimal conversion
          instructionDecoded.operation = operations.binaryDecimalConversion
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x55:
          // store into memory
          instructionDecoded.operation = operations.storeIntoMemory
          instructionDecoded.parameters.push(secondNibble)
          break
        case 0x65:
          // read from memory
          instructionDecoded.operation = operations.readFromMemory
          instructionDecoded.parameters.push(secondNibble)
          break
      }
      break
    default:
      throw new Error(`Execution failed with instruction ${instruction.toString(16)}`)
  }

  return instructionDecoded
}
