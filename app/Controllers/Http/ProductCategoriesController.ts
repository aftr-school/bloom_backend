import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomHandlerException from 'App/Exceptions/CustomHandlerException'
import ProductCategory from 'App/Models/ProductCategory'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductCategoriesController {
  public async index({ response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const productCategorys = await ProductCategory.query().orderBy('name', 'asc')

    if (productCategorys.length === 0) {
      return response
        .status(404)
        .json({ status: 'error', message: 'No Product Categories found', data: '' })
    }

    return response.status(200).json({
      status: 'success',
      message: 'Product Categories retrieved successfully',
      data: productCategorys,
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
      const productCategory = await ProductCategory.create({
        name: request.input('name'),
        product_type_id: request.input('product_type_id'),
      })

      return response.status(201).json({
        status: 'success',
        message: 'Product Category created successfully',
        data: productCategory,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
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

    return response.status(200).json({
      status: 'success',
      message: 'Product Type Category Successfully',
      data: productCategory,
    })
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
      status: 'success',
      message: 'Succesfull Update Data Product Category',
      data: '',
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    let user = await auth.authenticate()

    await ProductCategory.query().where('id', params.id).delete()

    return response.status(200).json({
      status: 'success',
      message: 'Success Delete Product Category',
      data: '',
    })
  }
}
