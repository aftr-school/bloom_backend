import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/datamaster/product/category', 'ProductCategoriesController.index')
  Route.get('/datamaster/product/category/:id', 'ProductCategoriesController.show')
  Route.post('/datamaster/product/category', 'ProductCategoriesController.store').middleware([
    'admin',
  ])
  Route.post('/datamaster/product/category/:id', 'ProductCategoriesController.update').middleware([
    'admin',
  ])
  Route.delete(
    '/datamaster/product/category/:id',
    'ProductCategoriesController.destroy'
  ).middleware(['admin'])
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
