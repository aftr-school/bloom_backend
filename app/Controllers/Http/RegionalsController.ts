import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import District from 'App/Models/District'
import Province from 'App/Models/Province'
import Regency from 'App/Models/Regency'
import Village from 'App/Models/Village'

export default class RegionalsController {
  public async listProvince({ response }: HttpContextContract) {
    const province = await Province.query().orderBy('id', 'asc')

    return response.json({
      status: 'success',
      message: 'List Province Retrieved Successfully',
      data: province,
    })
  }
  public async getRegency({ response, auth, params, request }: HttpContextContract) {
    const regency = await Regency.query().where('province_id', params.province_id)

    return response.json({
      status: 'success',
      message: 'List Regency Retrieved Successfully',
      data: regency,
    })
  }
  public async getDistrict({ response, params }: HttpContextContract) {
    const district = await District.query().where('regency_id', params.regencies_id)

    return response.json({
      status: 'success',
      message: 'List District Retrieved Successfully',
      data: district,
    })
  }
  public async getVillage({ response, params }: HttpContextContract) {
    const village = await Village.query().where('district_id', params.districts_id)

    return response.json({
      status: 'success',
      message: 'List Village Retrieved Successfully',
      data: village,
    })
  }
}
