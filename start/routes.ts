import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

router.group(() => {
  // Public Guest Auth Routes
  router.group(() => {
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/login', '#controllers/auth_controller.login')
    router.post('/google', '#controllers/auth_controller.googleAuth')
    router.post('/forgot-password', '#controllers/auth_controller.forgotPassword')
    router.post('/reset-password', '#controllers/auth_controller.resetPassword')
  }).prefix('/auth')

  // Public Referral & Leaderboard Routes
  router.get('/referrals/leaderboard', '#controllers/referral_controller.leaderboard')
  router.post('/referrals/verify', '#controllers/referral_controller.verifyCode')

  // Payment Webhook (unauthenticated, signature-verified)
  router.post('/payments/initialize', '#controllers/payment_controller.initialize')
  router.post('/payments/verify', '#controllers/payment_controller.verify')

  // Protected Authenticated Routes
  router.group(() => {
    router.get('/auth/me', '#controllers/auth_controller.me')
    router.post('/auth/logout', '#controllers/auth_controller.logout')
    router.post('/auth/change-password', '#controllers/auth_controller.changePassword')
  }).use(middleware.auth())
}).prefix('/api/v1')
