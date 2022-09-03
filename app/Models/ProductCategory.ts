import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductType from './ProductType'
import Product from './Product'

export default class ProductCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public product_type_id: number

  @belongsTo(() => ProductType, {
    foreignKey: 'product_type_id',
  })
  public productType: BelongsTo<typeof ProductType>

  @hasMany(() => Product, {
    foreignKey: 'product_category_id',
  })
  public product: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
