import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/users', 'UsersController.index').as('users.index')
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
