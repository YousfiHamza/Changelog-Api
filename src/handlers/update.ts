import { User } from "@prisma/client";
import { Response } from "express";
import { CustomRequest as Request } from "../modules/auth";

import db from "../db";

export const getUpdatesByUser = async (req: Request, res: Response) => {
  try {
    const products = await db.product.findMany({
      where: {
        userId: (req.user as User).id,
      },
      include: {
        updates: true,
      },
    });

    if (!(req.user as User).id) throw new Error("Error Getting Owner of the Updates");

    const updates = products.flatMap((product) => product.updates);

    res.status(200).json({ data: updates });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Getting Updates");
  }
};

export const getOneUpdate = async (req: Request, res: Response) => {
  try {
    const update = await db.update.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!update) {
      res.status(400).json({ message: "Error Getting the Updates!" });
    } else {
      res.status(200).json({ update });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Getting Update");
  }
};

export const createUpdate = async (req: Request, res: Response) => {
  try {
    const product = await db.product.findUnique({
      where: {
        id: req.body.productId,
        userId: (req.user as User).id,
      },
    });

    if (!product) {
      res.status(400).json({ message: "Error Creating the Update!" });
    } else {
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
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Creating Update");
  }
};

export const updateUpdate = async (req: Request, res: Response) => {
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
    if (!product) {
      res.status(400).json({ message: "Error Updating the Update!" });
    } else {
      const updatedUpdate = await db.update.update({
        where: {
          id: req.params.id,
        },
        data: req.body,
      });

      res.status(200).json({ data: updatedUpdate });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Updating Update");
  }
};

export const deleteUpdate = async (req: Request, res: Response) => {
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
    if (!product) {
      res.status(400).json({ message: "Error Updating the Update!" });
    } else {
      await db.update.delete({
        where: {
          id: req.params.id,
        },
      });

      res.status(200).json({ message: "Update Deleted", id: req.params.id });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Deleting Update");
  }
};
