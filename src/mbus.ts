/**
 * The Chip8 Memory Bus - Addresses 0x000 to 0xFFF
 */
import { CPU } from './cpu'

// chip-8 reserves 0x200 - 0xFFF for program instructions
const PROGRAM_START_ADDRESS = 0x200

export class MemoryBus {
  private static _instance: MemoryBus

  private readonly _memory: Uint8Array = new Uint8Array(0xFFF)

  private constructor () { }

  static get instance (): MemoryBus {
    if (MemoryBus._instance === undefined) {
      MemoryBus._instance = new MemoryBus()
    }

    return MemoryBus._instance
  }

  get status (): string {
    return 'Am Memory Bus'
  }

  get memory (): Uint8Array {
    return this._memory
  }

  // load program into memory
  public loadProgram (buffer: Buffer): boolean {
    let currentAddress = PROGRAM_START_ADDRESS

    buffer.forEach((byte: number) => {
      this.memory[currentAddress] = byte
      currentAddress++

      if (currentAddress > 0xFFF) {
        return false
      }
    })

    // set the program counter to 0x200
    CPU.instance.programCounter = PROGRAM_START_ADDRESS

    // start cycling the CPU
    CPU.instance.cycle()

    return true
  }
}
