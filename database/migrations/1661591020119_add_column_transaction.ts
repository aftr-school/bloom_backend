import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('status', ['offer', 'payment', 'delivery', 'done', 'cancel']).after('service')
      table.enum('uom', ['liter', 'kg', 'unit']).after('name').after('service')
      table.text('payment_pic').nullable().after('service')
      table.integer('price').comment('Buying Price').after('service')
      table.integer('quantity').after('service')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('uom')
      table.dropColumn('payment_pic')
      table.dropColumn('quantity')
    })
  }
}
