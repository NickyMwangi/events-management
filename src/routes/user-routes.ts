import { Router } from "express";
import { deleteProfile, listStaff, listUsers, profile, updateProfile, users } from "../controllers/manageUserController";

export const userRoutes = Router();

userRoutes.route("/").get(users)
userRoutes.route("/profile/:id").get(profile)
userRoutes.route("/:id").put(updateProfile).delete(deleteProfile);
userRoutes.route("/manage/list-users").get(listUsers)
userRoutes.route("/manage/list-staff").get(listStaff)