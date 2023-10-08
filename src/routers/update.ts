import { Router } from "express";

import { handleInputErrors } from "../modules/middlewares";

import { updatePutValidator, updatePostValidator } from "../utils/validators";
import { createUpdate, deleteUpdate, getOneUpdate, getUpdatesByUser, updateUpdate } from "../handlers/update";

const router = Router();

// /**
//  * Update
//  */

router.get("/update", getUpdatesByUser);

router.get("/update/:id", getOneUpdate);

router.post("/update", updatePostValidator, handleInputErrors, createUpdate);

router.put("/update/:id", updatePutValidator, handleInputErrors, updateUpdate);

router.delete("/update/:id", deleteUpdate);

export default router;
