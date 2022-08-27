import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomHandlerException from 'App/Exceptions/CustomHandlerException'
import ProductCategory from 'App/Models/ProductCategory'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductCategoriesController {
  public async index({ response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    let paginateModel = params.paginate
    if (!paginateModel) {
      paginateModel = 10
    }

    const ProductCategorys = await ProductCategory.query()
      .orderBy('name', 'asc')
      .paginate(paginateModel)

    if (ProductCategorys.length === 0) {
      throw new CustomHandlerException('No Product Categories found', 404)
    }

    return response.status(200).json({
      message: 'Product Categories retrieved successfully',
      data: ProductCategorys,
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const productTypeSchema = schema.create({
      name: schema.string({}),
      product_type_id: schema.number(),
    })

    await request.validate({ schema: productTypeSchema })

    try {
      const productCategory = ProductCategory.create({
        name: request.input('name'),
        product_type_id: request.input('product_type_id'),
      })

      return response.status(201).json({
        message: 'Product Category created successfully',
        data: ProductCategory,
      })
    } catch (error) {
      throw new CustomHandlerException(error.messages, 500)
    }
  }

  public async show({ response, auth, params }: HttpContextContract) {
    await auth.authenticate()
    let id = params.id

    let productCategory = await ProductCategory.query()
      .where('id', id)
      .withCount('productType', (query) => {
        query.as('productType_count')
      })
      .preload('productType')

    return response
      .status(200)
      .json({ message: 'berhasil get data booking by id', data: ProductCategory })
  }

  public async update({ response, request, auth, params }: HttpContextContract) {
    let id = params.id
    let user = await auth.authenticate()

    let productCategory = ProductCategory.query()
      .where('id', id)
      .update({
        name: request.input('name'),
        product_type_id: request.input('product_type_id'),
      })

    return response.status(201).json({
      message: 'Succesfull Update Data Product Category',
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    let user = await auth.authenticate()

    await ProductCategory.query().where('id', params.id).delete()

    return response.status(200).json({ message: 'Success Delete Product Category' })
  }
}
