import {Router} from "express";

//controller
import { indexAdmission, showAdmission, storeAdmission } from "../controllers/admission/admission.controller";

const router = Router();

router.route("/").post(storeAdmission);
router.route("/:admission_id").get(showAdmission);
router.route("/").get(indexAdmission);


export default router;