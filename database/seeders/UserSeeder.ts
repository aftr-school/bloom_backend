import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name: 'SuperAdmin',
        username: 'SuperAdmin',
        email: 'super.afterschool@gmail.com',
        password: 'Sup3r4fter',
        role_id: 1,
        isVerified: true,
      },
    ])
  }
}
