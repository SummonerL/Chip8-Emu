import * as operations from './execute-utils'

export interface Instruction {
  operation: Function
}

export const decode = (instruction: number): Instruction => {
  return {
    operation: operations.clearScreen
  }
}
