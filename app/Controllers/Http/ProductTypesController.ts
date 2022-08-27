import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomHandlerException from 'App/Exceptions/CustomHandlerException'
import ProductType from 'App/Models/ProductType'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductTypesController {
  public async index({ response, auth, params, request }: HttpContextContract) {
    const user = await auth.authenticate()

    const productTypes = await ProductType.query().orderBy('name', 'asc')

    if (productTypes.length === 0) {
      return response
        .status(404)
        .json({ status: 'error', message: 'No Product Type found', data: '' })
    }

    return response.status(200).json({
      tatus: 'success',
      message: 'Product Type retrieved successfully',
      data: productTypes,
    })
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const productTypeSchema = schema.create({
      name: schema.string({}),
    })

    await request.validate({ schema: productTypeSchema })

    try {
      const productType = await ProductType.create({
        name: request.input('name'),
      })

      return response.status(201).json({
        status: 'success',
        message: 'Product Type Successfully Stored',
        data: productType,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
    }
  }

  public async show({ response, auth, params }: HttpContextContract) {
    await auth.authenticate()
    let id = params.id

    let productType = await ProductType.query()
      .where('id', id)
      .withCount('productCategory', (query) => {
        query.as('productCategory_count')
      })
      .preload('productCategory')

    return response.status(200).json({
      status: 'success',
      message: 'List Product Type Successfully retrived',
      data: productType,
    })
  }

  public async update({ response, request, auth, params }: HttpContextContract) {
    let id = params.id
    let user = await auth.authenticate()

    let productType = ProductType.query()
      .where('id', id)
      .update({
        name: request.input('name'),
      })

    return response
      .status(201)
      .json({ status: 'success', message: 'Succesfull Update Data Product Type', data: '' })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    let user = await auth.authenticate()

    await ProductType.query().where('id', params.id).delete()

    return response
      .status(200)
      .json({ status: 'success', message: 'Success Delete Product Type', data: '' })
  }
}
