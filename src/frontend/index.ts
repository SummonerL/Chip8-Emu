/* eslint-disable @typescript-eslint/no-unused-vars */
import { Emulator } from './emulator'

export * from './cpu'
export { Emulator }
export * from './mbus'
export * from './screen'
export * from './keyboard'
export * from './decode-utils'
export * from './execute-utils'

// initializes Emulator Singleton
const emuStart = Emulator.instance
