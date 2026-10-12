import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('reference', 100).notNullable().unique()
      table.bigInteger('amount_kobo').notNullable() // e.g. 500000 kobo
      table.decimal('amount_naira', 10, 2).notNullable() // e.g. 5000.00
      table.string('currency', 10).defaultTo('NGN').notNullable()
      table.string('purpose', 50).defaultTo('registration_fee').notNullable()
      table.string('gateway', 50).defaultTo('paystack').notNullable()
      table.string('gateway_reference', 100).nullable()
      table.enum('status', ['pending', 'success', 'failed', 'abandoned'], {
        useNative: true,
        enumName: 'transaction_status_enum',
      }).defaultTo('pending').notNullable()
      table.string('channel', 50).nullable() // card, bank_transfer, ussd
      table.timestamp('paid_at', { useTz: true }).nullable()
      table.jsonb('metadata').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS transaction_status_enum CASCADE')
  }
}
