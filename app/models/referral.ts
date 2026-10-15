import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import PayoutBatch from '#models/payout_batch'

export default class Referral extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare referrerId: string

  @column()
  declare referredId: string

  @column()
  declare referralCode: string

  @column({ columnName: 'commission_amount' })
  declare commissionAmount: number

  @column()
  declare status: 'pending' | 'approved' | 'disbursed'

  @column()
  declare payoutBatchId: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(referral: Referral) {
    if (!referral.id) {
      referral.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'referrerId',
  })
  declare referrer: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'referredId',
  })
  declare referred: BelongsTo<typeof User>

  @belongsTo(() => PayoutBatch, {
    foreignKey: 'payoutBatchId',
  })
  declare payoutBatch: BelongsTo<typeof PayoutBatch>
}
