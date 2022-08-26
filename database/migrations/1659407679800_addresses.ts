import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
      table.text('address')
      table.bigInteger('villages_id').unsigned()
      table.bigInteger('districts_id').unsigned()
      table.bigInteger('regencies_id').unsigned()
      table.bigInteger('provinces_id').unsigned()
      table.string('latitude')
      table.string('longitude')

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
