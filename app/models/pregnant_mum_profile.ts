import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class PregnantMumProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare gestationalAgeWeeks: number | null

  @column.date()
  declare expectedDeliveryDate: DateTime | null

  @column()
  declare healthConsentAccepted: boolean

  @column.dateTime()
  declare consentAcceptedAt: DateTime | null

  @column()
  declare baselinePcv: number | null

  @column.date()
  declare baselinePcvDate: DateTime | null

  @column()
  declare baselinePcvImageUrl: string | null

  @column()
  declare baselinePcvRawOcr: Record<string, any> | null

  @column()
  declare completionPcv: number | null

  @column.date()
  declare completionPcvDate: DateTime | null

  @column()
  declare completionPcvImageUrl: string | null

  @column()
  declare completionPcvRawOcr: Record<string, any> | null

  @column()
  declare pcvTier: string | null

  @column()
  declare dailyWaterTargetLiters: number

  @column()
  declare dailyGreenTargetServings: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Calculates percentage growth in PCV from baseline to completion
   */
  get pcvGrowthPercentage(): number | null {
    if (this.baselinePcv && this.completionPcv && this.baselinePcv > 0) {
      return Number((((this.completionPcv - this.baselinePcv) / this.baselinePcv) * 100).toFixed(2))
    }
    return null
  }

  @beforeCreate()
  static assignUuid(profile: PregnantMumProfile) {
    if (!profile.id) {
      profile.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
