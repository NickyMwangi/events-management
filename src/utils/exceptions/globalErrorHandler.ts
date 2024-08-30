import { NextFunction, Request, Response } from "express";
import { APPError } from "./appError";
import { NODE_ENV } from "../../configs/base-env";

const handleDevError = (err: APPError, res: Response) => {
  const statusCode = err.statusCode || 422;
  const status = err.status || 'error';
  const message = err.message || "The request could not be processed.";
  const stack = err.stack || 'Unprocessable entity';
  if (err.isOperational)
    res.status(statusCode).json({ status, message, stack });
  else
    res.status(statusCode).json({ status, message: 'An error occurred while processsing the request.', stack });
}

const handleProductionsError = (err: APPError, res: Response) => {
  const statusCode = err.statusCode || 422;
  const status = err.status || 'error';
  const message = err.message || "The request could not be processed.";
  if (err.isOperational)
    res.status(statusCode).json({ status, message });
  else
    res.status(statusCode).json({ status, message: 'An error occurred while processsing the request.' });

}

export const globalErrorHandler = (err: APPError, req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'development')
    handleDevError(err, res);
  else
    handleProductionsError(err, res);
}