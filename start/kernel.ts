import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'

/**
 * The server middleware stack runs middleware on all the HTTP requests
 */
server.use([
  () => import('@adonisjs/cors/cors_middleware'),
  () => import('@adonisjs/static/static_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP requests with a registered route
 */
router.use([
  () => import('@adonisjs/core/bodyparser_middleware'),
  () => import('@adonisjs/session/session_middleware'),
  () => import('@adonisjs/shield/shield_middleware'),
  () => import('@adonisjs/auth/initialize_auth_middleware'),
])

/**
 * Named middleware collection explicitly assigned to routes
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
})
