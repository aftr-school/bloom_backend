import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_farmers'

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

      table.integer('price').comment('Selling Price')
      table.integer('quantity').comment('Selling Quantity')
      table.integer('anual_harvest')
      table.dateTime('selling_dates').comment('Selling Dates')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
