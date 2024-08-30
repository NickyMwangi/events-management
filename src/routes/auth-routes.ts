import { Router } from "express";
import { authLookups, forgotPassword, login, register, resetPassword } from "../controllers";

export const authRoutes = Router();
authRoutes.route("/lookups").get(authLookups);
authRoutes.route("/login").post(login);
authRoutes.route("/register").post(register);
authRoutes.route("/reset-password").post(resetPassword);
authRoutes.route("/forgot-password").post(forgotPassword);
