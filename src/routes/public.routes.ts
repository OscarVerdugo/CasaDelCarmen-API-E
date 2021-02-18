import { Router} from "express";
//controllers
import { signin, signup } from "../controllers/auth.controller";

const router = Router();

//routes
router.route("/signup").post(signup);
router.route("/signin").post(signin);

export default router;