import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import {
  Custom_error,
  async_error_handler,
  error_middleware,
} from '@himanshu_guptaorg/utils';
import { buyerRouter } from './controllers/userRoutes/buyer/router';
import { sellerRouter } from './controllers/userRoutes/seller/router';
import { adminRouter } from './controllers/userRoutes/admin/router';
import { deliveryRouter } from './controllers/userRoutes/delivery/router';
const requestCheckerMiddleWare = async_error_handler(async (req, res, next) => {
  console.log(req.url);
  next();
});
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1/buyer', requestCheckerMiddleWare, buyerRouter);
app.use('/api/v1/seller', requestCheckerMiddleWare, sellerRouter);
app.use('/api/v1/admin', requestCheckerMiddleWare, adminRouter);
app.use('/api/v1/delivery', requestCheckerMiddleWare, deliveryRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Custom_error({
    errors: [{ message: 'pageNotFound' }],
    statusCode: 404,
  });
  next(err);
});
app.use(error_middleware);
export { app };
