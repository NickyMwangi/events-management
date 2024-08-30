import { Router } from "express";
import { inviteCodes, createInviteCodes, updateInviteCodes, deleteInviteCodes } from "../controllers/eventCodeController";

export const inviteCodeRoutes = Router();

inviteCodeRoutes.route("/").post(createInviteCodes);
inviteCodeRoutes.route("/:eventId").get(inviteCodes);
inviteCodeRoutes.route("/:id").put(updateInviteCodes).delete(deleteInviteCodes);