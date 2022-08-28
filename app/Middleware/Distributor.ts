import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRepository from 'App/Repositories/UserRepository'

export default class Distributor {
  protected userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    let userRoleId: number = auth.user?.role_id!

    if (await this.userRepository.checkRolesDistributor(userRoleId)) {
      await next()
    } else {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }
  }
}
