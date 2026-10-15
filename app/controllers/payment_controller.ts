import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import RegistrationPaymentService from '#services/registration_payment_service'
import { initializePaymentSchema, verifyPaymentSchema } from '#validators/payment'

@inject()
export default class PaymentController {
  constructor(protected paymentService: RegistrationPaymentService) {}

  /**
   * Initialize Paystack registration payment
   */
  async initialize({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'callbackUrl'])

      const validatedData = await initializePaymentSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Payment Initialization Failed',
        })
      }

      const paymentResult = await this.paymentService.initializePayment(
        data.email,
        undefined,
        data.callbackUrl
      )

      return response.ok({
        status: 'success',
        message: 'Payment initialized successfully',
        data: paymentResult,
      })
    } catch (error: any) {
      console.error('Payment initialization error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Payment initialization failed. Please try again.',
        error: error.message,
      })
    }
  }

  /**
   * Verify Paystack registration payment
   */
  async verify({ request, response }: HttpContext) {
    try {
      const data = request.only(['reference'])

      const validatedData = await verifyPaymentSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Payment Verification Failed',
        })
      }

      const verificationResult = await this.paymentService.verifyPayment(data.reference)

      if (!verificationResult.verified) {
        return response.badRequest({
          status: 'fail',
          message: 'Payment verification failed at gateway.',
          data: verificationResult,
        })
      }

      return response.ok({
        status: 'success',
        message: 'Payment verified successfully',
        data: verificationResult,
      })
    } catch (error: any) {
      console.error('Payment verification error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Payment verification failed. Please try again.',
        error: error.message,
      })
    }
  }

  /**
   * Handle Paystack Webhook
   */
  async webhook({ request, response }: HttpContext) {
    try {
      const signature = request.header('x-paystack-signature') || ''
      const rawBody = JSON.stringify(request.body())
      const payload = request.body()

      await this.paymentService.handleWebhook(rawBody, signature, payload)

      return response.ok({
        status: 'success',
        message: 'Webhook processed successfully',
      })
    } catch (error: any) {
      console.error('Webhook processing error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Webhook processing failed',
        error: error.message,
      })
    }
  }

  /**
   * Simulate payment success in dev/demo mode
   */
  async simulateSuccess({ request, response, auth }: HttpContext) {
    try {
      let email = request.input('email')
      if (!email) {
        const isAuth = await auth.use('web').check()
        if (isAuth) {
          email = auth.use('web').user?.email
        }
      }

      if (!email) {
        return response.badRequest({
          status: 'fail',
          message: 'Email or active session is required to simulate payment.',
        })
      }

      const result = await this.paymentService.simulatePaymentSuccess(email)

      // Re-login user to refresh session with isPaid = true
      if (result?.user) {
        const User = (await import('#models/user')).default
        const user = await User.findBy('email', email.toLowerCase().trim())
        if (user) {
          await auth.use('web').login(user)
        }
      }

      return response.ok({
        status: 'success',
        message: 'Payment completed successfully!',
        data: result,
      })
    } catch (error: any) {
      console.error('Simulate payment error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to simulate payment.',
        error: error.message,
      })
    }
  }
}
