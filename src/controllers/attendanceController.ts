import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { tryCatchError } from "../utils";

export const attendances = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.attendance.findMany({
    include: {
      user: {
        select: { name: true, email: true, phoneNumber: true, jobGroup: true, nationalID: true }
      },
      event: {
        select: { name: true, startDate: true, endDate: true, inviteCode: true }
      },
      _count: { select: { confirmation: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Attendance retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.attendance.count()
    }
  })
})

export const searchAttendances = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.attendance.findMany({
    where: {
      AND: { user: { name: { contains: req.query.search } } },
      eventId: { in: req.query.eventId.split(",") }
    },
    include: {
      user: {
        select: { name: true, email: true, phoneNumber: true, jobGroup: true, nationalID: true }
      },
      event: {
        select: { name: true, startDate: true, endDate: true, inviteCode: true }
      },
      _count: { select: { confirmation: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Attendance retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.attendance.count({
        where: {
          AND: { user: { name: { contains: req.query.search } } },
          eventId: { in: req.query.eventId.split(",") }
        },
      })
    }
  })
})

export const userAttendances = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.attendance.findMany({
    where: { userId: req.params.userId },
    include: {
      user: {
        select: { name: true, email: true, phoneNumber: true, jobGroup: true, nationalID: true }
      },
      event: {
        select: { name: true, startDate: true, endDate: true }
      },
      _count: { select: { confirmation: true } }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Attendance retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.attendance.count({ where: { userId: req.params.userId }, })
    }
  })
})

export const createAttendace = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { userId, eventId, jobGroup, inviteCode } = req.body;
  const validateInviteCode = await prismaClient.inviteCode.findFirst({ where: { code: inviteCode, isActive: true, eventId: eventId } });
  if (!validateInviteCode) {
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: STATUSMESSAGE.ERROR,
      message: 'Invite code not found or it has been deactivated.'
    })
  }

  const checkExist = await prismaClient.attendance.findFirst({ where: { AND: [{ userId: userId }, { eventId: eventId }] } });
  if (checkExist) {
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: STATUSMESSAGE.ERROR,
      message: 'You have already registered for this event.'
    })
  }
  req.body.totalAmount = await calculateDailyPay(jobGroup, inviteCode)
  const attendance = await prismaClient.attendance.create({
    data: { ...req.body }
  });
  if (attendance) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Attendance created successfully',
      data: attendance
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'attendance not created'
  })
})

export const updateAttendance = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { jobGroup, inviteCode, eventId } = req.body;
  const validateInviteCode = await prismaClient.inviteCode.findFirst({ where: { code: inviteCode, isActive: true, eventId: eventId } });
  if (!validateInviteCode) {
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: STATUSMESSAGE.ERROR,
      message: 'Invite code not found or it has been deactivated.'
    })
  }

  req.body.totalAmount = await calculateDailyPay(jobGroup, inviteCode)
  const attendance = await prismaClient.attendance.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (attendance) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'attendance updated successfully',
      data: attendance
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'attendance failed to update'
  })
})

export const deleteAttendance = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  await prismaClient.attendance.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Attendance deleted successfully'
  })
})

const calculateDailyPay = async (jobGroup: string, inviteCode: string) => {
  let totalAmount = 0.0;
  const jobgrpAmount = (await prismaClient.lookups.findFirst({ where: { code: jobGroup } })).amount;
  const compensations = JSON.parse((await prismaClient.inviteCode.findFirst({ where: { code: inviteCode } })).compensations);
  for (const n in compensations) {
    const compPercent = (await prismaClient.lookups.findFirst({ where: { code: compensations[n] } })).amount;
    totalAmount += (Number(compPercent) * Number(jobgrpAmount)) / 100;
  }
  return totalAmount;
}