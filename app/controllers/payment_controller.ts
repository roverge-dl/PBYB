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
}
