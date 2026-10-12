import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Referral from '#models/referral'

export default class PayoutBatch extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare batchReference: string

  @column()
  declare totalAmount: number

  @column()
  declare totalRecipients: number

  @column()
  declare status: 'pending' | 'approved' | 'disbursed' | 'rejected'

  @column()
  declare approvedBy: string | null

  @column.dateTime()
  declare approvedAt: DateTime | null

  @column()
  declare csvExportUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(batch: PayoutBatch) {
    if (!batch.id) {
      batch.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'approvedBy',
  })
  declare approver: BelongsTo<typeof User>

  @hasMany(() => Referral, {
    foreignKey: 'payoutBatchId',
  })
  declare referrals: HasMany<typeof Referral>
}
