import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import router from "./routes/index.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {notFoundHandler} from "./middlewares/notFoundHandler.js";
import cookieParser from 'cookie-parser';
import { env } from './utils/env.js';
import { UPLOAD_DIR } from './constants/index.js';
// import { swaggerDocs } from './middlewares/swaggerDocs.js';


const allowedOrigins = [
  "http://localhost:5173",    
  "https://goit-react-hw-08-alpha-lake.vercel.app/" 
];

const PORT = Number(env('PORT', '3000'));

export const setupServer = ()=>{

  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: (origin, callback) => {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
  }));
  app.use(cookieParser());
  app.use('/uploads', express.static(UPLOAD_DIR));
  // app.use('/api-docs', swaggerDocs());
  
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};