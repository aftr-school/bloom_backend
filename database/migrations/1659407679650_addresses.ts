import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('villages_id').unsigned()
      table.integer('districts_id').unsigned()
      table.integer('regencies_id').unsigned()
      table.integer('provinces_id').unsigned()
      table.string('latitude')
      table.string('longitude')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
