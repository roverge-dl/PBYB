import { defineConfig } from '@adonisjs/core/bodyparser'

export default defineConfig({
  allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  json: {
    encoding: 'utf-8',
    limit: '20mb',
    strict: true,
    types: [
      'application/json',
      'application/json-patch+json',
      'application/vnd.api+json',
      'application/csp-report',
    ],
  },
  form: {
    encoding: 'utf-8',
    limit: '1mb',
    types: ['application/x-www-form-urlencoded'],
  },
  multipart: {
    autoProcess: true,
    processManually: [],
    convertEmptyStringsToNull: true,
    maxFields: 1000,
    limit: '20mb',
    types: ['multipart/form-data'],
  },
})
