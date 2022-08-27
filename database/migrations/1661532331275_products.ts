import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('product_category_id')
        .unsigned()
        .references('id')
        .inTable('product_categories')
        .onDelete('CASCADE').notNullable

      table.string('name')
      table.text('product_img')
      table.text('description')

      table.boolean('status').comment('1 = On Sale, 0 = Sold Out')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
