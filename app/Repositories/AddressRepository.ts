import Regency from 'App/Models/Regency'
import Village from 'App/Models/Village'
import Province from 'App/Models/Province'
import District from 'App/Models/District'

export default class AddressRepository {
  public async getAddress(
    villageId: number,
    districtId: number,
    regencyId: number,
    provinceId: number
  ) {
    let data = []
    let village = await Village.query().where('id', villageId).first()
    let district = await District.query().where('id', districtId).first()
    let regency = await Regency.query().where('id', regencyId).first()
    let province = await Province.query().where('id', provinceId).first()

    return { village, district, regency, province }
  }
}
