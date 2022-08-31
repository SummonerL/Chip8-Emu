/**
 * The Chip8 Memory Bus - Addresses 0x000 to 0xFFF
 */
import { CPU } from '.'

// chip-8 reserves 0x200 - 0xFFF for program instructions
const PROGRAM_START_ADDRESS = 0x200

// chip-8 preloads a fontset into memory for use by the program + index register
// we'll save this to 0x50 - 0x09F
const FONTSET_START_ADDRESS = 0x50
const FONTSET: Uint8Array = new Uint8Array([
  0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
  0x20, 0x60, 0x20, 0x20, 0x70, // 1
  0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
  0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
  0x90, 0x90, 0xF0, 0x10, 0x10, // 4
  0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
  0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
  0xF0, 0x10, 0x20, 0x40, 0x40, // 7
  0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
  0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
  0xF0, 0x90, 0xF0, 0x90, 0x90, // A
  0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
  0xF0, 0x80, 0x80, 0x80, 0xF0, // C
  0xE0, 0x90, 0x90, 0x90, 0xE0, // D
  0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
  0xF0, 0x80, 0xF0, 0x80, 0x80 // F
])

export class MemoryBus {
  private static _instance: MemoryBus

  private readonly _memory: Uint8Array = new Uint8Array(0xFFF)

  // for debugging purposes. We can use this to log the memory at program location 0x200 -> X
  private _programLastAddress: number

  private constructor () {
    // load fontset into memory
    FONTSET.forEach((fontByte: number, index) => {
      this._memory[FONTSET_START_ADDRESS + index] = fontByte
    })
  }

  static get instance (): MemoryBus {
    if (MemoryBus._instance === undefined) {
      MemoryBus._instance = new MemoryBus()
    }

    return MemoryBus._instance
  }

  get memory (): Uint8Array {
    return this._memory
  }

  get programLastAddress (): number {
    return this._programLastAddress
  }

  set programLastAddress (address: number) {
    this._programLastAddress = address
  }

  // load program into memory
  public loadProgram (buffer: Uint8Array): boolean {
    buffer.forEach((byte: number, index: number) => {
      this.memory[PROGRAM_START_ADDRESS + index] = byte

      this.programLastAddress = PROGRAM_START_ADDRESS + index

      if (PROGRAM_START_ADDRESS + index > 0xFFF) {
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
