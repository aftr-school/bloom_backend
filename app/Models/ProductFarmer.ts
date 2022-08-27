import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Product from './Product'

export default class ProductFarmer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public price: number

  @column()
  public quantity: number

  @column()
  public buying_dates: DateTime

  @column()
  public anual_harvest: number

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
  })
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
