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
        // return from subroutine
        case 0xE:
          break
      }
      break
    case 0x1:
      // jump to memory address (set PC)
      instructionDecoded.operation = operations.jumpAddress
      instructionDecoded.parameters.push(instruction & 0x0FFF)
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
    case 0xA:
      // set the index register (used by display/draw)
      instructionDecoded.operation = operations.setIndexRegister
      instructionDecoded.parameters.push(instruction & 0x0FFF)
      break
  }

  return instructionDecoded
}
