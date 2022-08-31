import { Screen } from './screen'

const clearScreen = (): void => {
  Screen.instance.clearDisplay()
}

export { clearScreen }
