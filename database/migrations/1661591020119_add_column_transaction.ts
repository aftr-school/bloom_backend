import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.enum('status', ['offer', 'payment', 'delivery', 'done'])
      table.text('payment_pic').nullable()
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('status')
      table.dropColumn('payment_pic')
    })
  }
}
