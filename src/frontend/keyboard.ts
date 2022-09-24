/**
 * Chip-8 Emulator - Keyboard Class
 */

/**
 * The Chip-8 keyboard uses the following layout:
 *
 *    1  2  3  C
 *    4  5  6  D
 *    7  8  9  E
 *    A  0  B  F
 *
 * We'll map these to the set of keys on the left side of a standard keyboard
 */
const KEYS: string[] = [
  '1', '2', '3', '4',
  'q', 'w', 'e', 'r',
  'a', 's', 'd', 'f',
  'z', 'x', 'c', 'v'
]

export class Keyboard {
  private static _instance: Keyboard

  // keep track of the keys that are currently pressed
  private readonly keysPressed: Uint8Array = new Uint8Array(0x10)

  private constructor () {
    // set each key to 'unpressed' state
    this.keysPressed.fill(0x0)

    // establish key event listeners
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      const keyIndex = KEYS.indexOf(event.key)
      if (keyIndex >= 0) {
        this.keysPressed[keyIndex] = 0x1
      }
    })

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      const keyIndex = KEYS.indexOf(event.key)
      if (keyIndex >= 0) {
        this.keysPressed[keyIndex] = 0x0
      }
    })
  }

  static get instance (): Keyboard {
    if (Keyboard._instance === undefined) {
      Keyboard._instance = new Keyboard()
    }

    return Keyboard._instance
  }

  public isPressed (key: number): boolean {
    return (this.keysPressed[key] === 0x1)
  }

  public getLastPressed (): number {
    return this.keysPressed.lastIndexOf(0x1)
  }

  get created (): string {
    return 'Keyboard Initialized...'
  }
}
