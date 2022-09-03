import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Product from './Product'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public farmer_id: number

  @column()
  public distributor_id: number

  @column()
  public product_id: number

  @column()
  public product: string

  @column()
  public heavy_mass: number

  @column()
  public service: boolean

  @column.dateTime()
  public transaction_dates: DateTime

  @column()
  public status: string

  @column()
  public payment_pic: string

  @column()
  public uom: string

  @column()
  public quantity: number

  @column()
  public price: number

  @belongsTo(() => User, {
    foreignKey: 'farmer_id',
  })
  public farmerId: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'distributor_id',
  })
  public distributorId: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    foreignKey: 'product_id',
  })
  public productDetail: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
