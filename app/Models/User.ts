import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  hasOne,
  HasOne,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Address from './Address'
import Role from './Role'
import ProductFarmer from './ProductFarmer'
import ProductImage from './ProductImage'
import ProductDistributor from './ProductDistributor'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public avatar: string

  @column()
  public role_id: number

  @column()
  public rememberMeToken?: string

  @column()
  public verification_code: string

  @column()
  public isVerified: boolean = false

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Address, {
    foreignKey: 'user_id',
  })
  public address: HasOne<typeof Address>

  @belongsTo(() => Role, {
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Role>

  @hasMany(() => ProductFarmer, {
    foreignKey: 'product_id',
    serializeAs: 'owner',
  })
  public productFarmer: HasMany<typeof ProductFarmer>

  @hasMany(() => ProductDistributor, {
    foreignKey: 'product_id',
    serializeAs: 'buyer',
  })
  public productDistributor: HasMany<typeof ProductDistributor>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
