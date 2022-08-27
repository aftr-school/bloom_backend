import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/datamaster/product/type', 'ProductTypesController.index')
  Route.get('/datamaster/product/type/:id', 'ProductTypesController.show')
  Route.post('/datamaster/product/type', 'ProductTypesController.store').middleware(['admin'])
  Route.post('/datamaster/product/type/:id', 'ProductTypesController.update').middleware(['admin'])
  Route.delete('/datamaster/product/type/:id', 'ProductTypesController.destroy').middleware([
    'admin',
  ])
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
