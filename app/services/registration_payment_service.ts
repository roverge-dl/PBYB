import { inject } from '@adonisjs/core'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import User from '#models/user'
import Transaction from '#models/transaction'
import Referral from '#models/referral'
import PaystackService from '#services/paystack_service'
import MailService from '#services/mail_service'

const REGISTRATION_FEE_NAIRA = 5000
const REGISTRATION_FEE_KOBO = REGISTRATION_FEE_NAIRA * 100
const REFERRAL_COMMISSION_NAIRA = 1000 // Commission per paid referred participant

@inject()
export default class RegistrationPaymentService {
  constructor(
    protected paystackService: PaystackService,
    protected mailService: MailService
  ) {}

  /**
   * Initialize Paystack transaction for registration fee
   */
  async initializePayment(email: string, userId?: string, callbackUrl?: string) {
    const user = userId
      ? await User.findOrFail(userId)
      : await User.findByOrFail('email', email.toLowerCase().trim())

    const reference = `PBYB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

    // Create pending transaction in database
    const transaction = new Transaction()
    transaction.userId = user.id
    transaction.reference = reference
    transaction.amountKobo = REGISTRATION_FEE_KOBO
    transaction.amountNaira = REGISTRATION_FEE_NAIRA
    transaction.currency = 'NGN'
    transaction.purpose = 'registration_fee'
    transaction.gateway = 'paystack'
    transaction.status = 'pending'
    await transaction.save()

    const paystackResponse = await this.paystackService.initialize({
      email: user.email,
      amount: REGISTRATION_FEE_KOBO,
      reference,
      callbackUrl,
      metadata: {
        userId: user.id,
        transactionId: transaction.id,
        purpose: 'pbyb_registration_fee',
      },
    })

    return {
      authorizationUrl: paystackResponse.data.authorization_url,
      accessCode: paystackResponse.data.access_code,
      reference,
      amount: REGISTRATION_FEE_NAIRA,
    }
  }

  /**
   * Verify transaction after user completes payment
   */
  async verifyPayment(reference: string) {
    const verification = await this.paystackService.verify(reference)

    if (verification.data.status === 'success') {
      return await db.transaction(async (trx) => {
        const transaction = await Transaction.query({ client: trx })
          .where('reference', reference)
          .first()

        if (!transaction) {
          throw new Error(`Transaction with reference ${reference} not found`)
        }

        // Idempotency: if already processed, return success
        if (transaction.status === 'success') {
          return {
            verified: true,
            reference,
            amount: transaction.amountNaira,
            paidAt: transaction.paidAt,
          }
        }

        // 1. Update Transaction record
        transaction.useTransaction(trx)
        transaction.status = 'success'
        transaction.gatewayReference = (verification.data as any).gateway_response
        transaction.channel = (verification.data as any).channel
        transaction.paidAt = verification.data.paid_at ? DateTime.fromISO(verification.data.paid_at) : DateTime.now()
        transaction.metadata = verification.data.metadata
        await transaction.save()

        // 2. Mark User as paid
        const user = await User.query({ client: trx }).where('id', transaction.userId).firstOrFail()
        user.useTransaction(trx)
        user.isPaid = true
        await user.save()

        // 3. Activate pending referral attribution if exists
        const referral = await Referral.query({ client: trx })
          .where('referredId', user.id)
          .where('status', 'pending')
          .first()

        if (referral) {
          referral.useTransaction(trx)
          referral.status = 'approved'
          referral.commissionAmount = REFERRAL_COMMISSION_NAIRA
          await referral.save()
        }

        // 4. Send confirmation receipt email via AWS SES
        await this.mailService.sendRegistrationReceipt(
          user.email,
          user.fullName,
          REGISTRATION_FEE_NAIRA,
          reference
        )

        return {
          verified: true,
          reference,
          amount: transaction.amountNaira,
          email: user.email,
          paidAt: transaction.paidAt,
        }
      })
    }

    return {
      verified: false,
      status: verification.data.status,
      gatewayResponse: (verification.data as any).gateway_response,
    }
  }

  /**
   * Process incoming Paystack Webhook event
   */
  async handleWebhook(rawBody: string, signature: string, payload: any) {
    const isValidSignature = this.paystackService.verifyWebhookSignature(rawBody, signature)
    if (!isValidSignature) {
      throw new Error('Invalid webhook signature')
    }

    if (payload.event === 'charge.success') {
      const reference = payload.data?.reference
      if (reference) {
        await this.verifyPayment(reference)
      }
    }

    return { received: true }
  }

  /**
   * Helper to simulate payment completion in development / test environments
   */
  async simulatePaymentSuccess(userIdentifier: string) {
    return await db.transaction(async (trx) => {
      const isEmail = userIdentifier.includes('@')
      const user = isEmail
        ? await User.query({ client: trx }).where('email', userIdentifier.toLowerCase().trim()).first()
        : await User.query({ client: trx }).where('id', userIdentifier).first()

      if (!user) {
        throw new Error(`User ${userIdentifier} not found`)
      }

      const reference = `PBYB-DEMO-${Date.now()}`

      // Create or update successful transaction
      const transaction = new Transaction()
      transaction.useTransaction(trx)
      transaction.userId = user.id
      transaction.reference = reference
      transaction.amountKobo = REGISTRATION_FEE_KOBO
      transaction.amountNaira = REGISTRATION_FEE_NAIRA
      transaction.currency = 'NGN'
      transaction.purpose = 'registration_fee'
      transaction.gateway = 'paystack_demo'
      transaction.status = 'success'
      transaction.paidAt = DateTime.now()
      await transaction.save()

      // Mark user as paid & verified
      user.useTransaction(trx)
      user.isPaid = true
      user.isVerified = true
      await user.save()

      // Activate pending referral
      const referral = await Referral.query({ client: trx })
        .where('referredId', user.id)
        .where('status', 'pending')
        .first()

      if (referral) {
        referral.useTransaction(trx)
        referral.status = 'approved'
        referral.commissionAmount = REFERRAL_COMMISSION_NAIRA
        await referral.save()
      }

      return {
        verified: true,
        reference,
        amount: REGISTRATION_FEE_NAIRA,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isPaid: user.isPaid,
          isVerified: user.isVerified,
        },
      }
    })
  }
}
