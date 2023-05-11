import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table)=>{
    table.increments('id').primary();
    table.integer('photo');
    table.string('name',75).notNullable();
    table.string('mail',75).notNullable();
    table.integer('level');
    table.string('password',50).notNullable();
    table.tinyint('reset');
    table.tinyint('status');
    table.timestamps(true,true);
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
