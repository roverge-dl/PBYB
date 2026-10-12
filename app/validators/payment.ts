import { validate } from '#utils/buchi'

/**
 * Validation schema for initializing registration fee payment
 */
export const initializePaymentSchema = (data: any) => {
  return validate([
    {
      input: { value: data.email, field: 'email', type: 'text' },
      rules: { required: true, email: true },
      alias: 'Email address',
    },
    {
      input: { value: data.callbackUrl, field: 'callbackUrl', type: 'text' },
      rules: { min_length: 5 },
      alias: 'Callback URL',
    },
  ])
}

/**
 * Validation schema for verifying payment reference
 */
export const verifyPaymentSchema = (data: any) => {
  return validate([
    {
      input: { value: data.reference, field: 'reference', type: 'text' },
      rules: { required: true, min_length: 5 },
      alias: 'Payment reference',
    },
  ])
}
