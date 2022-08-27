import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.resource('/datamaster/product/category', 'ProductCategoriesController').apiOnly
})
  .prefix('/api')
  .middleware(['auth', 'verify', 'admin'])
