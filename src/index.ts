import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL
      : 'http://localhost:5173',
    credentials: true,
  })
);

function main() {
  routes(app);

  const port = process.env.PORT ?? 4000;

  app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
  });
}

main();
