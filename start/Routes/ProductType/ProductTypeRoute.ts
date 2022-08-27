import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('/datamaster/product/type', 'ProductTypesController').apiOnly
})
  .prefix('/api')
  .middleware(['auth', 'verify', 'admin'])
