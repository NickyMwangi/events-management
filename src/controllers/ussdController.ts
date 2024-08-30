import { Request, Response } from "express";
import { prismaClient } from "../app";
import { hashSync } from "bcrypt";
import { RoleEnum } from "../enums";

export const ussdHandler = async (req: any, res: Response) => {
  const payload = req.query;
  const parts = payload.DATA;
  const MSISDN = payload.MSISDN;
  const SESSIONID = payload.SESSIONID;
  let STAGE = payload.STAGE;
  let USSD_TEXT = '';

  console.log(`Received USSD payload: ${JSON.stringify(payload)}`);

  // Check if the input is to return to the main menu
  if (parts.includes('98')) {
    USSD_TEXT = "Welcome to NSDCC Events:\n1. Register for an Event\n2. Confirm Attendance";
    STAGE = "CONT";
    res.contentType('text/plain');
    return res.send(`${USSD_TEXT}|${SESSIONID}| ${MSISDN}|${STAGE}`);
  }

  if (parts === "")
    USSD_TEXT = "Welcome to NSDCC Events:\n1. Register for an Event\n2. Confirm Attendance";
  else if (parts === "1")
    USSD_TEXT = "Register for:\n1. Self\n2. Other\n98. Back to Main Menu";
  else if (parts === "2")
    USSD_TEXT = "Confirm for:\n1. Self\n2. Other\n98. Back to Main Menu";
  else if (parts === "1*1" || parts === "2*1")
    USSD_TEXT = "Enter your National ID:\n98. Back to Main Menu";
  else if (parts === "1*2" || parts === "2*2")
    USSD_TEXT = "Enter other National ID:\n98. Back to Main Menu";
  else
    USSD_TEXT = "Invalid input. Please try again.\n98. Back to Main Menu";

  // switch (parts) {
  //   case "":
  //     USSD_TEXT = "Welcome to NSDCC Events:\n1. Register for an Event\n2. Confirm Attendance";
  //     break;

  //   case "1":
  //     switch (parseInt(parts[0])) {
  //       case 1:
  //         USSD_TEXT = "Register for:\n1. Self\n2. Other\n98. Back to Main Menu";
  //         break;
  //       case 2:
  //         USSD_TEXT = "Confirm for:\n1. Self\n2. Other\n98. Back to Main Menu";
  //         break;
  //       default:
  //         USSD_TEXT = "Invalid option. Please try again.\n98. Back to Main Menu";
  //         break;
  //     }
  //     break;

  //   case "1*1":
  //     switch (parseInt(parts[1])) {
  //       case 1:
  //         USSD_TEXT = "Enter your National ID:\n98. Back to Main Menu";
  //         break;
  //       case 2:
  //         USSD_TEXT = "Enter other National ID:\n98. Back to Main Menu";
  //         break;
  //       default:
  //         USSD_TEXT = "Invalid option. Please try again.\n98. Back to Main Menu";
  //         break;
  //     }
  //     break;

  //   case 3:
  //     if (parseInt(parts[0]) === 1) {
  //       switch (parseInt(parts[1])) {
  //         case 1:
  //           USSD_TEXT = "Enter your invite code:\n98. Back to Main Menu";
  //           break;
  //         case 2:
  //           USSD_TEXT = "Enter other invite code:\n98. Back to Main Menu";
  //           break;
  //         default:
  //           USSD_TEXT = "Invalid option. Please try again.\n98. Back to Main Menu";
  //           break;
  //       }
  //     } else if (parseInt(parts[0]) === 2) {
  //       const nationalID = Number(parts[2]);
  //       const userExists = await prismaClient.user.findFirst({ where: { nationalID } });
  //       if (userExists) {
  //         switch (parseInt(parts[1])) {
  //           case 1:
  //             USSD_TEXT = "Enter your confirmation code:\n98. Back to Main Menu";
  //             break;
  //           case 2:
  //             USSD_TEXT = "Enter other confirmation code:\n98. Back to Main Menu";
  //             break;
  //           default:
  //             USSD_TEXT = "Invalid option. Please try again.\n98. Back to Main Menu";
  //             break;
  //         }
  //       } else {
  //         USSD_TEXT = "We cannot find your account. Register for an event to proceed.\n98. Back to Main Menu";
  //       }
  //     }
  //     break;

  //   case 4:
  //     const nationalID = Number(parts[2]);

  //     if (parseInt(parts[0]) === 1) {
  //       const inviteCode = parts[3];
  //       const inviteExists = await prismaClient.inviteCode.findFirst({
  //         where: { code: inviteCode }
  //       });
  //       if (inviteExists) {
  //         const alreadyRegistered = await prismaClient.attendance.findFirst({
  //           where: { inviteCode: inviteCode, user: { nationalID: nationalID } }
  //         });
  //         if (alreadyRegistered) {
  //           USSD_TEXT = "You have already registered for an event using this invite code.\n98. Back to Main Menu";
  //         } else {
  //           const userExists = await prismaClient.user.findFirst({ where: { nationalID } });
  //           if (userExists) {
  //             const atta = await prismaClient.attendance.create({
  //               data: {
  //                 userId: userExists.id,
  //                 eventId: inviteExists.eventId,
  //                 mpesaNumber: userExists.phoneNumber,
  //                 jobGroup: userExists.jobGroup,
  //                 inviteCode: inviteCode,
  //                 totalAmount: await calculateDailyPay(userExists.jobGroup, inviteCode),
  //                 createdBy: userExists.id,
  //                 updatedBy: userExists.id
  //               }
  //             });
  //             USSD_TEXT = atta ? "Event registration successful!" : "Failed to register for event. Try again after sometime.\n98. Back to Main Menu";
  //           } else {
  //             USSD_TEXT = "Enter your full name:\n98. Back to Main Menu";
  //           }
  //         }
  //       } else {
  //         USSD_TEXT = "Invalid invite code. Enter a valid invite Code:\n98. Back to Main Menu";
  //       }
  //     } else if (parseInt(parts[0]) === 2) {
  //       const confirmCode = parts[3];
  //       const confirmExists = await prismaClient.confirmCode.findFirst({
  //         where: { code: confirmCode }
  //       });
  //       if (confirmExists) {
  //         const alreadyConfirmed = await prismaClient.confirmation.findFirst({
  //           where: { confirmCode: confirmCode, user: { nationalID: nationalID } }
  //         });
  //         if (alreadyConfirmed) {
  //           USSD_TEXT = "You have already confirmed attendance using this confirmation code.\n98. Back to Main Menu";
  //         } else {
  //           const attendanceExists = await prismaClient.attendance.findFirst({
  //             where: { eventId: confirmExists.eventId, user: { nationalID } }
  //           });
  //           if (attendanceExists) {
  //             await prismaClient.confirmation.create({
  //               data: {
  //                 userId: attendanceExists.userId,
  //                 eventId: confirmExists.eventId,
  //                 attendanceId: attendanceExists.id,
  //                 confirmCode: confirmCode,
  //                 createdBy: attendanceExists.userId,
  //                 updatedBy: attendanceExists.userId
  //               }
  //             });
  //             USSD_TEXT = "Attendance confirmation successful!\n98. Back to Main Menu";
  //           } else {
  //             USSD_TEXT = "No attendance found. Register for an event first.\n98. Back to Main Menu";
  //           }
  //         }
  //       } else {
  //         USSD_TEXT = "Invalid confirmation code. Enter a valid confirmation Code:\n98. Back to Main Menu";
  //       }
  //     }
  //     break;

  //   case 5:
  //     if (parseInt(parts[1]) === 1) {
  //       const idNumber = parseInt(parts[2]);
  //       const fullName = parts[4];
  //       const user = await prismaClient.user.create({
  //         data: {
  //           name: fullName,
  //           email: null,
  //           nationalID: idNumber,
  //           staffNo: null,
  //           jobGroup: "A",
  //           jobTitle: null,
  //           dob: null,
  //           phoneNumber: MSISDN,
  //           password: hashSync("Abc@123.,", 10),
  //         }
  //       });
  //       if (user) {
  //         const defaultRole = await prismaClient.role.findFirst({ where: { name: RoleEnum.USER } });
  //         await prismaClient.userRole.create({
  //           data: {
  //             userId: user.id,
  //             roleId: defaultRole.id,
  //           }
  //         });
  //       }
  //       const inviteCode = parts[3];
  //       const invite = await prismaClient.inviteCode.findFirst({ where: { code: inviteCode } });
  //       const attendance = await prismaClient.attendance.create({
  //         data: {
  //           userId: user.id,
  //           eventId: invite.eventId,
  //           mpesaNumber: user.phoneNumber,
  //           jobGroup: user.jobGroup,
  //           inviteCode: invite.code,
  //           totalAmount: await calculateDailyPay(user.jobGroup, invite.code),
  //           createdBy: user.id,
  //           updatedBy: user.id
  //         }
  //       });
  //       USSD_TEXT = attendance ? "Event registration successful!" : "Failed to register for event. Try again after sometime.\n98. Back to Main Menu";
  //     } else if (parseInt(parts[1]) === 2) {
  //       USSD_TEXT = "Enter other phone number:\n98. Back to Main Menu";
  //     }
  //     break;

  //   case 6:
  //     const idNumber = parseInt(parts[2]);
  //     const fullName = parts[4];
  //     const phone = parts[5];
  //     const user = await prismaClient.user.create({
  //       data: {
  //         name: fullName,
  //         email: null,
  //         nationalID: idNumber,
  //         staffNo: null,
  //         jobGroup: "A",
  //         jobTitle: null,
  //         dob: null,
  //         phoneNumber: phone,
  //         password: hashSync("Abc@123.,", 10),
  //       }
  //     });
  //     if (user) {
  //       const defaultRole = await prismaClient.role.findFirst({ where: { name: RoleEnum.USER } });
  //       await prismaClient.userRole.create({
  //         data: {
  //           userId: user.id,
  //           roleId: defaultRole.id,
  //         }
  //       });
  //     }
  //     const inviteCode = parts[3];
  //     const invite = await prismaClient.inviteCode.findFirst({ where: { code: inviteCode } });
  //     const attendance = await prismaClient.attendance.create({
  //       data: {
  //         userId: user.id,
  //         eventId: invite.eventId,
  //         mpesaNumber: user.phoneNumber,
  //         jobGroup: user.jobGroup,
  //         inviteCode: invite.code,
  //         totalAmount: await calculateDailyPay(user.jobGroup, invite.code),
  //         createdBy: user.id,
  //         updatedBy: user.id
  //       }
  //     });
  //     USSD_TEXT = attendance ? "Event registration successful!" : "Failed to register for event. Try again after sometime.\n98. Back to Main Menu";
  //     break;
  //   default:
  //     USSD_TEXT = "Invalid input. Please try again.\n98. Back to Main Menu";
  //     break;
  // }

  res.contentType('text/plain');
  STAGE = "CONT";
  const ussdResp = `${USSD_TEXT}|${SESSIONID}|${MSISDN}|${STAGE}`
  return res.send(ussdResp);
};

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
