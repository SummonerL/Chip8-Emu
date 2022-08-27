/**
 * The Chip8 CPU - The brain of the emulator
 */

export class CPU {
  private static _instance: CPU

  // 16 general purpose 8-bit memory registers
  private readonly registers: Int8Array = new Int8Array(0x10)

  // single 16-bit register which stores memory addresses (up to 0xFFF)
  private readonly index: Int16Array = new Int16Array(0x01)

  // single 16-bit register which stores address of next program instruction
  private readonly programCounter: Int16Array = new Int16Array(0x01)

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
