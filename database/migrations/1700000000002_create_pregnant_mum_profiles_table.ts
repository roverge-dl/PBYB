import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pregnant_mum_profiles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.integer('gestational_age_weeks').nullable()
      table.date('expected_delivery_date').nullable()
      table.boolean('health_consent_accepted').defaultTo(false).notNullable()
      table.timestamp('consent_accepted_at', { useTz: true }).nullable()

      // Baseline PCV
      table.decimal('baseline_pcv', 5, 2).nullable() // e.g. 28.50 %
      table.date('baseline_pcv_date').nullable()
      table.string('baseline_pcv_image_url', 500).nullable() // S3 image link
      table.jsonb('baseline_pcv_raw_ocr').nullable()

      // Completion PCV
      table.decimal('completion_pcv', 5, 2).nullable()
      table.date('completion_pcv_date').nullable()
      table.string('completion_pcv_image_url', 500).nullable()
      table.jsonb('completion_pcv_raw_ocr').nullable()

      // Target calibration
      table.string('pcv_tier', 50).nullable() // e.g., 'mild_anemia', 'moderate_anemia', 'severe_anemia', 'normal'
      table.decimal('daily_water_target_liters', 3, 1).defaultTo(2.5).notNullable()
      table.integer('daily_green_target_servings').defaultTo(2).notNullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
