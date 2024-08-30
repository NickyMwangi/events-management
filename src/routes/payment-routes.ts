import { Router } from "express";
import { createPayment, deletePayment, paidList, unPaidList, updatePayment } from "../controllers";

export const paymentRoutes = Router();

paymentRoutes.route("/").post(createPayment);
paymentRoutes.route("/unpaid").get(unPaidList);
paymentRoutes.route("/paid").get(paidList);
paymentRoutes.route("/:id").put(updatePayment).delete(deletePayment);