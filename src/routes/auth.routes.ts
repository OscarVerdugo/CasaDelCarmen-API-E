import { Router} from "express";

//controllers
import { is } from "../controllers/auth.controller";
//routes
import admisionRoutes from "./admission.routes";
import patientRoutes from "./patient.routes";
//middlewares
import { hasProfile } from "../middleware/Auth.middleware";


const router = Router();
//routes
router.route("/is/:profile").get(is);
//routers
router.use("/admission",[hasProfile("admision")],admisionRoutes);
router.use("/patient",[hasProfile("admision")],patientRoutes)


export default router;
