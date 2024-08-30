import { Router } from "express";
import { confirmCodes, createConfirmCodes, deleteConfirmCodes, updateConfirmCodes } from "../controllers/eventCodeController";

export const confirmCodeRoutes = Router();

confirmCodeRoutes.route("/").post(createConfirmCodes);
confirmCodeRoutes.route("/:eventId").get(confirmCodes);
confirmCodeRoutes.route("/:id").put(updateConfirmCodes).delete(deleteConfirmCodes);