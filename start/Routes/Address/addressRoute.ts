import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/regional/province', 'RegionalsController.listProvince')
  Route.get('/regional/regency/:province_id/province', 'RegionalsController.getRegency')
  Route.get('/regional/district/:regencies_id/regency', 'RegionalsController.getDistrict')
  Route.get('/regional/village/:districts_id/district', 'RegionalsController.getVillage')
}).prefix('/api')
