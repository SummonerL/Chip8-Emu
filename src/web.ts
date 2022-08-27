/**
 * A basic web server for our emulator. All code will be ran client-side
 */
import http from 'http'
import { Server } from 'node-static'

const SERVER_PORT = 3000

export class WebServer {
  private static _instance: WebServer

  private readonly _server: http.Server

  private constructor () {
    const files = new Server('./')

    this._server = http.createServer((req, res) => {
      files.serve(req, res)
    })

    this._server.listen(SERVER_PORT)
  }

  static get instance (): WebServer {
    if (WebServer._instance === undefined) {
      WebServer._instance = new WebServer()
    }

    return WebServer._instance
  }

  get server (): http.Server | null {
    return this._server
  }

  get status (): string {
    return 'Listening...'
  }
}
