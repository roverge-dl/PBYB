import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payout_batches'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('batch_reference', 100).notNullable().unique()
      table.decimal('total_amount', 12, 2).notNullable()
      table.integer('total_recipients').notNullable()
      table.enum('status', ['pending', 'approved', 'disbursed', 'rejected'], {
        useNative: true,
        enumName: 'payout_batch_status_enum',
      }).defaultTo('pending').notNullable()
      table
        .uuid('approved_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.timestamp('approved_at', { useTz: true }).nullable()
      table.string('csv_export_url', 500).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS payout_batch_status_enum CASCADE')
  }
}
