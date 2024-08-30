
import { allEventsLookups, eventsLookups, inviteCodesLookups, lookups, menus, usersLookups } from './../controllers';
import { Router } from "express";

export const menuRoutes = Router();

menuRoutes.route("/menus").get(menus).post(menus);
menuRoutes.route("/lookups").get(lookups);
menuRoutes.route("/users-lookup").get(usersLookups);
menuRoutes.route("/events-lookup").get(eventsLookups);
menuRoutes.route("/all-events-lookup").get(allEventsLookups);
menuRoutes.route("/invite-code-lookup/:eventId").get(inviteCodesLookups);