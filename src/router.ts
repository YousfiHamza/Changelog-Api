import { Router, Response } from "express";

import { CustomRequest as Request } from "./modules/auth";

import { User } from "@prisma/client";

const router = Router();
/**
 * Product
 */
router.get("/product", (req: Request, res: Response) => {
  const user = req.user as User;
  if (user) res.json({ message: `Hello ${user.username}` });
  else res.status(500).json({ message: `ERROR LOGIC` });
});

// router.get("/product/:id", (req: Request, res: Response) => {});

// router.post("/product", (req: Request, res: Response) => {});

// router.put("/product/:id", (req: Request, res: Response) => {});

// router.delete("/product/:id", (req: Request, res: Response) => {});

// /**
//  * Update
//  */

// router.get("/update", (req: Request, res: Response) => {});

// router.get("/update/:id", (req: Request, res: Response) => {});

// router.post("/update", (req: Request, res: Response) => {});

// router.put("/update/:id", (req: Request, res: Response) => {});

// router.delete("/update/:id", (req: Request, res: Response) => {});

// /**
//  * UpdatePoint
//  */

// router.get("/updatepoint", (req: Request, res: Response) => {});

// router.get("/updatepoint/:id", (req: Request, res: Response) => {});

// router.post("/updatepoint", (req: Request, res: Response) => {});

// router.put("/updatepoint/:id", (req: Request, res: Response) => {});

// router.delete("/updatepoint/:id", (req: Request, res: Response) => {});

export default router;
