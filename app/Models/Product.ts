import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import ProductCategory from './ProductCategory'
import ProductFarmer from './ProductFarmer'
import ProductDistributor from './ProductDistributor'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public product_img: string

  @column()
  public description: string

  @column()
  public status: string

  @belongsTo(() => ProductCategory, {
    foreignKey: 'product_category_id',
  })
  public productCategory: BelongsTo<typeof ProductCategory>

  @hasOne(() => ProductFarmer, {
    foreignKey: 'product_id',
  })
  public productFarmer: HasOne<typeof ProductFarmer>

  @hasOne(() => ProductDistributor, {
    foreignKey: 'product_id',
  })
  public productDistributor: HasOne<typeof ProductDistributor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
