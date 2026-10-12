import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'referrals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('referrer_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .uuid('referred_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('referral_code', 25).notNullable()
      table.decimal('commission_amount', 10, 2).defaultTo(0).notNullable()
      table.enum('status', ['pending', 'approved', 'disbursed'], {
        useNative: true,
        enumName: 'referral_status_enum',
      }).defaultTo('pending').notNullable()
      table.uuid('payout_batch_id').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS referral_status_enum CASCADE')
  }
}
