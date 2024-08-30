import { Router } from "express";
import { confirmations, createConfirmation, deleteConfirmation, eventConfirmations, searchConfirmations, updateConfirmation, userConfirmations, userEventConfirmations } from "../controllers";

export const confirmationRoutes = Router();

confirmationRoutes.route("/").get(confirmations).post(createConfirmation);
confirmationRoutes.route("/search/confirm/all").get(searchConfirmations)
confirmationRoutes.route("/:id").put(updateConfirmation).delete(deleteConfirmation);
confirmationRoutes.route("/event/:eventId").get(eventConfirmations);
confirmationRoutes.route("/user/:userId").get(userConfirmations);
confirmationRoutes.route("/list/:userId/:eventId").get(userEventConfirmations);