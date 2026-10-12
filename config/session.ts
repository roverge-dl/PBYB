import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, stores } from '@adonisjs/session'

export default defineConfig({
  enabled: true,
  cookieName: 'pbyb_session',
  clearWithBrowser: false,
  age: '7d',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: app.inProduction,
    sameSite: 'lax',
  },
  store: env.get('SESSION_DRIVER', 'cookie'),
  stores: {
    cookie: stores.cookie(),
    redis: stores.redis({
      connection: 'main',
    }),
  },
})
