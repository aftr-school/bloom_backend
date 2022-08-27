import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/product', 'ProductsController.index')
  Route.get('/product/farmer/:user_id', 'ProductsController.listByFarmer')
  Route.get('/product/:id', 'ProductsController.show')
  Route.post('/product', 'ProductsController.store').middleware(['farmer'])
  Route.post('/product/:id', 'ProductsController.update').middleware(['farmer'])
  Route.delete('/product/:id', 'ProductsController.destroy').middleware(['farmer'])
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
