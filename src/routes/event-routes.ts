import { Router } from "express";
import { createEvent, deleteEvent, events, eventsStatus, searchEvents, updateEvent } from "../controllers";

export const eventRoutes = Router();

eventRoutes.route("/").get(events).post(createEvent);
eventRoutes.route("/search/all").get(searchEvents);
eventRoutes.route("/:id").put(updateEvent).delete(deleteEvent);
eventRoutes.route("/:status").get(eventsStatus);