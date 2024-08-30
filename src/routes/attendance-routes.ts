import { Router } from "express";
import { attendances, createAttendace, deleteAttendance, searchAttendances, updateAttendance, userAttendances } from "../controllers";

export const attendanceRoutes = Router();

attendanceRoutes.route("/").get(attendances).post(createAttendace);
attendanceRoutes.route("/search/all").get(searchAttendances)
attendanceRoutes.route("/:id").put(updateAttendance).delete(deleteAttendance);
attendanceRoutes.route("/:userId").get(userAttendances)