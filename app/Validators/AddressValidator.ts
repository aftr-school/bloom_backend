import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AddressValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    address: schema.string(),
    regencies_id: schema.number(),
    villages_id: schema.number(),
    districts_id: schema.number(),
    provinces_id: schema.number(),
    latitude: schema.string(),
    longitude: schema.string(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'address.required': 'Address Is Required',
    'regencies_id.required': 'Regencies Is Required',
    'villages_id.required': 'Villages Is Required',
    'districts_id.required': 'districts Is Required',
    'provinces_id.required': 'Provinces Is Required',
    'latitude.required': 'Latitude Is Required',
    'longitude.required': 'Longitude Is Required',
  }
}
