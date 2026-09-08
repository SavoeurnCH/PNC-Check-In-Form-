import { TERM_KEYS } from '../../constants/checkin.constants.js'

/** @param {import('knex').Knex} knex */
export async function up(knex) {
  await knex.schema.createTable('visitor_term_acceptances', (table) => {
    table.increments('id').primary()
    table
      .uuid('visitor_id')
      .notNullable()
      .references('id')
      .inTable('visitors')
      .onDelete('CASCADE')
    table.enum('term_key', TERM_KEYS).notNullable()
    table.datetime('accepted_at').notNullable()

    table.unique(['visitor_id', 'term_key'])
  })
}

/** @param {import('knex').Knex} knex */
export async function down(knex) {
  await knex.schema.dropTableIfExists('visitor_term_acceptances')
}
