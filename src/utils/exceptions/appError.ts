import { STATUSCODE, STATUSMESSAGE } from "../../enums";

export class APPError extends Error {
  isOperational: boolean;
  statusCode: STATUSCODE;
  status: STATUSMESSAGE;
  constructor(message: string, statusCode: STATUSCODE, statusMsg: STATUSMESSAGE) {
    super(message)
    this.status = statusMsg;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this); this
  }
}