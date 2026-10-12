import { randomUUID } from 'node:crypto'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, beforeCreate, hasOne, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import { type AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { HasOne, HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import PregnantMumProfile from '#models/pregnant_mum_profile'
import NurseProfile from '#models/nurse_profile'
import Transaction from '#models/transaction'
import Referral from '#models/referral'
import DailyLog from '#models/daily_log'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  static accessTokens = DbAccessTokensProvider.forModel(User)
  declare currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column()
  declare email: string

  @column()
  declare phone: string | null

  @column({ serializeAs: null })
  declare password: string | null

  @column()
  declare role: 'pregnant_mum' | 'nurse' | 'admin'

  @column()
  declare referralCode: string

  @column()
  declare referredBy: string | null

  @column()
  declare googleId: string | null

  @column()
  declare isPaid: boolean

  @column()
  declare isVerified: boolean

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare lastLogin: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim()
  }

  get initials(): string {
    const [first, last] = this.fullName ? this.fullName.split(' ') : this.email.split('@')
    if (first && last) {
      return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
    }
    return `${this.email.slice(0, 2)}`.toUpperCase()
  }

  @beforeCreate()
  static assignUuid(user: User) {
    if (!user.id) {
      user.id = randomUUID()
    }
  }

  @hasOne(() => PregnantMumProfile, {
    foreignKey: 'userId',
  })
  declare mumProfile: HasOne<typeof PregnantMumProfile>

  @hasOne(() => NurseProfile, {
    foreignKey: 'userId',
  })
  declare nurseProfile: HasOne<typeof NurseProfile>

  @belongsTo(() => User, {
    foreignKey: 'referredBy',
  })
  declare referrer: BelongsTo<typeof User>

  @hasMany(() => Transaction, {
    foreignKey: 'userId',
  })
  declare transactions: HasMany<typeof Transaction>

  @hasMany(() => Referral, {
    foreignKey: 'referrerId',
  })
  declare referralsGiven: HasMany<typeof Referral>

  @hasMany(() => DailyLog, {
    foreignKey: 'userId',
  })
  declare dailyLogs: HasMany<typeof DailyLog>
}
