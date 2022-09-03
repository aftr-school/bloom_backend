import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/users', 'UsersController.index').as('users.index')
  Route.get('/users/:id/show', 'UsersController.show').as('users.show')
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
