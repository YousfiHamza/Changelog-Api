import { Router } from "express";
import { body } from "express-validator";

import { createProduct, deleteProduct, getOneProduct, getProducts, updateProduct } from "./handlers/product";

import { handleInputErrors } from "./modules/middlewares";

import { productPutValidator, updatePutValidator, updatePostValidator } from "./utils/validators";
import { createUpdate, deleteUpdate, getOneUpdate, getUpdatesByUser, updateUpdate } from "./handlers/update";

const router = Router();

/**
 * Product
 */
router.get("/product", getProducts);

router.get("/product/:id", getOneProduct);

router.post("/product", body("name").isString(), handleInputErrors, createProduct);

router.put("/product/:id", productPutValidator, handleInputErrors, updateProduct);

router.delete("/product/:id", deleteProduct);

// /**
//  * Update
//  */

router.get("/update", getUpdatesByUser);

router.get("/update/:id", getOneUpdate);

router.post("/update", updatePostValidator, handleInputErrors, createUpdate);

router.put("/update/:id", updatePutValidator, handleInputErrors, updateUpdate);

router.delete("/update/:id", deleteUpdate);

// /**
//  * UpdatePoint
//  */

// router.get("/updatepoint", (req: Request, res: Response) => {});

// router.get("/updatepoint/:id", (req: Request, res: Response) => {});

// router.post("/updatepoint", handleInputErrors, (req: Request, res: Response) => {});

// router.put("/updatepoint/:id", updatePointPutValidator, handleInputErrors, (req: Request, res: Response) => {});

// router.delete("/updatepoint/:id", (req: Request, res: Response) => {});

export default router;
