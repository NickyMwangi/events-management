
import { addLookup, deleteLookup, list, updateLookup } from './../controllers';
import { Router } from "express";

export const lookupRoutes = Router();

lookupRoutes.route("/").get(list).post(addLookup);
lookupRoutes.route("/:id").put(updateLookup).delete(deleteLookup);