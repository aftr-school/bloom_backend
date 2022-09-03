import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Transaction from 'App/Models/Transaction'
import ProductDistributor from 'App/Models/ProductDistributor'
import Product from 'App/Models/Product'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import UserRepository from 'App/Repositories/UserRepository'
import TransactionValidator from 'App/Validators/TransactionValidator'
import Application from '@ioc:Adonis/Core/Application'
import { schema } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import ProductFarmer from 'App/Models/ProductFarmer'

export default class TransactionsController {
  protected userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }
  public async index({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const roles = await Role.query().where('id', user.role_id).first()

    if (!roles) {
      return response
        .status(404)
        .json({ status: 'error', message: 'No Transaction Type found', data: '' })
    }

    let transactions
    if (await this.userRepository.checkRolesAdmin(user.role_id)) {
      transactions = await Transaction.query().orderBy('id', 'asc')
    } else {
      transactions = await Transaction.query()
        .where('farmer_id', user.id)
        .orWhere('distributor_id', user.id)
    }
    return response.json({
      success: 'true',
      message: 'List Transaction Retrieved',
      transactions: transactions,
    })
  }

  public async show({ response, request, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    let transactions: any
    if (await this.userRepository.checkRolesAdmin(user.role_id)) {
      transactions = await Transaction.query().where('id', params.id).orderBy('id', 'asc')
    } else {
      transactions = await Transaction.query()
        .where('id', params.id)
        .where('farmer_id', user.id)
        .orWhere('distributor_id', user.id)
    }
    return response.json({
      success: 'true',
      message: 'List Transaction Retrieved',
      transactions: transactions,
    })
  }

  public async offerProduct({ request, response, auth }: HttpContextContract) {
    const user = await auth.authenticate()

    await request.validate(TransactionValidator)

    const productId = request.input('product_id')
    const quantity = request.input('quantity')
    const service = request.input('service')
    const price = request.input('price')
    const dateTime = DateTime.now()

    const product = await Product.query().where('id', productId).preload('productFarmer').first()
    if (!product) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Product is not available', data: '' })
    }

    const productLimitBelowPrice =
      product.productFarmer.price - product.productFarmer.price * (10 / 100)
    const productLimitAbovePrice =
      product.productFarmer.price - product.productFarmer.price * (20 / 100)

    if (price && productLimitBelowPrice > price) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You can not offer below 10%', data: '' })
    }

    if (price && productLimitAbovePrice < price) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You can not offer above 20%', data: '' })
    }

    try {
      const transaction = await Transaction.create({
        distributor_id: user.id,
        farmer_id: product.productFarmer.user_id,
        product_id: productId,
        product: product.name,
        service: service,
        uom: product.uom,
        status: 'offer',
        quantity: quantity,
        price: price ?? product.productFarmer.price,
        transaction_dates: dateTime,
      })

      //   const productDistributor = await ProductDistributor.create({
      //     user_id: user.id,
      //     product: product.name,
      //     price: product.productFarmer.price,
      //     uom: product.uom,
      //   })

      //   let data = { transaction, productDistributor }

      return response.status(201).json({
        status: 'success',
        message: 'Transaction Successfully Stored',
        data: transaction,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
    }
  }

  public async update({ request, response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const quantity = request.input('quantity')
    const service = request.input('service')

    const getTransaction = await Transaction.query().where('id', params.id).first()
    if (getTransaction?.status !== 'offer') {
      return response.status(203).json({
        status: 'error',
        message: 'Status already not offer, you cannot change order',
        data: '',
      })
    }

    if (getTransaction.distributor_id !== user.id) {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }

    try {
      const transaction = await Transaction.query().where('id', params.id).update({
        service: service,
        quantity: quantity,
      })

      return response.status(201).json({
        status: 'success',
        message: 'Transaction Successfully Updated',
        data: transaction,
      })
    } catch (error) {
      return response.status(422).json({ status: 'error', message: error.message, data: '' })
    }
  }

  public async answerOffer({ request, response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const answer = request.input('answer')

    const answerSchema = schema.create({
      answer: schema.boolean(),
    })

    await request.validate({ schema: answerSchema })

    const transaction = await Transaction.query().where('id', params.id).first()
    if (transaction?.farmer_id !== user.id || transaction.status !== 'offer') {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }

    let productFarmer = await ProductFarmer.query()
      .where('product_id', transaction.product_id)
      .first()

    if (!productFarmer) {
      return response
        .status(404)
        .json({ status: 'error', message: 'Product is not available', data: '' })
    }

    if (productFarmer.quantity > transaction.quantity) {
      return response
        .status(203)
        .json({ status: 'error', message: 'Product quantity is smaller than required', data: '' })
    }

    if (answer === 'true' || answer === 1) {
      await Transaction.query().where('id', params.id).update({
        status: 'payment',
      })

      // reducing product quantity
      productFarmer.quantity = productFarmer.quantity - transaction.quantity
      await productFarmer.save()

      return response.status(200).json({
        status: 'success',
        message: 'You Accepted the Offer',
        data: '',
      })
    }
    await Transaction.query().where('id', params.id).update({
      status: 'cancel',
    })
    return response.status(200).json({
      status: 'success',
      message: 'You Rejected the Offer',
      data: '',
    })
  }

  public async givePayment({ request, response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const transaction = await Transaction.query().where('id', params.id).first()
    if (transaction?.distributor_id !== user.id || transaction.status !== 'payment') {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }

    const postSchema = schema.create({
      payment_pic: schema.file({
        extnames: ['jpg', 'gif', 'jpeg'],
      }),
    })

    await request.validate({ schema: postSchema })

    const paymentPic = request.file('payment_pic', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    let fileName = 'payment_pic-' + params.id + user.username

    if (paymentPic) {
      await paymentPic.move(Application.tmpPath('uploads/images/payment'), {
        name: fileName + '.' + paymentPic.extname,
      })
    }

    const updateTransaction = await Transaction.query()
      .where('id', params.id)
      .update({
        payment_pic: fileName + '.' + paymentPic?.extname,
      })

    return response.json({
      status: 'success',
      message: 'Payment Check has sended',
      data: '',
    })
  }

  public async delivery({ request, response, auth, params }: HttpContextContract) {
    const user = await auth.authenticate()

    const answer = request.input('answer')

    const answerSchema = schema.create({
      answer: schema.boolean(),
    })

    await request.validate({ schema: answerSchema })

    const transaction = await Transaction.query().where('id', params.id).first()
    if (transaction?.distributor_id !== user.id || transaction.status !== 'delivery') {
      return response
        .status(203)
        .json({ status: 'error', message: 'You are not authorized', data: '' })
    }
    if (answer === 'true' || answer === 1) {
      await Transaction.query().where('id', params.id).update({
        status: 'done',
      })
      return response.status(200).json({
        status: 'success',
        message: 'You Accepted the Offer',
        data: '',
      })
    }
    return response
      .status(203)
      .json({ status: 'error', message: 'You must true the answer', data: '' })
  }
}
