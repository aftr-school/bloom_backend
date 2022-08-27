import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductCategory from './ProductCategory'

export default class ProductType extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @hasMany(() => ProductCategory, {
    foreignKey: 'product_type_id',
  })
  public productCategory: HasMany<typeof ProductCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
