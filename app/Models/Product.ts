import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import ProductCategory from './ProductCategory'
import ProductFarmer from './ProductFarmer'
import ProductDistributor from './ProductDistributor'
import ProductImage from './ProductImage'

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
  public uom: string

  @column()
  public status: string

  @column()
  public product_category_id: number

  @belongsTo(() => ProductCategory, {
    foreignKey: 'product_category_id',
  })
  public productCategory: BelongsTo<typeof ProductCategory>

  @hasOne(() => ProductFarmer, {
    foreignKey: 'product_id',
  })
  public productFarmer: HasOne<typeof ProductFarmer>

  @hasMany(() => ProductImage, {
    foreignKey: 'product_id',
  })
  public productImage: HasMany<typeof ProductImage>

  @hasMany(() => ProductDistributor, {
    foreignKey: 'product_id',
  })
  public productDistributor: HasMany<typeof ProductDistributor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
