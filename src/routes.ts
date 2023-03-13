import { Express } from 'express';
import {
  createSessionHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
} from './controlers/session.controler';
import { requireUser } from './middleware/requireUser';

function routes(app: Express) {
  app.get('/api/check-ok', (req, res) => {
    return res.send('OK');
  });

  app.post('/api/session', createSessionHandler);

  app.get('/api/session', getSessionHandler);

  app.delete('/api/session', requireUser, deleteSessionHandler);

  app.post('/api/session/new', createUserHandler);
}

export default routes;
