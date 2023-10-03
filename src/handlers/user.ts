import { Request, Response } from "express";

import db from "../db";
import { comparePasswords, createJWT, hashPassword } from "../modules/auth";

export const createUser = async (req: Request, res: Response) => {
  try {
    if (!req.body.password || !req.body.password.length || !req.body.username) {
      return res.status(400).send("Error Getting Password");
    }

    const password = await hashPassword(req.body.password);

    const user = await db.user.create({
      data: {
        username: req.body.username,
        password,
      },
    });

    const token = createJWT(user);

    res.status(201).json({ username: user.username, token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Creating the user");
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    if (!req.body.password || !req.body.password.length || !req.body.username) {
      return res.status(400).send("Error getting Credentials!");
    }

    const user = await db.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(401).send("Wrong Credentials!");
    }

    const isValidPassword = await comparePasswords(req.body.password, user!.password);

    if (!isValidPassword) {
      return res.status(401).send("Wrong Credentials!");
    }

    const token = createJWT(user);

    res.status(200).json({ username: user.username, token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Something Went Wrong Signing In");
  }
};
