import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import BaseInertiaMiddleware from '@adonisjs/inertia/inertia_middleware'

import env from '#start/env'

export default class InertiaMiddleware extends BaseInertiaMiddleware {
  async share(ctx: HttpContext) {
    return {
      user: ctx.auth?.user,
      errors: ctx.session?.flashMessages.get('errors'),
      flash: ctx.session?.flashMessages.all(),
      googleClientId: env.get('GOOGLE_WEB_CLIENT_ID', ''),
    }
  }

  async handle(ctx: HttpContext, next: NextFn) {
    await this.init(ctx)
    const output = await next()
    this.dispose(ctx)
    return output
  }
}
