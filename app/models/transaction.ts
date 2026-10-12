import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare userId: string

  @column()
  declare reference: string

  @column()
  declare amountKobo: number

  @column()
  declare amountNaira: number

  @column()
  declare currency: string

  @column()
  declare purpose: string

  @column()
  declare gateway: string

  @column()
  declare gatewayReference: string | null

  @column()
  declare status: 'pending' | 'success' | 'failed' | 'abandoned'

  @column()
  declare channel: string | null

  @column.dateTime()
  declare paidAt: DateTime | null

  @column()
  declare metadata: Record<string, any> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @beforeCreate()
  static assignUuid(transaction: Transaction) {
    if (!transaction.id) {
      transaction.id = randomUUID()
    }
  }

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>
}
