import { Router } from "express";
import { authRoutes } from "./auth-routes";
import { menuRoutes } from "./menuRoutes";
import { jwtTokenVerification } from "../middlewares";
import { eventRoutes } from "./event-routes";
import { attendanceRoutes } from "./attendance-routes";
import { confirmationRoutes } from "./confirmation-routes";
import { userRoutes } from "./user-routes";
import { paymentRoutes } from "./payment-routes";
import { inviteCodeRoutes } from "./invite-code-routes";
import { confirmCodeRoutes } from "./confirm-code-route";
import { lookupRoutes } from "./lookup-routes";
import ussdRoutes from "./ussd-routes";
import { searchRoutes } from "./search-routes";

export const rootRouter: Router = Router();

rootRouter.use('/auth', authRoutes);
rootRouter.use('/ussd', ussdRoutes);
rootRouter.use('/', jwtTokenVerification, menuRoutes);
rootRouter.use('/events', jwtTokenVerification, eventRoutes);
rootRouter.use('/attendances', jwtTokenVerification, attendanceRoutes);
rootRouter.use('/confirmations', jwtTokenVerification, confirmationRoutes);
rootRouter.use('/users', jwtTokenVerification, userRoutes);
rootRouter.use('/payments', jwtTokenVerification, paymentRoutes);
rootRouter.use('/invite-code', jwtTokenVerification, inviteCodeRoutes);
rootRouter.use('/confirm-code', jwtTokenVerification, confirmCodeRoutes);
rootRouter.use('/lookup', jwtTokenVerification, lookupRoutes);
rootRouter.use('/search', jwtTokenVerification, searchRoutes);