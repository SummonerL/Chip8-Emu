/**
 * The Chip8 CPU - The brain of the emulator
 */

import { MemoryBus } from '.'

const SINGLE_INDEX = 0x00

export class CPU {
  private static _instance: CPU

  // 16 general purpose 8-bit memory registers
  private readonly registers: Uint8Array = new Uint8Array(0x10)

  // single 16-bit register which stores memory addresses (up to 0xFFF)
  private readonly index: Uint16Array = new Uint16Array(0x01)

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

  private constructor () { }

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

  private fetch (): string {
    const part1: string = MemoryBus.instance.memory[this._programCounter[SINGLE_INDEX]].toString(16)
    const part2: string = MemoryBus.instance.memory[this._programCounter[SINGLE_INDEX] + 1].toString(16)
    return part1 + part2
  }

  private decode (instruction: number): void {
    //
  }

  private increment (): void {
    this._programCounter[SINGLE_INDEX] += 2
  }

  public cycle (): void {
    console.log('Begin Cycling...')

    while (this._programCounter[SINGLE_INDEX] <= MemoryBus.instance.programLastAddress) {
      // instruction
      const address: number = this._programCounter[SINGLE_INDEX]
      const instruction: string = this.fetch()

      console.log(`LINE ${address}: ${instruction}`)

      // this.decode(instruction)

      // increment by 2
      this.increment()
    }

    console.log('Program Exited')
  }
}
