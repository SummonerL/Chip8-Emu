/**
 * Chip-8 Emulator - Main Class
 */
import { MemoryBus } from '.'

export class Emulator {
  private static _instance: Emulator

  private constructor () {
    this.loadRomFile()
  }

  static get instance (): Emulator {
    if (Emulator._instance === undefined) {
      Emulator._instance = new Emulator()
    }

    return Emulator._instance
  }

  public loadRomFile (): void {
    const xhr: XMLHttpRequest = new XMLHttpRequest()

    xhr.open('get', './IBM Logo.ch8', true)
    xhr.addEventListener('load', () => {
      const fileChunk: Uint8Array = new Uint8Array(xhr.response)

      MemoryBus.instance.loadProgram(fileChunk)
    })
    xhr.responseType = 'arraybuffer'
    xhr.send()
  }

  get created (): string {
    return 'Emulator Initialized...'
  }
}
