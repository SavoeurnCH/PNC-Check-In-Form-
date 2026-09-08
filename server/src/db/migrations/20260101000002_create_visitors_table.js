import { COMING_FROM_VALUES, PURPOSE_VALUES } from '../../constants/checkin.constants.js'

/** @param {import('knex').Knex} knex */
export async function up(knex) {
  await knex.schema.createTable('visitors', (table) => {
    // Generated app-side via crypto.randomUUID() on insert (not DB-side —
    // MySQL's UUID()-as-DEFAULT needs 8.0.13+ and MariaDB doesn't support it
    // as a non-deterministic default at all, so this keeps the schema
    // portable across both).
    table.uuid('id').primary()
    table.string('full_name', 255).notNullable()
    table.string('contact_info', 50).notNullable()
    table.string('email', 255).nullable()
    table.enum('coming_from', COMING_FROM_VALUES).notNullable()
    table.string('organization_name', 255).nullable()
    table.smallint('accompanying_visitors').unsigned().nullable()
    table.string('accompanying_positions', 255).nullable()
    table.string('person_to_meet', 255).notNullable()
    table.enum('purpose', PURPOSE_VALUES).notNullable()
    table.string('badge_code', 12).notNullable().unique()
    table.datetime('checked_in_at').notNullable()
    table.timestamps(true, true)

    table.index('checked_in_at')
    table.index('purpose')
    table.index('coming_from')
  })
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists('visitors')
}
