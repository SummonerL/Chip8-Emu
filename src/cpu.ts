/**
 * The Chip8 CPU - The brain of the emulator
 */

export class CPU {
  private static _instance: CPU

  // 16 general purpose 8-bit memory registers
  private readonly registers: Int8Array = new Int8Array(0x10)

  // single 16-bit register which stores memory addresses (up to 0xFFF)
  private readonly index: Int16Array = new Int16Array(0x01)

  // single 16-bit register which stores address of current program instruction
  private readonly programCounter: Int16Array = new Int16Array(0x01)

  // used with the op CALL to store the address of the current instruction (PC)
  // we will rely on this when the RET operation is executed to return to this address
  // using this, we can essentially have a maximum of 16 nested subroutines
  private readonly callStack: Int16Array = new Int16Array(0x10)

  // indicates the current top of the call stack. Incremented with CALL and decremented
  // with RET. After decrementation, the current address is copied to the PC
  private readonly stackPointer: Int8Array = new Int8Array(0x01)

  // inactive when at 0. Otherwise, the value will decrement at a rate of 60hz (roughly 16.6 ms)
  private readonly delayTimer: Int8Array = new Int8Array(0x01)

  // same as the delay timer. Emits a single tone when timer reaches 0
  private readonly soundTimer: Int8Array = new Int8Array(0x01)

  private constructor () {
    this.listen()
  }

  static get instance (): CPU {
    if (CPU._instance === undefined) {
      CPU._instance = new CPU()
    }

    return CPU._instance
  }

  private listen (): void {
    console.log('Listening')
  }

  get status (): string {
    return 'Am CPU'
  }
}
