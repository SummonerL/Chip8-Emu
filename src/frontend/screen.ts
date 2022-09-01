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

  public clearDisplay (): void {
    this._pixels.forEach(element => {
      element.classList.remove('on')
    })
  }

  public drawSprite (x: number, y: number, spriteData: Uint8Array): boolean {
    // sanitize the coordinates (starting positions can wrap. i.e. 68 = 5)
    const xCoordinate = x % SCREEN_WIDTH
    const yCoordinate = y % SCREEN_HEIGHT
    let startingPixelOn: boolean = false
    let setVF: boolean = false

    spriteData.forEach((spriteRow: number, i: number) => {
      for (let j = 0; j < 8; j++) {
        // get the pixel from the binary value of this sprite row (i.e. (1)1101110)
        const pixel = (spriteRow >> j) & 0x1

        // because the pixels are read from right -> left, we need to start at the rightmost coordinate (hence the 7)
        const pixelCancelled: boolean = this.setPixel(xCoordinate + (7 - j), yCoordinate + i, Boolean(pixel))

        // if the pixel at coordinates x,y are ON and the current pixel was cancelled, we need to set VF to 1
        if (pixelCancelled && startingPixelOn) {
          setVF = true
        }

        // determine if the starting coordinate is ON or OFF
        if (i === 0 && j === 0) {
          startingPixelOn = (Boolean(pixel) && !pixelCancelled)
        }
      }
    })

    return setVF
  }

  // returns true if the pixel was turned OFF
  public setPixel (x: number, y: number, value: boolean): boolean {
    // get the linear value of these coordinates
    const pixelNumber: number = (y * SCREEN_WIDTH) + x

    const pixelElement = this._pixels[pixelNumber]
    const currentValue: boolean = pixelElement.classList.contains('on')
    let pixelCancelled: boolean = false

    // turn OFF the pixel
    if (currentValue && value) {
      pixelElement.classList.remove('on')
      pixelCancelled = true
    } else if (value) {
      // turn ON the pixel
      pixelElement.classList.add('on')
    } else if (!value) {
      // turn the pixel OFF
      pixelElement.classList.remove('on')
    }

    return pixelCancelled
  }

  get created (): string {
    return 'Screen Initialized'
  }
}
