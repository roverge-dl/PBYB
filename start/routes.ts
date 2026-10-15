import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// ==========================================
// Inertia Web Views
// ==========================================
router.get('/', '#controllers/web_controller.getStarted').as('web.home')
router.get('/get-started', '#controllers/web_controller.getStarted').as('web.get_started')
router.get('/register', '#controllers/web_controller.register').as('web.register')
router.get('/login', '#controllers/web_controller.login').as('web.login')
router.get('/forgot-password', '#controllers/web_controller.forgotPassword').as('web.forgot_password')
router.get('/verify-otp', '#controllers/web_controller.verifyOtp').as('web.verify_otp')
router.get('/verify-email', '#controllers/web_controller.verifyEmail').as('web.verify_email')
router.get('/reset-password', '#controllers/web_controller.resetPassword').as('web.reset_password')
router.get('/payment', '#controllers/web_controller.payment').as('web.payment')
router
  .get('/dashboard', '#controllers/web_controller.dashboard')
  .as('web.dashboard')
  .use(middleware.auth())
  .use(middleware.paid())
router
  .get('/home', '#controllers/web_controller.dashboard')
  .as('web.home_dashboard')
  .use(middleware.auth())
  .use(middleware.paid())
router.get('/leaderboard', '#controllers/web_controller.leaderboard')
router
  .get('/dashboard/pre-challenge', '#controllers/web_controller.preChallengeDashboard')
  .use(middleware.auth())
  .use(middleware.paid())
router.get('/design-system', '#controllers/web_controller.designSystem')

// ==========================================
// JSON API Routes
// ==========================================
router.group(() => {
  // Public Guest Auth Routes
  router.group(() => {
    router.post('/register', '#controllers/auth_controller.register')
    router.post('/verify-email', '#controllers/auth_controller.verifyEmail')
    router.post('/resend-verification', '#controllers/auth_controller.resendVerification')
    router.post('/login', '#controllers/auth_controller.login')
    router.post('/google', '#controllers/auth_controller.googleAuth')
    router.post('/forgot-password', '#controllers/auth_controller.forgotPassword')
    router.post('/reset-password', '#controllers/auth_controller.resetPassword')
  }).prefix('/auth')

  // Public Referral & Leaderboard Routes
  router.get('/referrals/leaderboard', '#controllers/referral_controller.leaderboard')
  router.post('/referrals/verify', '#controllers/referral_controller.verifyCode')

  // Payment Endpoints
  router.post('/payments/initialize', '#controllers/payment_controller.initialize')
  router.post('/payments/verify', '#controllers/payment_controller.verify')
  router.post('/payments/webhook', '#controllers/payment_controller.webhook')
  router.post('/payments/simulate-success', '#controllers/payment_controller.simulateSuccess')

  // Protected Authenticated Routes
  router.group(() => {
    router.get('/auth/me', '#controllers/auth_controller.me')
    router.post('/auth/logout', '#controllers/auth_controller.logout')
    router.post('/auth/change-password', '#controllers/auth_controller.changePassword')
  }).use(middleware.auth())
}).prefix('/api/v1')
