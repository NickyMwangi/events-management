import { searchListUsers } from './../controllers/manageUserController';
import { Router } from "express";
import { searchAttendances, searchConfirmations, searchEvents, searchPaidList } from "../controllers";

export const searchRoutes = Router();

searchRoutes.route("/events").get(searchEvents)
searchRoutes.route("/attendances").get(searchAttendances)
searchRoutes.route("/confirmations").get(searchConfirmations)
searchRoutes.route("/un-paid-list").get(searchConfirmations)
searchRoutes.route("/paid-list").get(searchPaidList)
searchRoutes.route("/users").get(searchListUsers)