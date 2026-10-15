import { defineConfig } from '@adonisjs/shield'

export default defineConfig({
  csp: {
    enabled: false,
    directives: {},
    reportOnly: false,
  },
  csrf: {
    enabled: false,
    exceptRoutes: ['/api/*'],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },
  contentTypeSniffing: {
    enabled: true,
  },
  xFrame: {
    enabled: true,
    action: 'DENY',
  },
})
