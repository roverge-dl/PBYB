import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class DailyLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column.date()
  declare logDate: DateTime

  @column()
  declare dayNumber: number // 1 to 14

  @column()
  declare mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink'

  @column()
  declare imageUrl: string

  @column()
  declare isCameraEnforced: boolean

  @column()
  declare aiClassification: Record<string, any> | null

  @column()
  declare aiGreenDensityScore: number | null

  @column()
  declare aiVerified: boolean

  @column()
  declare waterIntakeLiters: number | null

  @column()
  declare pointsAwarded: number

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column()
  declare rejectionReason: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(log: DailyLog) {
    if (!log.id) {
      log.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
