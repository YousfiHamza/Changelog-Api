import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { User } from "@prisma/client";
import { CustomError } from "../handlers/error";

export interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const createJWT = (user: User) => {
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET as string,
  );
  return token;
};

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new CustomError("You are not authorized to access this route", 401, []));
  }

  const [, token] = bearer.split(" ");

  if (!token) {
    return next(new CustomError("Not A Valid Token", 401, []));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as CustomRequest).user = decoded;
  } catch (err) {
    return next(new CustomError("Not A Valid User!", 403, []));
  }

  next();
};

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 3);
};
