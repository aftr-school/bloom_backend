import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomHandlerException from 'App/Exceptions/CustomHandlerException'
import ProductType from 'App/Models/ProductType'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class ProductTypesController {
  public async index({ response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    let paginateModel = params.paginate
    if (!paginateModel) {
      paginateModel = 10
    }

    const productTypes = await ProductType.query().orderBy('name', 'asc').paginate(paginateModel)

    if (productTypes.length === 0) {
      throw new CustomHandlerException('No Product Type found', 404)
    }

    return response.status(200).json({
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
      const productType = ProductType.create({
        name: request.input('name'),
      })

      return response.status(201).json({
        message: 'Product Type created successfully',
        data: productType,
      })
    } catch (error) {
      throw new CustomHandlerException(error.messages, 500)
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

    return response
      .status(200)
      .json({ message: 'berhasil get data booking by id', data: productType })
  }

  public async update({ response, request, auth, params }: HttpContextContract) {
    let id = params.id
    let user = await auth.authenticate()

    let productType = ProductType.query()
      .where('id', id)
      .update({
        name: request.input('name'),
      })

    return response.status(201).json({
      message: 'Succesfull Update Data Product Type',
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    let user = await auth.authenticate()

    await ProductType.query().where('id', params.id).delete()

    return response.status(200).json({ message: 'Success Delete Product Type' })
  }
}
