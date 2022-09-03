import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Address from 'App/Models/Address'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        id: 1,
        name: 'SuperAdmin',
        username: 'SuperAdmin',
        email: 'super.afterschool@gmail.com',
        password: 'Sup3r4fter',
        role_id: 1,
        isVerified: true,
      },
      {
        id: 2,
        name: 'Petani',
        username: 'petani',
        email: 'petani@gmail.com',
        password: 'petani123',
        role_id: 3,
        isVerified: true,
      },
      {
        id: 3,
        name: 'Distributor',
        username: 'distributor',
        email: 'distributor@gmail.com',
        password: 'distributor123',
        role_id: 4,
        isVerified: true,
      },
    ])

    await Address.createMany([
      {
        id: 1,
        user_id: 2,
        address: 'SMK Negeri 1 Katapang',
        latitude: '-7.009002',
        longitude: '107.547534',
        provinces_id: 32,
        regencies_id: 3204,
        districts_id: 3204180,
        villages_id: 3204180005,
      },
      {
        id: 2,
        user_id: 3,
        address: 'SDN Pangauban 01',
        latitude: '-7.008675453020168',
        longitude: '107.5484406346615',
        provinces_id: 32,
        regencies_id: 3204,
        districts_id: 3204180,
        villages_id: 3204180005,
      },
    ])
  }
}
