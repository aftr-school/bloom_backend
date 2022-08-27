import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import Address from 'App/Models/Address'
import Database from '@ioc:Adonis/Lucid/Database'
import ProductValidator from 'App/Validators/ProductValidator'
import ProductFarmer from 'App/Models/ProductFarmer'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'
import ProductImage from 'App/Models/ProductImage'

export default class ProductsController {
  public async index({ response, request, auth, params }: HttpContextContract) {
    // const productType = request.input('productTypeId') ?? null
    // const productCategory = request.input('productCategoryId') ?? null
    const radius = request.input('radius') ?? 10

    // const latitude = request.input('lat')
    // const longitude = request.input('long')

    // if (!latitude || !longitude) {
    //   return response
    //     .status(422)
    //     .json({ status: 'error', message: 'You must active your GPS!', data: '' })
    // }

    // , (address) => {
    //   address
    //     .select('addresses.*')
    //     .select(
    //       Database.raw(
    //         `
    //   ( 6371 *
    //     acos( cos(radians(${latitude}) ) *
    //       cos( radians( latitude ) ) *
    //       cos( radians( longitude ) - radians(${longitude})) +
    //       sin( radians(${latitude}) ) *
    //       sin( radians( latitude ) )
    //     )
    //   ) AS distance`
    //       )
    //     )
    //     .havingRaw(`distance < ${radius}`)
    //     .orderBy('distance', 'asc')
    // }

    const products = await Product.query()
      .preload('productCategory')
      .preload('productFarmer', (farmer) => {
        farmer.preload('user', (user) => {
          user.preload('address')
        })
      })
      .preload('productImage', (image) => {
        image.first()
      })
    // .whereHas('productCategory', (category) => {
    //   category.where('product_type_id', 2).orWhere('product_type_id', 1)
    // })

    if (!products) {
      return response
        .status(404)
        .json({ status: 'error', message: 'list Product is not available', data: '' })
    }

    return response.json({
      status: 'success',
      message: 'List Product have succesfully',
      data: products,
    })
  }

  public async listByFarmer({ response, request, auth, params }: HttpContextContract) {
    // const productType = request.input('productTypeId') ?? null
    // const productCategory = request.input('productCategoryId') ?? null
    const userId = params.user_id

    let products = await Product.query()
      .preload('productCategory')
      .preload('productFarmer')
      .preload('productImage')
      .whereHas('productFarmer', (farmer) => {
        farmer.where('user_id', userId)
      })
    // .whereHas('productCategory', (category) => {
    //   category.where('product_type_id', productType).where('id', productCategory)
    // })

    if (!products) {
      return response
        .status(404)
        .json({ status: 'error', message: 'list Product is not available', data: '' })
    }

    return response.json({
      status: 'success',
      message: 'List Product have succesfully',
      data: products,
    })
  }

  public async store({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const images = request.files('images', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    let uploadImage: any[] = []

    await request.validate(ProductValidator)

    try {
      const product = await Product.create({
        name: request.input('name'),
        uom: request.input('uom'),
        product_category_id: request.input('product_category_id'),
        description: request.input('description'),
      })

      const productFarmer = await ProductFarmer.create({
        user_id: user.id,
        product_id: product.id,
        price: request.input('price'),
        quantity: request.input('quantity'),
        anual_harvest: request.input('anual_harvest'),
      })

      for (let [index, image] of images.entries()) {
        let date = Date.now()
        let fileName = Math.floor(date / 1000) + '_' + index + '_' + user.username

        await image.move(Application.tmpPath('uploads/images/product'), {
          name: fileName + '.' + image.extname,
        })

        uploadImage.push({ product_id: product.id, images: fileName + '.' + image.extname })
      }

      await ProductImage.createMany(uploadImage)

      const data = { product, productFarmer }

      return response.status(201).json({
        status: 'success',
        message: 'Product Category created successfully',
        data: data,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
    }
  }

  public async update({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const images = request.files('images', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    let uploadImage: any[] = []

    const product = await Product.query().where('id', params.id).preload('productFarmer').first()

    if (!product) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Product not available', data: '' })
    }

    if (product.productFarmer.user_id !== user.id) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }

    try {
      const product = await Product.query()
        .where('id', params.id)
        .update({
          name: request.input('name'),
          uom: request.input('uom'),
          product_category_id: request.input('product_category_id'),
          description: request.input('description'),
        })

      const productFarmer = await ProductFarmer.query()
        .where('product_id', params.id)
        .update({
          price: request.input('price'),
          quantity: request.input('quantity'),
          anual_harvest: request.input('anual_harvest'),
        })

      for (let [index, image] of images.entries()) {
        let date = Date.now()
        let fileName = Math.floor(date / 1000) + '_' + index + '_' + user.username

        await image.move(Application.tmpPath('uploads/images/product'), {
          name: fileName + '.' + image.extname,
        })

        uploadImage.push({ product_id: params.id, images: fileName + '.' + image.extname })
      }

      await ProductImage.createMany(uploadImage)

      return response.status(201).json({
        status: 'success',
        message: 'Product Category updated successfully',
        data: '',
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
    }
  }

  public async show({ response, request, params }: HttpContextContract) {
    let id = params.id

    let product = await Product.query()
      .where('id', id)
      .preload('productFarmer')
      .preload('productCategory')
      .preload('productImage')
      .first()

    return response.status(200).json({
      status: 'success',
      message: 'Product Retrieved Successfully',
      data: product,
    })
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const product = await Product.query().where('id', params.id).preload('productFarmer').first()

    if (!product) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Product not available', data: '' })
    }

    if (product.productFarmer.user_id !== user.id) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }

    await Product.query().where('id', params.id).delete()
    await ProductFarmer.query().where('product_id', params.id).delete()

    return response
      .status(200)
      .json({ status: 'success', message: 'Success Delete Product Type', data: '' })
  }

  public async deleteImage({ response, params, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    const product = await Product.query().where('id', params.id).preload('productFarmer').first()

    if (!product) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Product not available', data: '' })
    }

    if (product.productFarmer.user_id !== user.id) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }
  }
}
