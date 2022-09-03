import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ProductCategory from 'App/Models/ProductCategory'
import ProductType from 'App/Models/ProductType'

export default class extends BaseSeeder {
  public async run() {
    // Write your database queries inside the run method
    await ProductType.createMany([
      {
        name: 'Perternakan',
      },
      {
        name: 'Pertanian',
      },
      {
        name: 'Hortikultura',
      },
      {
        name: 'Perkebunan',
      },
    ])

    await ProductCategory.createMany([
      {
        name: 'Hewan Ternak',
        product_type_id: 1,
      },
      {
        name: 'Olahan Hewan Ternak',
        product_type_id: 1,
      },
      {
        name: 'Tanaman',
        product_type_id: 2,
      },
      {
        name: 'Biji Bijian',
        product_type_id: 2,
      },
      {
        name: 'Kacang Kacangan',
        product_type_id: 2,
      },
      {
        name: 'Buah Buahan',
        product_type_id: 3,
      },
      {
        name: 'Tanaman Hias',
        product_type_id: 3,
      },
      {
        name: 'Sayuran',
        product_type_id: 3,
      },
      {
        name: 'Obat Obatan',
        product_type_id: 3,
      },
    ])
  }
}
