import User from 'App/Models/User'
import Role from 'App/Models/Role'

export default class UserRepository {
  public getRolesNotAdmin() {
    const roles = Role.query().where('admin', false)

    return roles
  }

  public async checkRolesAdmin(id: number) {
    const roles = await Role.findOrFail(id)

    if (roles.admin) {
      return true
    }

    return false
  }
}
