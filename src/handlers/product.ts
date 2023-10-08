import { User } from "@prisma/client";
import { Response } from "express";
import { CustomRequest as Request } from "../modules/auth";

import db from "../db";

export const getProducts = async (req: Request, res: Response) => {
  try {
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

    const user = await db.user.findUnique({
      where: {
        id: (req.user as User).id,
      },
      include: {
        products: true,
      },
    });

    if (!user) throw new Error("Error Getting Owner of the Products");

    res.status(200).json({ products: user.products });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Getting Products");
  }
};

export const getOneProduct = async (req: Request, res: Response) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) throw new Error("Error Getting Product");

    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Getting Product");
  }
};

export const createProduct = async (req: Request, res: Response) => {
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
    res.status(500).send("Something Went Wrong Creating Product");
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) throw new Error("Error Getting Product");

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
    res.status(500).send("Something Went Wrong Updating Product");
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.params.id,
        userId: (req.user as User).id,
      },
    });

    if (!product) throw new Error("Error Getting Product");

    await db.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: "Product Deleted", id: req.params.id });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Deleting Product");
  }
};
