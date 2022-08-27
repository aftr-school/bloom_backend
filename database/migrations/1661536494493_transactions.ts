import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('farmer_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
        .notNullable
      table
        .integer('distributor_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE').notNullable

      table.string('product')

      table.integer('heavy_mass').unsigned
      table.boolean('service')

      table.dateTime('transaction_dates')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
