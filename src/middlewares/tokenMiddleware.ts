import { NextFunction, Request, Response } from "express";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { verify } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../configs/base-env";
import { prismaClient } from "../app";
import { APPError, tryCatchError } from "../utils";

export const jwtTokenVerification = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  let idToken = '';
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    idToken = req.headers.authorization.split('Bearer ')[1];

  if (!idToken)
    return next(new APPError('Access denied. Login to have access.', STATUSCODE.BAD_REQUEST, STATUSMESSAGE.ERROR));

  const tokenDetails = verify(idToken, JWT_SECRET_KEY) as any;
  const thisuser = await prismaClient.user.findFirst({ where: { id: tokenDetails.id } })
  if (!thisuser)
    return next(new APPError('User no longer has access.', STATUSCODE.UNAUTHORIZED, STATUSMESSAGE.ERROR));

  req.user = thisuser;
  return next();

})