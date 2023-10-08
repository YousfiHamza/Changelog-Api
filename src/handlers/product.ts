import { User } from "@prisma/client";
import { Response, NextFunction } from "express";
import { CustomRequest as Request } from "../modules/auth";

import { CustomError } from "./error";

import db from "../db";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  // const user = await db.user.findUnique({
  //   where: {
  //     id: (req.user as User).id,
  //   },
  // });

  // if (!user) throw new Error("Error Getting Owner of the Products");

  // const products: Product[] = await db.product.findMany({
  //   where: {
  //     userId: user.id,
  //   },
  // });

  // we can do it with one db call

  try {
    const user = await db.user.findUnique({
      where: {
        id: (req.user as User).id,
      },
      include: {
        products: true,
      },
    });

    if (!user) return next(new CustomError("Error Getting Owner of the Products", 403)); // may be jus an over verification since we alreafy have the `protect` middleware.

    res.status(200).json({ products: user.products });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Getting Products", 500, [err]));
  }
};

export const getOneProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) return next(new CustomError("Error Getting Product", 400));

    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Getting Product", 500, [err]));
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.create({
      data: {
        name: req.body.name,
        user: {
          connect: {
            id: (req.user as User).id,
          },
        },
      },
    });

    res.status(201).json({ data: product });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Creating Product", 500, [err]));
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) return next(new CustomError("Error Finding the Product to Update", 400));

    const updatedProduct = await db.product.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
      },
    });

    res.status(200).json({ data: updatedProduct });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Updating Product", 500, [err]));
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) return next(new CustomError("Error Finding the Product to Delete", 400));

    await db.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "Product Deleted", id: req.params.id });
  } catch (err) {
    console.log(err);
    return next(new CustomError("Something Went Wrong Deleting Product", 500, [err]));
  }
};
