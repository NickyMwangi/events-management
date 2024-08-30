import { NextFunction, Response } from "express";
import { tryCatchError } from "../utils";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";

export const unPaidList = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmIds = await prismaClient.payment.findMany({
    select: { confirmId: true },
    orderBy: { createdAt: 'desc' },
  });
  const unpaid = await prismaClient.confirmation.findMany({
    where: { id: { notIn: confirmIds.map(n => n.confirmId) } },
    include: {
      user: {
        select: { name: true, email: true, nationalID: true, phoneNumber: true }
      },
      event: {
        select: { name: true, startDate: true, endDate: true }
      },
      attendance: {
        select: { mpesaNumber: true, jobGroup: true, totalAmount: true, inviteCode: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Un paid list retrieved successfully',
    data: unpaid,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count({
        where: { id: { notIn: confirmIds.map(n => n.confirmId) } },
      })
    }
  })
})

export const searchUnPaidList = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const unpaid = await prismaClient.confirmation.findMany({
    where: {
      AND: { user: { name: { contains: req.query.search } } },
      eventId: { in: req.query.eventId.split(",") }
    },
    include: {
      user: {
        select: { name: true, nationalID: true }
      },
      event: {
        select: { name: true, endDate: true }
      },
      attendance: {
        select: { mpesaNumber: true, jobGroup: true, totalAmount: true, inviteCode: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Un paid list retrieved successfully',
    data: unpaid,
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

export const paidList = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const paid = await prismaClient.payment.findMany({
    include: {
      user: {
        select: { name: true, nationalID: true }
      },
      event: {
        select: { name: true }
      },
      attendance: {
        select: { mpesaNumber: true, jobGroup: true, inviteCode: true }
      },
      confirmation: {
        select: { confirmCode: true }
      },
      accountant: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Paid list retrieved successfully',
    data: paid,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.payment.count()
    }
  })
})

export const searchPaidList = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const paid = await prismaClient.payment.findMany({
    where: {
      AND: { user: { name: { contains: req.query.search } } },
      eventId: { in: req.query.eventId.split(",") }
    },
    include: {
      user: {
        select: { name: true, nationalID: true }
      },
      event: {
        select: { name: true }
      },
      attendance: {
        select: { mpesaNumber: true, jobGroup: true, inviteCode: true }
      },
      confirmation: {
        select: { confirmCode: true }
      },
      accountant: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Paid list retrieved successfully',
    data: paid,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.payment.count({
        where: {
          AND: { user: { name: { contains: req.query.search } } },
          eventId: { in: req.query.eventId.split(",") }
        },
      })
    }
  })
})

export const createPayment = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const pay = await prismaClient.payment.createMany({
    data: req.body.allPayment
  });
  if (pay) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'CSV generated successfully',
      data: pay
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'CSV could not be generated'
  })
})


export const updatePayment = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const pay = await prismaClient.payment.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (pay) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Payment updated successfully',
      data: pay
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Payment failed to update'
  })
})

export const deletePayment = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  await prismaClient.payment.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Payment deleted successfully'
  })
})