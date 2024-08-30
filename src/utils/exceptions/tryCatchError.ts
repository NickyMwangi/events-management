import { NextFunction, Request, Response } from "express";

export const tryCatchError = (fn: Function) => {
  const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next) 
   }
   return errorHandler; 
}