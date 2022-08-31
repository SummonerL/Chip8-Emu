/**
 * Screen Class
 */

const SCREEN_ELEMENT_ID = 'chip8Display'
const SCREEN_WIDTH = 64
const SCREEN_HEIGHT = 32

export class Screen {
  private static _instance: Screen
  private readonly _screenElement: HTMLElement
  private readonly _pixels: HTMLElement[] = new Array(SCREEN_WIDTH * SCREEN_HEIGHT)

  private constructor () {
    this._screenElement = document.createElement('div')
    this._screenElement.id = SCREEN_ELEMENT_ID
    document.body.appendChild(this._screenElement)

    this.initializeDisplay()
  }

  static get instance (): Screen {
    if (Screen._instance === undefined) {
      Screen._instance = new Screen()
    }

    return Screen._instance
  }

  private initializeDisplay (): void {
    for (let i = 0; i < (SCREEN_WIDTH * SCREEN_HEIGHT); i++) {
      const pixel = document.createElement('div')
      pixel.id = `pixel_${i}`
      pixel.classList.add('pixel', 'on')
      this._screenElement.appendChild(pixel)
      this._pixels[i] = pixel
    }
  }

  get created (): string {
    return 'Screen Initialized'
  }
}
