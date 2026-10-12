import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class NurseProfile extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare facilityName: string | null

  @column()
  declare licenseNumber: string | null

  @column()
  declare specialization: string | null

  @column()
  declare yearsOfExperience: number | null

  @column()
  declare bankName: string | null

  @column()
  declare bankCode: string | null

  @column()
  declare accountNumber: string | null

  @column()
  declare accountName: string | null

  @column()
  declare bankDetailsVerified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(profile: NurseProfile) {
    if (!profile.id) {
      profile.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
