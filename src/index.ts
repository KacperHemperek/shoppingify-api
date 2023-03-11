import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import routes from './routes';
import { deserializeUser } from './middleware/deserializeUser';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(deserializeUser);

app.use(cors());

function main() {
  routes(app);

  const port = process.env.PORT ?? 4000;

  app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
}

main();
