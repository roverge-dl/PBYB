import { defineConfig } from '@adonisjs/inertia'

export default defineConfig({
  /**
   * Path to the Edge template that will be used as the root view
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all Inertia views
   */
  sharedData: {
    user: (ctx) => ctx.auth?.user,
    errors: (ctx) => ctx.session?.flashMessages.get('errors'),
    flash: (ctx) => ctx.session?.flashMessages.all(),
  },

  /**
   * Options passed to the SSR engine (if SSR enabled)
   */
  ssr: {
    enabled: false,
  },
})
