import { Router } from "express";

import { signup, signin } from "../handlers/user";
import { handleInputErrors } from "../modules/middlewares";
import { signUpValidator, signInValidator } from "../utils/validators";

const router = Router();

// /**
//  * User
//  */

router.post("/signup", signUpValidator, handleInputErrors, signup);

router.post("/signin", signInValidator, handleInputErrors, signin);

export default router;
