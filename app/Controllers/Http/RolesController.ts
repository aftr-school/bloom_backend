import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import UserRepository from 'App/Repositories/UserRepository'

export default class RolesController {
  public userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async index({ response, auth, params, request }: HttpContextContract) {
    let roles: Role[]

    roles = await Role.query().where('admin', false)

    if (await auth.check()) {
      const user = await auth.authenticate()

      const userData = await User.query().where('id', user.id).first()

      if (!userData) {
        return response.status(404).json({ status: 'error', message: 'User Not Found', data: '' })
      }

      if (await this.userRepository.checkRolesAdmin(userData.role_id)) {
        roles = await Role.query().orderBy('id', 'asc')
      }
    }

    return response.json({
      status: 'success',
      message: 'List Role Retrieved Successfully',
      data: roles,
    })
  }
}
