import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'nurse_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('facility_name', 255).nullable()
      table.string('license_number', 100).nullable()
      table.string('specialization', 100).nullable()
      table.integer('years_of_experience').nullable()

      // Payout bank account details
      table.string('bank_name', 100).nullable()
      table.string('bank_code', 20).nullable()
      table.string('account_number', 20).nullable()
      table.string('account_name', 255).nullable()
      table.boolean('bank_details_verified').defaultTo(false).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
