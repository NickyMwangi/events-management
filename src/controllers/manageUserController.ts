import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { tryCatchError } from "../utils";
import { STATUSCODE, STATUSMESSAGE } from "../enums";

export const users = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'users retrieved successfully',
    data: users,
    metadata: {
      totalItems: await prismaClient.user.count()
    }
  })
})

export const listUsers = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany({
    include: {
      userRole: {
        where: { role: { name: 'User' } },
        select: { role: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'list of users retrieved successfully',
    data: users.filter(n => n.userRole.length),
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: users.filter(n => n.userRole.length).length
    }
  })
})

export const searchListUsers = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany({
    where: {
      name: { contains: req.query.search },
    },
    include: {
      userRole: {
        where: { role: { name: 'User' } },
        select: { role: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'list of users retrieved successfully',
    data: users.filter(n => n.userRole.length),
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: users.filter(n => n.userRole.length).length
    }
  })
})

export const listStaff = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const staff = await prismaClient.user.findMany({
    include: {
      userRole: {
        where: { role: { name: { not: 'User' } } },
        select: { role: { select: { name: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'list of staff retrieved successfully',
    data: staff.filter(n => n.userRole.length),
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: staff.filter(n => n.userRole.length).length
    }
  })
})


export const profile = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const profile = await prismaClient.user.findFirst({
    where: { id: req.params.id },
    include: {
      userRole: {
        select: {
          role: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: {
          attendee: true, confirmations: true, userRole: true
        }
      }
    }
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Profile retrieved successfully',
    data: profile
  })
})


export const updateProfile = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const profile = await prismaClient.user.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (profile) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Profile updated successfully',
      data: profile
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Profile failed to update'
  })
})

export const deleteProfile = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  await prismaClient.user.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Profile deleted successfully'
  })
})