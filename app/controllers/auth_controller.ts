import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import GoogleAuthService from '#services/google_auth_service'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  googleAuthSchema,
} from '#validators/auth'

@inject()
export default class AuthController {
  constructor(
    protected authService: AuthService,
    protected googleAuthService: GoogleAuthService
  ) {}

  /**
   * Handle user registration
   */
  async register({ request, response, auth }: HttpContext) {
    try {
      const data = request.only([
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'password',
        'role',
        'referralCode',
      ])

      const validatedData = await registerSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Registration Failed',
        })
      }

      const { user } = await this.authService.register(data)

      // Log user into session
      await auth.use('web').login(user)

      return response.ok({
        status: 'success',
        message: 'Registration successful',
        data: {
          user,
          requiresVerification: true,
        },
      })
    } catch (error: any) {
      console.error('Registration error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Registration failed. Please try again later.',
        error: error.message,
      })
    }
  }

  /**
   * Handle email verification via OTP
   */
  async verifyEmail({ request, response, auth }: HttpContext) {
    try {
      const { email, otp } = request.only(['email', 'otp'])
      if (!email || !otp) {
        return response.badRequest({
          status: 'fail',
          message: 'Email and verification code are required.',
        })
      }

      const user = await this.authService.verifyEmail(email, otp)

      // Ensure user is logged into session
      await auth.use('web').login(user)

      return response.ok({
        status: 'success',
        message: 'Email verified successfully!',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified,
            isPaid: user.isPaid,
          },
        },
      })
    } catch (error: any) {
      console.error('Verify email error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Verification failed. Please check the code and try again.',
        error: error.message,
      })
    }
  }

  /**
   * Resend email verification OTP code
   */
  async resendVerification({ request, response }: HttpContext) {
    try {
      const { email } = request.only(['email'])
      if (!email) {
        return response.badRequest({
          status: 'fail',
          message: 'Email is required.',
        })
      }

      await this.authService.sendEmailVerificationOtp(email)

      return response.ok({
        status: 'success',
        message: 'Verification code resent successfully.',
      })
    } catch (error: any) {
      console.error('Resend verification error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to resend code.',
        error: error.message,
      })
    }
  }

  /**
   * Handle user login
   */
  async login({ request, response, auth }: HttpContext) {
    try {
      const data = request.only(['email', 'password'])

      const validatedData = await loginSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Login Failed',
        })
      }

      const { user } = await this.authService.login(data)

      // Log user into session
      await auth.use('web').login(user)

      return response.ok({
        status: 'success',
        message: 'Login successful',
        data: {
          user,
        },
      })
    } catch (error: any) {
      console.error('Login error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Login failed. Please try again later.',
        error: error.message,
      })
    }
  }

  /**
   * Handle Google SSO login & registration
   */
  async googleAuth({ request, response, auth }: HttpContext) {
    try {
      const data = request.only(['idToken', 'role', 'referralCode'])

      const validatedData = await googleAuthSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Google Authentication Failed',
        })
      }

      const result = await this.googleAuthService.authenticate(data)

      if (result.requiresRoleSelection) {
        return response.ok({
          status: 'success',
          message: 'Role selection required for new user',
          data: {
            requiresRoleSelection: true,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
          },
        })
      }

      const { user, isNew } = result as { user: any; isNew: boolean }

      // Log user into session
      await auth.use('web').login(user)

      return response.ok({
        status: 'success',
        message: isNew ? 'Google registration successful' : 'Google login successful',
        data: {
          user,
          isNew,
        },
      })
    } catch (error: any) {
      console.error('Google auth error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Google authentication failed.',
        error: error.message,
      })
    }
  }

  /**
   * Handle user logout
   */
  async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('web').logout()

      return response.ok({
        status: 'success',
        message: 'Logged out successfully',
      })
    } catch (error: any) {
      console.error('Logout error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to logout. Please try again later.',
        error: error.message,
      })
    }
  }

  /**
   * Request password reset OTP
   */
  async forgotPassword({ request, response }: HttpContext) {
    try {
      const data = request.only(['email'])

      const validatedData = await forgotPasswordSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Forgot Password Request Failed',
        })
      }

      await this.authService.forgotPassword(data.email)

      return response.ok({
        status: 'success',
        message: 'If the email exists, a verification code has been sent.',
      })
    } catch (error: any) {
      console.error('Forgot password error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Forgot password request failed.',
        error: error.message,
      })
    }
  }

  /**
   * Reset password with OTP
   */
  async resetPassword({ request, response }: HttpContext) {
    try {
      const data = request.only(['email', 'otp', 'password'])

      const validatedData = await resetPasswordSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Reset Password Failed',
        })
      }

      await this.authService.resetPassword(data)

      return response.ok({
        status: 'success',
        message: 'Password reset successfully. You can now login.',
      })
    } catch (error: any) {
      console.error('Reset password error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Reset password failed.',
        error: error.message,
      })
    }
  }

  /**
   * Change password for logged-in user
   */
  async changePassword({ auth, request, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const data = request.only(['oldPassword', 'newPassword'])

      const validatedData = await changePasswordSchema(data)
      if (validatedData.status === false) {
        return response.status(409).json({
          status: 'fail',
          errors: validatedData.errors,
          message: 'Change Password Failed',
        })
      }

      await this.authService.changePassword(user, data)

      return response.ok({
        status: 'success',
        message: 'Password changed successfully.',
      })
    } catch (error: any) {
      console.error('Change password error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Password change failed.',
        error: error.message,
      })
    }
  }

  /**
   * Get authenticated user profile
   */
  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.getUserOrFail()
      const fullUser = await this.authService.getMe(user.id)

      return response.ok({
        status: 'success',
        message: 'Profile retrieved successfully',
        data: {
          user: fullUser,
        },
      })
    } catch (error: any) {
      console.error('Get profile error:', error)
      return response.badRequest({
        status: 'fail',
        message: error.message || 'Failed to retrieve profile.',
        error: error.message,
      })
    }
  }
}
