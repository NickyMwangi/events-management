import { RoleEnum } from '../enums/role-enum';
import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app";
import { compareSync, hashSync } from "bcrypt";
import { APPError, tryCatchError } from '../utils';
import { sign } from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from '../configs/base-env';
import { STATUSCODE, STATUSMESSAGE } from '../enums';

export const register = tryCatchError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, nationalID, staffNo, jobGroup, jobTitle, phoneNumber, password, confirmPassword } = req.body;

  if (password !== confirmPassword)
    return next(new APPError("Password and confirm password MUST be the same", STATUSCODE.BAD_REQUEST, STATUSMESSAGE.ERROR))

  //check if the default role exists
  const defaultRole = await prismaClient.role.findFirst({ where: { name: RoleEnum.USER } });
  if (!defaultRole)
    return next(new APPError("Service not fully setup", STATUSCODE.NOT_FOUND, STATUSMESSAGE.ERROR))

  //check if the user already exists
  let user = await prismaClient.user.findFirst({ where: { nationalID: nationalID } });
  if (user)
    return next(new APPError(`User with national ID no ${nationalID} already exists`, STATUSCODE.CONFLICT, STATUSMESSAGE.INFO))

  //create the user
  user = await prismaClient.user.create({
    data: {
      name, email, nationalID, staffNo, jobGroup, jobTitle, phoneNumber, password: hashSync(password, 10)
    }
  })

  //create the user role
  if (user) {
    await prismaClient.userRole.create({
      data: {
        userId: user.id,
        roleId: defaultRole.id,
      }
    })
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      data: user,
      message: "User created successfully"
    })
  }
})

export const login = tryCatchError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if (!username || !password)
    return next(new APPError('No nationalID and password provided.', STATUSCODE.BAD_REQUEST, STATUSMESSAGE.INFO));

  let user = await prismaClient.user.findFirst({
    where: { nationalID: username }, include: {
      userRole: { select: { role: { select: { name: true } } } }
    }
  })
  if (compareSync("Abc@123.,", user.password)) {
    return next(new APPError('You MUST reset your password in your first time login.', STATUSCODE.FORBIDDEN, STATUSMESSAGE.PASSWORD));
  }

  if (!user || !compareSync(password, user.password))
    return next(new APPError('Incorrect username or password', STATUSCODE.NOT_FOUND, STATUSMESSAGE.INFO));

  const userToken = generateToken({
    name: user.name,
    id: user.id,
    email: user.email,
    nationalID: user.nationalID,
    phoneNumber: user.phoneNumber,
    userType: await prismaClient.userRole.findMany({ where: { userId: user.id } }),
  })
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Logged in successfully',
    token: userToken,
    user: user
  })
})

//look ups without response
export const authLookups = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { category } = req.query;
  const lookups = await prismaClient.lookups.findMany({ where: { category } });
  if (lookups) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'lookups retrieved successfully',
      data: lookups.map((n) => ({ value: n.code, label: n.description, amount: n.amount }))
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'lookups not created'
  })
})

export const emailVerification = (req: Request, res: Response, next: NextFunction) => {
  console.log("email verification");
}

export const forgotPassword = tryCatchError(async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.body;
  let user = await prismaClient.user.findFirst({ where: { nationalID: username } })
  if (user) {
    const updatedUser = await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashSync("Abc@123.,", 10) }
    })
    if (updatedUser) {
      return res.status(STATUSCODE.SUCCESS).json({
        status: STATUSMESSAGE.SUCCESS,
        message: 'Password reset to default password. Try login then proceed to password reset.'
      })
    } else {
      return next(new APPError('Failed to reset password for ' + username, STATUSCODE.INTERNAL_SERVER_ERROR, STATUSMESSAGE.ERROR))
    }
  }
  else
    return next(new APPError('Invalid user name', STATUSCODE.NOT_FOUND, STATUSMESSAGE.INFO));

})

export const resetPassword = tryCatchError(async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword)
    return next(new APPError("Password and confirm password MUST be the same", STATUSCODE.BAD_REQUEST, STATUSMESSAGE.ERROR))
  let user = await prismaClient.user.findFirst({ where: { nationalID: username } })
  if (user) {
    const updatedUser = await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashSync(password, 10) }
    })
    if (updatedUser) {
      return res.status(STATUSCODE.SUCCESS).json({
        status: STATUSMESSAGE.SUCCESS,
        message: 'Password reset successfully'
      })
    } else {
      return next(new APPError('Failed to reset password for ' + username, STATUSCODE.INTERNAL_SERVER_ERROR, STATUSMESSAGE.ERROR))
    }
  }
  else
    return next(new APPError('Invalid user name', STATUSCODE.NOT_FOUND, STATUSMESSAGE.INFO));

})


const generateToken = (payload: string | object) => {
  return sign(payload, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRES_IN
  })
}
