/**
 * The Chip8 Memory Bus - Addresses 0x000 to 0xFFF
 */

export class MemoryBus {
  private static _instance: MemoryBus

  private readonly memory: Int8Array = new Int8Array(0xFFF)

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
}
