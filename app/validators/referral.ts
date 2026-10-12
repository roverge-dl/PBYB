import { validate } from '#utils/buchi'

/**
 * Validation schema for tracking a referral attribution
 */
export const trackReferralSchema = (data: any) => {
  return validate([
    {
      input: { value: data.referralCode, field: 'referralCode', type: 'text' },
      rules: { required: true, min_length: 4, max_length: 12 },
      alias: 'Referral code',
    },
  ])
}
