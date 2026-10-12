import { validate } from '#utils/buchi'

/**
 * Validation schema for user registration (Pregnant Mums & Nurses)
 */
export const registerSchema = (data: any) => {
  return validate([
    {
      input: { value: data.firstName, field: 'firstName', type: 'text' },
      rules: { required: true, min_length: 2 },
      alias: 'First name',
    },
    {
      input: { value: data.lastName, field: 'lastName', type: 'text' },
      rules: { required: true, min_length: 2 },
      alias: 'Last name',
    },
    {
      input: { value: data.email, field: 'email', type: 'text' },
      rules: { required: true, email: true, unique: 'users' },
      alias: 'Email address',
    },
    {
      input: { value: data.phoneNumber, field: 'phoneNumber', type: 'text' },
      rules: { numeric: true, min_length: 10, max_length: 15 },
      alias: 'Phone number',
    },
    {
      input: { value: data.password, field: 'password', type: 'text' },
      rules: {
        required: true,
        min_length: 8,
        must_have_number: true,
        has_special_character: true,
      },
      alias: 'Password',
    },
    {
      input: { value: data.role, field: 'role', type: 'text' },
      rules: { required: true, in: ['pregnant_mum', 'nurse'] },
      alias: 'Role',
    },
    {
      input: { value: data.referralCode, field: 'referralCode', type: 'text' },
      rules: { min_length: 4, max_length: 12 },
      alias: 'Referral code',
    },
  ])
}

/**
 * Validation schema for user login
 */
export const loginSchema = (data: any) => {
  return validate([
    {
      input: { value: data.email, field: 'email', type: 'text' },
      rules: { required: true, email: true },
      alias: 'Email address',
    },
    {
      input: { value: data.password, field: 'password', type: 'text' },
      rules: { required: true },
      alias: 'Password',
    },
  ])
}

/**
 * Validation schema for requesting password reset OTP
 */
export const forgotPasswordSchema = (data: any) => {
  return validate([
    {
      input: { value: data.email, field: 'email', type: 'text' },
      rules: { required: true, email: true },
      alias: 'Email address',
    },
  ])
}

/**
 * Validation schema for resetting password using OTP
 */
export const resetPasswordSchema = (data: any) => {
  return validate([
    {
      input: { value: data.email, field: 'email', type: 'text' },
      rules: { required: true, email: true },
      alias: 'Email address',
    },
    {
      input: { value: data.otp, field: 'otp', type: 'text' },
      rules: { required: true, char_length: 6 },
      alias: 'Verification code',
    },
    {
      input: { value: data.password, field: 'password', type: 'text' },
      rules: {
        required: true,
        min_length: 8,
        must_have_number: true,
        has_special_character: true,
      },
      alias: 'New password',
    },
  ])
}

/**
 * Validation schema for changing password when authenticated
 */
export const changePasswordSchema = (data: any) => {
  return validate([
    {
      input: { value: data.oldPassword, field: 'oldPassword', type: 'text' },
      rules: { required: true },
      alias: 'Current password',
    },
    {
      input: { value: data.newPassword, field: 'newPassword', type: 'text' },
      rules: {
        required: true,
        min_length: 8,
        must_have_number: true,
        has_special_character: true,
      },
      alias: 'New password',
    },
  ])
}

/**
 * Validation schema for Google SSO
 */
export const googleAuthSchema = (data: any) => {
  return validate([
    {
      input: { value: data.idToken, field: 'idToken', type: 'text' },
      rules: { required: true },
      alias: 'Google ID Token',
    },
    {
      input: { value: data.role, field: 'role', type: 'text' },
      rules: { in: ['pregnant_mum', 'nurse'] },
      alias: 'Role',
    },
  ])
}
