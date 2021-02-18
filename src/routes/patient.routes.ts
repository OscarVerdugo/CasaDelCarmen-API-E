import {Router} from "express";

//controllers
import {deletePatient, indexPatient, showPatient, storePatient, updatePatient} from "../controllers/general/patient.controller";

const router = Router();

router.route("/").post(storePatient);
router.route("/:patient_id").put(updatePatient);
router.route("/:patient_id").delete(deletePatient);
router.route("/").get(indexPatient);
router.route("/:patient_id").get(showPatient);




export default router;