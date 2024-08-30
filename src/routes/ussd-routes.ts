import { Router } from "express";
import { ussdHandler } from "../controllers/ussdController";

const ussdRoutes = Router();

ussdRoutes.get('/', ussdHandler);

export default ussdRoutes;
