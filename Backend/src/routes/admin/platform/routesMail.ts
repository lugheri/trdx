import { Router } from 'express'
import MailController from '../../../controllers/MailController'

export default (routes:Router) => {
  routes.post('/newAccount',MailController.newAccount)
  routes.get('/listAccounts',MailController.listAccounts)
  routes.get('/infoAccount/:account_id',MailController.infoAccount)
  routes.patch('/editAccount/:account_id',MailController.editAccount)
  routes.delete('/removeAccount/:account_id',MailController.removeAccount)

  routes.post('/sendMail',MailController.sendMail)
}

