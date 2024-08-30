import { ALLOWED_ORIGIN } from "../configs/base-env";
import cors from "cors";

export const corOptions: cors.CorsOptions = {
  origin: [ALLOWED_ORIGIN],
  credentials: true,
};
