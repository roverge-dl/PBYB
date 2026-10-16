import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * MumOnlyMiddleware restricts competition/challenge routes exclusively to pregnant mothers.
 * Affiliates (nurses) are redirected to their dedicated referral page (/referrals).
 */
export default class MumOnlyMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const isAuth = await ctx.auth.use('web').check()

    if (!isAuth) {
      if (ctx.request.accepts(['html'])) {
        return ctx.response.redirect('/login')
      }
      return ctx.response.unauthorized({
        status: 'fail',
        message: 'Unauthorized access. Please login.',
      })
    }

    // Phase 2: Mum-only competition & dashboard routes are temporarily hidden. Redirect everyone to /referrals.
    if (ctx.request.accepts(['html'])) {
      return ctx.response.redirect('/referrals')
    }
    return ctx.response.ok({
      status: 'success',
      message: 'Competition routes are temporarily hidden for Phase 2.',
      redirectTo: '/referrals',
    })

    return next()
  }
}
