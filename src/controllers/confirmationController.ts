import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { tryCatchError } from "../utils";

export const confirmations = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmations = await prismaClient.confirmation.findMany({
    include: {
      user: {
        select: { name: true, nationalID: true }
      }, event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      }, attendance: {
        select: { mpesaNumber: true, jobGroup: true }
      },
      creator: {
        select: { name: true, nationalID: true }
      },
      updator: {
        select: { name: true, nationalID: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Confirmations retrieved successfully',
    data: confirmations,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count()
    }
  })
})

export const searchConfirmations = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmations = await prismaClient.confirmation.findMany({
    where: {
      AND: { user: { name: { contains: req.query.search } } },
      eventId: { in: req.query.eventId.split(",") }
    },
    include: {
      user: {
        select: { name: true, nationalID: true }
      }, event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      }, attendance: {
        select: { mpesaNumber: true, jobGroup: true }
      },
      creator: {
        select: { name: true, nationalID: true }
      },
      updator: {
        select: { name: true, nationalID: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Confirmations retrieved successfully',
    data: confirmations,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count({
        where: {
          AND: { user: { name: { contains: req.query.search } } },
          eventId: { in: req.query.eventId.split(",") }
        },
      })
    }
  })
})

export const eventConfirmations = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmations = await prismaClient.confirmation.findMany({
    where: { eventId: req.params.eventId }, include: {
      user: {
        select: { name: true, nationalID: true }
      }, event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      }, attendance: {
        select: { mpesaNumber: true, jobGroup: true }
      },
      creator: {
        select: { name: true, nationalID: true }
      },
      updator: {
        select: { name: true, nationalID: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Event confirmations retrieved successfully',
    data: confirmations,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count({ where: { eventId: req.params.eventId } })
    }
  })
})

export const userConfirmations = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmations = await prismaClient.confirmation.findMany({
    where: { userId: req.params.userId },
    include: {
      user: {
        select: { name: true, nationalID: true }
      }, event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      }, attendance: {
        select: { mpesaNumber: true, jobGroup: true }
      },
      creator: {
        select: { name: true, nationalID: true }
      },
      updator: {
        select: { name: true, nationalID: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'User confirmations retrieved successfully',
    data: confirmations,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count({ where: { userId: req.params.userId } })
    }
  })
})

export const userEventConfirmations = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmations = await prismaClient.confirmation.findMany({
    where: { userId: req.params.userId, eventId: req.params.eventId },
    include: {
      user: {
        select: { name: true, nationalID: true }
      }, event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      }, attendance: {
        select: { mpesaNumber: true, jobGroup: true }
      },
      creator: {
        select: { name: true, nationalID: true }
      },
      updator: {
        select: { name: true, nationalID: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'User and Events confirmations retrieved successfully',
    data: confirmations,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count({ where: { userId: req.params.userId, eventId: req.params.eventId } })
    }
  })
})

export const createConfirmation = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { confirmCode } = req.body;
  const validateConfirmCode = await prismaClient.confirmCode.findFirst({ where: { code: confirmCode, isActive: true } });
  if (!validateConfirmCode) {
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: STATUSMESSAGE.ERROR,
      message: 'Confirmation code not found or it has been deactivated.'
    })
  }
  const confirm = await prismaClient.confirmation.create({
    data: { ...req.body }
  });
  if (confirm) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Confirmation created successfully',
      data: confirm
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Confirmation not created'
  })
})

export const updateConfirmation = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { confirmCode } = req.body;
  const validateConfirmCode = await prismaClient.confirmCode.findFirst({ where: { code: confirmCode, isActive: true } });
  if (!validateConfirmCode) {
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: STATUSMESSAGE.ERROR,
      message: 'Confirmation code not found or it has been deactivated.'
    })
  }
  const confirm = await prismaClient.confirmation.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (confirm) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Confirmation updated successfully',
      data: confirm
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Confirmation failed to update'
  })
})

export const deleteConfirmation = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirm = await prismaClient.confirmation.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Confirmation deleted successfully'
  })
})