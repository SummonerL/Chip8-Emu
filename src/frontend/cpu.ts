/**
 * The Chip8 CPU - The brain of the emulator
 */

import { clearInterval } from 'timers'
import { MemoryBus, Screen, decode, Instruction, Keyboard } from '.'

const SINGLE_INDEX = 0x00
const INCREMENT = 2
const CPU_CYCLE_TIME = 2 // in ms (roughly 500 Hz)
const TIMER_CYCLE_TIME = 16.67

export class CPU {
  private static _instance: CPU

  // 16 general purpose 8-bit memory registers
  private readonly registers: Uint8Array = new Uint8Array(0x10)

  // single 16-bit register which stores memory addresses (up to 0xFFF)
  private readonly _index: Uint16Array = new Uint16Array(0x01)

  // single 16-bit register which stores address of current program instruction
  private readonly _programCounter: Uint16Array = new Uint16Array(0x01)

  // used with the op CALL to store the address of the current instruction (PC)
  // we will rely on this when the RET operation is executed to return to this address.
  // using this, we can essentially have a maximum of 16 nested subroutines
  private readonly callStack: Uint16Array = new Uint16Array(0x10)

  // indicates the current top of the call stack. Incremented with CALL and decremented
  // with RET. After decrementation, the current address is copied to the PC
  private readonly stackPointer: Uint8Array = new Uint8Array(0x01)

  // inactive when at 0. Otherwise, the value will decrement at a rate of 60hz (roughly 16.6 ms)
  private readonly _delayTimer: Uint8Array = new Uint8Array(0x01)

  // same as the delay timer. Emits a single tone as long as the value is non-Zero
  private readonly _soundTimer: Uint8Array = new Uint8Array(0x01)

  private constructor () {
    // initialize screen Singleton
    console.log(Screen.instance.created)

    // initialize keyboard Singleton
    console.log(Keyboard.instance.created)

    // set the stack pointer to 0 (indicates the index of the top of the stack)
    this.stackPointer[SINGLE_INDEX] = 0x0

    // set the timers to 0
    this._delayTimer[SINGLE_INDEX] = 0x0
    this._delayTimer[SINGLE_INDEX] = 0x0
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

  get delayTimer (): number {
    return this._delayTimer[SINGLE_INDEX]
  }

  set delayTimer (value: number) {
    this._delayTimer[SINGLE_INDEX] = value
  }

  get soundTimer (): number {
    return this._soundTimer[SINGLE_INDEX]
  }

  set soundTimer (value: number) {
    this._soundTimer[SINGLE_INDEX] = value
  }

  public setRegister (register: number, value: number): void {
    this.registers[register] = value
  }

  public addToRegister (register: number, value: number): void {
    this.registers[register] += value
  }

  public getRegister (register: number): number {
    return this.registers[register]
  }

  public pushToStack (address: number): void {
    // push to the top of the call stack
    this.callStack[this.stackPointer[SINGLE_INDEX]] = address

    // increment the stack pointer
    this.stackPointer[SINGLE_INDEX] += 1
  }

  public popFromStack (): number {
    const poppedStackValue = this.callStack[this.stackPointer[SINGLE_INDEX]]

    // decrement the stack pointer
    if (this.stackPointer[SINGLE_INDEX] > 0x0) {
      this.stackPointer[SINGLE_INDEX] -= 1
    }

    return poppedStackValue
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

  public increment (amount: number): void {
    this._programCounter[SINGLE_INDEX] += amount
  }

  public async cycle (): Promise<any> {
    console.log('Begin Cycling...')

    // decrement timers at a rate of 60Hz (60 times per second)
    const clockInterval: NodeJS.Timer = setInterval(() => {
      if (this._delayTimer[SINGLE_INDEX] > 0x0) {
        this._delayTimer[SINGLE_INDEX] -= 0x1
      }

      if (this._soundTimer[SINGLE_INDEX] > 0x0) {
        this._soundTimer[SINGLE_INDEX] -= 0x1
      }
    }, TIMER_CYCLE_TIME)

    // cpu cycle
    while (this._programCounter[SINGLE_INDEX] <= MemoryBus.instance.programLastAddress) {
      // instruction
      // const address: number = this._programCounter[SINGLE_INDEX]
      const instruction: number = this.fetch()

      const operationData = this.decode(instruction)

      // console.log(`LINE ${address}: ${instruction.toString(16)} - ${operationData.operation.toString()}`)

      this.execute(operationData)

      await new Promise((resolve) => setTimeout(resolve, CPU_CYCLE_TIME))
    }

    // stop decrementing timers
    clearInterval(clockInterval)

    console.log('Program Exited')
  }
}
