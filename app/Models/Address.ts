import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Village from './Village'
import District from './District'
import Regency from './Regency'
import Province from './Province'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public address: string

  @column()
  public villages_id: number

  @column()
  public districts_id: number

  @column()
  public regencies_id: number

  @column()
  public provinces_id: number

  @column()
  public latitude: string

  @column()
  public longitude: string

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Village, {
    foreignKey: 'villages_id',
  })
  public village: BelongsTo<typeof Village>

  @belongsTo(() => District, {
    foreignKey: 'districts_id',
  })
  public district: BelongsTo<typeof District>

  @belongsTo(() => Regency, {
    foreignKey: 'regencies_id',
  })
  public regency: BelongsTo<typeof Regency>

  @belongsTo(() => Province, {
    foreignKey: 'provinces_id',
  })
  public province: BelongsTo<typeof Province>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
