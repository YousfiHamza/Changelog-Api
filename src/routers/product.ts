import { Router } from "express";
import { body } from "express-validator";

import { handleInputErrors } from "../modules/middlewares";

import { productPutValidator } from "../utils/validators";
import { createProduct, deleteProduct, getOneProduct, getProducts, updateProduct } from "../handlers/product";

const router = Router();

/**
 * Product
 */

router.get("/product", getProducts);

router.get("/product/:id", getOneProduct);

router.post("/product", body("name").isString(), handleInputErrors, createProduct);

router.put("/product/:id", productPutValidator, handleInputErrors, updateProduct);

router.delete("/product/:id", deleteProduct);

export default router;
