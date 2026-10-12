import crypto from 'node:crypto'
import env from '#start/env'

export interface PaystackInitializePayload {
  email: string
  amount: number // in Kobo (e.g. 500000 for NGN 5,000)
  reference: string
  callbackUrl?: string
  metadata?: Record<string, any>
}

export interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    id: number
    reference: string
    amount: number
    currency: string
    status: string
    paid_at: string | null
    customer: {
      email: string
    }
    metadata: Record<string, any>
  }
}

export default class PaystackService {
  private readonly baseUrl = 'https://api.paystack.co'
  private readonly secretKey = env.get('PAYSTACK_SECRET_KEY', '')

  private get headers() {
    return {
      'Authorization': `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error((data as any)?.message || 'Paystack API request failed')
      }
      return data as T
    } finally {
      clearTimeout(timeout)
    }
  }

  /**
   * Initializes a transaction with Paystack
   */
  async initialize(payload: PaystackInitializePayload): Promise<PaystackInitializeResponse> {
    return this.request<PaystackInitializeResponse>('/transaction/initialize', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        amount: payload.amount,
        reference: payload.reference,
        callback_url: payload.callbackUrl,
        metadata: payload.metadata,
      }),
    })
  }

  /**
   * Verifies a transaction by reference
   */
  async verify(reference: string): Promise<PaystackVerifyResponse> {
    return this.request<PaystackVerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
    })
  }

  /**
   * Verifies webhook signature against Paystack secret key
   */
  verifyWebhookSignature(rawBody: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(rawBody)
      .digest('hex')

    return hash === signature
  }
}
