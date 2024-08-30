import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { tryCatchError } from "../utils";

export const menus = async (req: any, res: Response, next: NextFunction) => {
  const { userId } = req.query;
  const userRoles = await prismaClient.userRole.findMany({ where: { userId }, select: { roleId: true } });
  let allMenus: any[] = [];
  for (const n of userRoles) {
    const menus = await prismaClient.menuRole.findMany({ where: { roleId: n.roleId }, select: { menu: true } });
    allMenus = Array.from(new Set([...allMenus, ...menus.filter(t => t.menu.isVisible === true).map(r => r.menu)]));
  }
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'menus retrieved successfully',
    data: allMenus
  })
}

export const lookups = async (req: any, res: Response, next: NextFunction) => {
  const { category } = req.query;
  const lookups = await prismaClient.lookups.findMany({ where: { category }, orderBy: { code: 'desc' } });
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
}

export const eventsLookups = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { status } = req.query;
  const events = await prismaClient.event.findMany({
    where: { status },
    select: { id: true, name: true, startDate: true, endDate: true },
    orderBy: { createdAt: 'desc' }
  });
  if (events) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'events retrieved successfully',
      data: events.map((n) => ({ value: n.id, label: `${n.name} - ${n.startDate} - ${n.endDate}` }))
    })
  }
})

export const usersLookups = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const users = await prismaClient.user.findMany({ select: { id: true, name: true, jobGroup: true, nationalID: true, jobTitle: true, phoneNumber: true }, orderBy: { name: 'asc' } });
  if (users) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'users retrieved successfully',
      data: users.map((n) => ({ value: n.id, label: `${n.name} - ${n.nationalID} - ${n.jobGroup}`, mpesaNumber: n.phoneNumber, jobGroup: n.jobGroup }))
    })
  }
})

export const inviteCodesLookups = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.inviteCode.findMany({
    where: { eventId: req.params.eventId },
    include: { event: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  });
  if (events) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'invite codes retrieved successfully',
      data: events.map((n) => ({ value: n.code, label: `${n.code} - ${n.event.name}` }))
    })
  }
})

export const allEventsLookups = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.event.findMany({
    select: { id: true, name: true, },
    orderBy: { createdAt: 'desc' }
  });
  if (events) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'events retrieved successfully',
      data: events.map((n) => ({ value: n.id, label: `${n.name}` }))
    })
  }
})

