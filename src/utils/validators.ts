import { body, oneOf } from "express-validator";

export const productPutValidator = [body("name").isString()];

export const updatePostValidator = [
  body("title").exists().isString(),
  body("content").exists().isString(),
  body("productId").exists().isString(),
];

export const updatePutValidator = [
  body("title").optional(),
  body("content").optional(),
  oneOf([body("status").equals("IN_PROGRESS"), body("status").equals("SHIPPED"), body("status").equals("DEPRECATED")]),
  body("version").optional(),
];

export const updatePointPostValidator = [
  body("name").optional().isString(),
  body("description").optional().isString(),
  body("updateId").exists().isString(),
];

export const updatePointPutValidator = [
  body("name").optional().isString(),
  body("description").optional().isString(),
  body("updateId").exists().isString(),
];
