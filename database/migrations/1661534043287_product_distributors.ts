import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_distributors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
        .notNullable
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE').notNullable

      table.integer('price').comment('Buying Price')
      table.integer('quantity').comment('Buying Quantity')
      table.dateTime('buying_dates').comment('Buying Dates')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
