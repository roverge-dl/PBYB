import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * PaidMiddleware gates access to the dashboard and post-signup features.
 * Without completing the ₦5,000 membership payment, users cannot access the dashboard/home page.
 */
export default class PaidMiddleware {
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

    const user = ctx.auth.use('web').user!

    // Payment is ONLY required for pregnant mothers. Affiliates and admins are exempt.
    if (user.role === 'pregnant_mum' && !user.isPaid) {
      if (ctx.request.accepts(['html'])) {
        return ctx.response.redirect('/payment')
      }
      return ctx.response.status(402).json({
        status: 'fail',
        message: 'Payment required. Pay the ₦5,000 membership fee to access this feature.',
        code: 'PAYMENT_REQUIRED',
        redirectTo: '/payment',
      })
    }

    return next()
  }
}
