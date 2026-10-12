import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('first_name', 255).notNullable()
      table.string('last_name', 255).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('phone', 25).nullable()
      table.string('password', 255).nullable()
      table.enum('role', ['pregnant_mum', 'nurse', 'admin'], {
        useNative: true,
        enumName: 'user_role_enum',
      }).defaultTo('pregnant_mum').notNullable()
      table.string('referral_code', 25).notNullable().unique()
      table
        .uuid('referred_by')
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('google_id', 255).nullable().unique()
      table.boolean('is_paid').defaultTo(false).notNullable() // ₦5,000 fee status
      table.boolean('is_verified').defaultTo(false).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.timestamp('last_login', { useTz: true }).nullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS user_role_enum CASCADE')
  }
}
