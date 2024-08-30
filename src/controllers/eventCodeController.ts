import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { tryCatchError } from "../utils";
import { STATUSCODE, STATUSMESSAGE } from "../enums";


export const inviteCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const inviteCodes = await prismaClient.inviteCode.findMany({
    where: { eventId: req.params.eventId },
    include: {
      event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Invite codes retrieved successfully',
    data: inviteCodes,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count()
    }
  })
})

export const createInviteCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const invite = await prismaClient.inviteCode.create({
    data: { ...req.body }
  });
  if (invite) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Invite code generated successfully',
      data: invite
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Invite code not generated.'
  })
})


export const updateInviteCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const event = await prismaClient.inviteCode.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (event) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Invite code updated successfully',
      data: event
    })
  }

  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Invite code failed to update'
  })
})

export const deleteInviteCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  await prismaClient.inviteCode.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Invite code deleted successfully'
  })
})


//Confirm Codes
export const confirmCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirmCodes = await prismaClient.confirmCode.findMany({
    where: { eventId: req.params.eventId },
    include: {
      event: {
        select: { name: true, startDate: true, endDate: true, status: true }
      },
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Confirm codes retrieved successfully',
    data: confirmCodes,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.confirmation.count()
    }
  })
})


export const createConfirmCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirm = await prismaClient.confirmCode.create({
    data: { ...req.body }
  });
  if (confirm) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Confirm code generated successfully',
      data: confirm
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Confirm code not generated.'
  })
})

export const updateConfirmCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const event = await prismaClient.confirmCode.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (event) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Confirm code updated successfully',
      data: event
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Confirm code failed to update'
  })
})

export const deleteConfirmCodes = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  await prismaClient.confirmCode.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Confirm code deleted successfully'
  })
})