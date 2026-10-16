/*
|--------------------------------------------------------------------------
| The server file is used to start the HTTP server.
|--------------------------------------------------------------------------
*/

import 'reflect-metadata'
import '@poppinss/ts-exec'
import { Ignitor } from '@adonisjs/core'

const APP_ROOT = new URL('../', import.meta.url)
const IMPORTER = (filePath) => {
  if (filePath.startsWith('./') || filePath.startsWith('../')) {
    return import(new URL(filePath, APP_ROOT).href)
  }
  return import(filePath)
}

new Ignitor(APP_ROOT, { importer: IMPORTER })
  .tap((app) => {
    app.booting(async () => {
      await import('#start/env')
    })
  })
  .httpServer()
  .start()
