import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { tryCatchError } from "../utils";

export const events = async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.event.findMany({
    include: {
      _count: {
        select: { attendance: true, confirmation: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Events retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.event.count()
    }
  })
}

export const searchEvents = async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.event.findMany({
    where: {
      AND: { name: { contains: req.query.search } },
      status: { in: req.query.status.split(",") }
    },
    include: {
      _count: {
        select: { attendance: true, confirmation: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Events retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.event.count({
        where: {
          AND: { name: { contains: req.query.search } },
          status: { in: req.query.status.split(",") }
        },
      })
    }
  })
}

export const eventsStatus = async (req: any, res: Response, next: NextFunction) => {
  const events = await prismaClient.event.findMany({
    where: { status: req.params.status },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Events retrieved successfully',
    data: events,
    metadata: {
      page: Number(req.query.page) + 1,
      perPage: Number(req.query.perPage),
      totalItems: await prismaClient.event.count({ where: { status: req.params.status } })
    }
  })
}

export const createEvent = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const event = await prismaClient.event.create({
    data: { ...req.body }
  });
  if (event) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Event created successfully',
      data: event
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'event not created'
  })
})

export const updateEvent = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const event = await prismaClient.event.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (event) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Event updated successfully',
      data: event
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'event failed to update'
  })
})

export const deleteEvent = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const event = await prismaClient.event.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.SUCCESS).json({
    status: STATUSMESSAGE.SUCCESS,
    message: 'Event deleted successfully'
  })
})
