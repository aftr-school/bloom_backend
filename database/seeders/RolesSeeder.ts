import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await Role.createMany([
      {
        name: 'superadmin',
        admin: true,
      },
      {
        name: 'admin',
        admin: true,
      },
      {
        name: 'farmer',
        admin: false,
      },
      {
        name: 'distributor',
        admin: false,
      },
    ])
  }
}
