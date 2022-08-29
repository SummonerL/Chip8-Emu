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
    this._server = this.initializeServer()
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

  initializeServer (): http.Server {
    const files = new Server('./frontend_build/')

    const server: http.Server = http.createServer((req, res) => {
      files.serve(req, res)
    })

    server.listen(SERVER_PORT)

    return server
  }
}
