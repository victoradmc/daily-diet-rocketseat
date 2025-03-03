import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.timestamp('date').defaultTo(knex.fn.now()).notNullable()
    table.boolean('diet_compliant').notNullable()
    table.uuid('session_id').after('id').index()
  })
}

/*

      id: string
      name: string
      description: string
      date: string
      diet_compliant: boolean
      session_id: string */

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
