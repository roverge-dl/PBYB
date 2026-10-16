import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * GuestMiddleware redirects authenticated users away from guest-only pages
 * such as /login, /get-started, and /register to /referrals.
 */
export default class GuestMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const isAuth = await ctx.auth.use('web').check()

    if (isAuth) {
      if (ctx.request.accepts(['html'])) {
        return ctx.response.redirect('/referrals')
      }
      return ctx.response.ok({
        status: 'success',
        message: 'Already authenticated',
        redirectTo: '/referrals',
      })
    }

    return next()
  }
}
