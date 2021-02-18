import {Router} from "express";

//routers
import publicRoutes from "./public.routes";
import authRoutes from "./auth.routes";
//controllers
import {index} from "../controllers/index.controller";
//middlewares
import { Auth } from "../middleware/Auth.middleware";

const router = Router();

//public routers
router.use("/public",publicRoutes);

//protected routers
router.use("/auth",[Auth],authRoutes);

export default router;
