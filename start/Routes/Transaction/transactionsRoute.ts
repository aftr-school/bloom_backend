import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/transaction', 'TransactionsController.index')
  Route.get('/transaction/:id', 'TransactionsController.show')
  Route.post('/transaction', 'TransactionsController.offerProduct').middleware(['distributor'])
  Route.post('/transaction/:id', 'TransactionsController.update').middleware(['distributor'])

  Route.put('/transaction/:id/answer', 'TransactionsController.answerOffer').middleware(['farmer'])
  Route.post('/transaction/:id/payment', 'TransactionsController.givePayment').middleware([
    'distributor',
  ])
  Route.post('/transaction/:id/delivery', 'TransactionsController.delivery').middleware([
    'distributor',
  ])
})
  .prefix('/api')
  .middleware(['auth', 'verify'])
