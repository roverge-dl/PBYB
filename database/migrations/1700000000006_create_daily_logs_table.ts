import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'daily_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.date('log_date').notNullable()
      table.integer('day_number').notNullable() // 1 to 14
      table.enum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack', 'drink'], {
        useNative: true,
        enumName: 'meal_type_enum',
      }).notNullable()
      table.string('image_url', 500).notNullable()
      table.boolean('is_camera_enforced').defaultTo(true).notNullable()
      table.jsonb('ai_classification').nullable()
      table.decimal('ai_green_density_score', 5, 2).nullable()
      table.boolean('ai_verified').defaultTo(false).notNullable()
      table.decimal('water_intake_liters', 3, 1).nullable()
      table.integer('points_awarded').defaultTo(0).notNullable()
      table.enum('status', ['pending', 'approved', 'rejected'], {
        useNative: true,
        enumName: 'daily_log_status_enum',
      }).defaultTo('pending').notNullable()
      table.text('rejection_reason').nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
    this.schema.raw('DROP TYPE IF EXISTS meal_type_enum CASCADE')
    this.schema.raw('DROP TYPE IF EXISTS daily_log_status_enum CASCADE')
  }
}
