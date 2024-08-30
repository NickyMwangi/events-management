import express, { NextFunction, Request, Response } from "express";
import { rootRouter } from "./routes";
import { PORT } from "./configs/base-env";
import { PrismaClient } from "@prisma/client";
import { APPError, globalErrorHandler, tryCatchError } from "./utils";
import { STATUSCODE, STATUSMESSAGE } from "./enums";
import { allowCrossDomain } from "./middlewares";


const app = express();
app.use(allowCrossDomain);
app.use(express.json()); //Allow to post and get json.
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to NSDCC USSD API')
})

//configure all routes
app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
  log: ['query']
})

app.use('*', tryCatchError(async (req: Request, res: Response, next: NextFunction) => {
  throw new APPError(`Cannot find ${req.originalUrl} on this server`, STATUSCODE.NOT_FOUND, STATUSMESSAGE.ERROR)
}));

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})