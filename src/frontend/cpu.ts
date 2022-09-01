/**
 * The Chip8 CPU - The brain of the emulator
 */

import { MemoryBus, Screen, decode, Instruction } from '.'

const SINGLE_INDEX = 0x00
const INCREMENT = 2

export class CPU {
  private static _instance: CPU

  // 16 general purpose 8-bit memory registers
  private readonly registers: Uint8Array = new Uint8Array(0x10)

  // single 16-bit register which stores memory addresses (up to 0xFFF)
  private readonly _index: Uint16Array = new Uint16Array(0x01)

  // single 16-bit register which stores address of current program instruction
  private readonly _programCounter: Uint16Array = new Uint16Array(0x01)

  // used with the op CALL to store the address of the current instruction (PC)
  // we will rely on this when the RET operation is executed to return to this address
  // using this, we can essentially have a maximum of 16 nested subroutines
  private readonly callStack: Uint16Array = new Uint16Array(0x10)

  // indicates the current top of the call stack. Incremented with CALL and decremented
  // with RET. After decrementation, the current address is copied to the PC
  private readonly stackPointer: Uint8Array = new Uint8Array(0x01)

  // inactive when at 0. Otherwise, the value will decrement at a rate of 60hz (roughly 16.6 ms)
  private readonly delayTimer: Uint8Array = new Uint8Array(0x01)

  // same as the delay timer. Emits a single tone as long as the value is non-Zero
  private readonly soundTimer: Uint8Array = new Uint8Array(0x01)

  private constructor () {
    // initialize screen Singleton
    console.log(Screen.instance.created)
  }

  static get instance (): CPU {
    if (CPU._instance === undefined) {
      CPU._instance = new CPU()
    }

    return CPU._instance
  }

  get programCounter (): number {
    return this._programCounter[SINGLE_INDEX]
  }

  set programCounter (address: number) {
    this._programCounter[SINGLE_INDEX] = address
  }

  get index (): number {
    return this._index[SINGLE_INDEX]
  }

  set index (address: number) {
    this._index[SINGLE_INDEX] = address
  }

  public setRegister (register: number, value: number): void {
    this.registers[register] = value
  }

  public addToRegister (register: number, value: number): void {
    this.registers[register] += value
  }

  private fetch (): number {
    const memory = MemoryBus.instance.memory

    const chunk1: number = memory[this._programCounter[SINGLE_INDEX]]
    const chunk2: number = memory[this._programCounter[SINGLE_INDEX] + 1]

    this.increment(INCREMENT)

    /**
     *  We'll need to bit-shift the first chunk, so that it's not calculated as a 2-digit Hex
     *  For example: 0xA22A = 41514, but 0xA2 = 162. Therefore, 0xA2 + 0x2A != 0xA22A.
     *  Bit-shifting the first chunk will result in 0xA200 + 0x2A, which is what we want
     * */
    return (chunk1 << 8) + chunk2
  }

  private decode (instruction: number): Instruction {
    /**
     * We need to determine, based off of the byte data, what instruction should be performed.
     * For this, we'll use the decoder util
     */
    return decode(instruction)
  }

  private execute (operationData: Instruction): void {
    /**
     * Finally, we execute the operatin returned by the decoder
     */
    operationData.operation.apply(this, operationData.parameters)
  }

  private increment (amount: number): void {
    this._programCounter[SINGLE_INDEX] += amount
  }

  public cycle (): void {
    console.log('Begin Cycling...')

    while (this._programCounter[SINGLE_INDEX] <= MemoryBus.instance.programLastAddress) {
      // instruction
      const address: number = this._programCounter[SINGLE_INDEX]
      const instruction: number = this.fetch()

      const operationData = this.decode(instruction)

      console.log(`LINE ${address}: ${instruction.toString(16)} - ${operationData.operation.toString()}`)

      this.execute(operationData)
    }

    console.log('Program Exited')
  }
}
