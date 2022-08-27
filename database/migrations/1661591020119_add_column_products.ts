import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('uom', ['liter', 'kg', 'unit']).after('name')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('uom')
    })
  }
}
