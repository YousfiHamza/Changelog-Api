import { Router } from "express";

import { signup, signin } from "../handlers/user";
import { handleInputErrors } from "../modules/middlewares";
import { signUpValidator, signInValidator } from "../utils/validators";

const router = Router();

// /**
//  * User
//  */

router.post("/user/signup", signUpValidator, handleInputErrors, signup);

router.post("/user/signin", signInValidator, handleInputErrors, signin);

export default router;
