import { Screen } from './screen'
import { CPU } from './cpu'

const clearScreen = (): void => {
  Screen.instance.clearDisplay()
}

const jumpAddress = (address: number): void => {
  CPU.instance.programCounter = address
}

const setRegister = (register: number, value: number): void => {
  CPU.instance.setRegister(register, value)
}

const addToRegister = (register: number, value: number): void => {
  CPU.instance.addToRegister(register, value)
}

const setIndexRegister = (address: number): void => {
  CPU.instance.index = address
}

const displayDraw = (): void => {
  
}

export { clearScreen, jumpAddress, setRegister, addToRegister, setIndexRegister }
