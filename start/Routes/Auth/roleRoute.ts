import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/roles', 'RolesController.index').as('roles.index')
}).prefix('/api')
