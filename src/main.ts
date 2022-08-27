/**
 * Chip-8 Emulator - Main Class
 */

import * as fs from 'fs'
import * as path from 'path'
import { MemoryBus } from './mbus'

export class Emulator {
  private static _instance: Emulator

  private readonly memory: Int8Array = new Int8Array(0xFFF)

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
    const romReadStream = fs.createReadStream(path.resolve('./game_roms/tank.ch8'))

    romReadStream.on('data', (chunk: Buffer) => {
      console.log('data :', chunk, chunk.length)

      MemoryBus.instance.loadProgram(chunk)
    })
  }

  get status (): string {
    return 'Am an Emulator'
  }
}

const emuStart: Emulator = Emulator.instance
console.log(emuStart.status)
