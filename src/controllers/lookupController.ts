import { NextFunction, Response } from "express";
import { prismaClient } from "../app";
import { STATUSCODE, STATUSMESSAGE } from "../enums";
import { tryCatchError } from "../utils";


export const list = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const { category } = req.query;
  const lookups = await prismaClient.lookups.findMany({
    where: { category },
    orderBy: { createdAt: 'desc' },
    skip: Number(req.query.page) * Number(req.query.perPage),
    take: Number(req.query.perPage),
  });
  if (lookups) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'lookups retrieved successfully',
      data: lookups,
      metadata: {
        page: Number(req.query.page) + 1,
        perPage: Number(req.query.perPage),
        totalItems: await prismaClient.lookups.count({ where: { category } })
      }
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'lookups not created'
  })
})

export const addLookup = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirm = await prismaClient.lookups.create({
    data: { ...req.body }
  });
  if (confirm) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Lookup created successfully',
      data: confirm
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Lookup not created'
  })
})

export const updateLookup = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const confirm = await prismaClient.lookups.update({
    where: { id: req.params.id },
    data: { ...req.body }
  });
  if (confirm) {
    return res.status(STATUSCODE.SUCCESS).json({
      status: STATUSMESSAGE.SUCCESS,
      message: 'Lookup updated successfully',
      data: confirm
    })
  }
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Lookup failed to update'
  })
})

export const deleteLookup = tryCatchError(async (req: any, res: Response, next: NextFunction) => {
  const _ = await prismaClient.lookups.delete({ where: { id: req.params.id } });
  return res.status(STATUSCODE.BAD_REQUEST).json({
    status: STATUSMESSAGE.ERROR,
    message: 'Lookup deleted successfully'
  })
})
