import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Address from 'App/Models/Address'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const latitude = request.input('lat')
    const longitude = request.input('long')
    const radius = request.input('radius') ?? 50

    if (!latitude || !longitude) {
      return response
        .status(422)
        .json({ status: 'error', message: 'You must active your GPS!', data: '' })
    }

    // const address = await Address.query()
    //   //   .preload('address')
    //   //   .preload('role')
    //   .select('addresses.*')
    //   .select(
    //     Database.raw(
    //       `
    //     ( 6371 *
    //       acos( cos(radians( ? ) ) *
    //         cos( radians( latitude ) ) *
    //         cos( radians( longitude ) - radians( ? )) +
    //         sin( radians( ? ) ) *
    //         sin( radians( latitude ) )
    //       )
    //     ) AS distance`,
    //       [latitude, longitude, latitude]
    //     )
    //   )
    //   .havingRaw(`distance < ${radius}`)
    //   .orderBy('distance', 'asc')
    //   .preload('user')

    //   .whereHas('role', (role) => {
    //     role.where('admin', false).where('id', user.role_id === 3 ? 4 : 3)
    //   })

    const userData = await User.query()
      .preload('address')
      .preload('role')
      .whereHas('role', (role) => {
        role.where('admin', false).where('id', user.role_id === 3 ? 4 : 3)
      })
      .join('addresses', 'addresses.user_id', 'users.id')
      .select('users.*')
      .select('addresses.*')
      .select(
        Database.raw(
          `
        ( 6371 *
          acos( cos(radians( ? ) ) *
            cos( radians( latitude ) ) *
            cos( radians( longitude ) - radians( ? )) +
            sin( radians( ? ) ) *
            sin( radians( latitude ) )
          )
        ) AS distance`,
          [latitude, longitude, latitude]
        )
      )
      .havingRaw(`distance < ${radius}`)
      .orderBy('distance', 'asc')

    if (!userData) {
      return response
        .status(404)
        .json({ status: 'error', message: 'list User is not available', data: '' })
    }

    return response.json({
      status: 'success',
      message: 'list User have retrieved succesfully',
      data: userData,
    })
  }

  public async show({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const data = User.query().where('id', params.id).preload('address').first()

    if (!data) {
      return response.status(404).json({ status: 'error', message: 'User Not Available', data: '' })
    }

    try {
      return response.status(200).json({
        status: 'success',
        message: 'Success retrieved user',
        data: data,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.messages, data: '' })
    }
  }
}
