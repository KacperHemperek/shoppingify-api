import { Express } from 'express';
import {
  createSessionHandler,
  getSessionHandler,
  deleteSessionHandler,
  createUserHandler,
} from './controlers/session.controler';
import { requireUser } from './middleware/requireUser';

function routes(app: Express) {
  app.post('/api/session', createSessionHandler);

  app.post('/api/session/new', createUserHandler);

  app.get('/api/session', requireUser, getSessionHandler);

  app.delete('/api/session', requireUser, deleteSessionHandler);
}

export default routes;
