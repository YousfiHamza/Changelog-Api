import { User } from "@prisma/client";
import { NextFunction, Response } from "express";
import { CustomRequest as Request } from "../modules/auth";

import { CustomError } from "./error";

import db from "../db";

export const getUpdatesByUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await db.product.findMany({
      where: {
        userId: (req.user as User).id,
      },
      include: {
        updates: true,
      },
    });

    if (!(req.user as User).id) return next(new CustomError("Error Getting Owner of the Updates", 403)); // may be jus an over verification since we alreafy have the `protect` middleware.

    const updates = products.flatMap((product) => product.updates);

    res.status(200).json({ data: updates });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Getting Updates", 500, [err]));
  }
};

export const getOneUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = await db.update.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!update) return next(new CustomError("Error Getting Product", 400));

    res.status(200).json({ update });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Getting Update", 500, [err]));
  }
};

export const createUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.body.productId,
        userId: (req.user as User).id,
      },
    });

    if (!product) return next(new CustomError("Error Creating the Update!", 400));

    const update = await db.update.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        product: {
          connect: {
            id: product.id,
          },
        },
      },
    });
    res.status(201).json({ data: update });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Creating Update", 500, [err]));
  }
};

export const updateUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findFirst({
      where: {
        id: req.body.productId,
        userId: (req.user as User).id,
        updates: {
          some: {
            id: req.params.id,
          },
        },
      },
    });

    if (!product) return next(new CustomError("Error Creating the Update!", 400));

    const updatedUpdate = await db.update.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).json({ data: updatedUpdate });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Updating Update", 500, [err]));
  }
};

export const deleteUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findFirst({
      where: {
        id: req.body.productId,
        userId: (req.user as User).id,
        updates: {
          some: {
            id: req.params.id,
          },
        },
      },
    });

    if (!product) return next(new CustomError("Error Deleting the Update!", 400));

    await db.update.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "Update Deleted", id: req.params.id });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Deleting Update", 500, [err]));
  }
};
