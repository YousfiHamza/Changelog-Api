import express, { Request, Response, NextFunction } from "express";
import { signup, signin } from "../user"; // Replace with the correct path to your handler file.
import db from "../../db";
import { hashPassword, comparePasswords, createJWT } from "../../modules/auth";
import { CustomError } from "../error";

// Create a mock Express app
const app = express();
app.use(express.json());

// Mock the middleware functions and request/response objects
const mockNext = jest.fn() as NextFunction;
const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as unknown as Response;

// Mock the database functions
jest.mock("../../db", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

// Mock the auth functions
jest.mock("../../modules/auth", () => ({
  hashPassword: jest.fn(),
  comparePasswords: jest.fn(),
  createJWT: jest.fn(),
}));

describe("signup handler", () => {
  it("should create a new user and return a token", async () => {
    const hashedPassword = "hashed-password";
    const user = { username: "testuser" };
    const token = "test-token";

    (hashPassword as jest.Mock).mockResolvedValueOnce(hashedPassword);
    (db.user.create as jest.Mock).mockResolvedValueOnce(user);
    (createJWT as jest.Mock).mockReturnValueOnce(token);

    const req = {
      body: {
        username: "testuser",
        password: "password",
      },
    } as Request;

    await signup(req, mockResponse, mockNext);

    expect(hashPassword).toHaveBeenCalledWith("password");
    expect(db.user.create).toHaveBeenCalledWith({
      data: {
        username: "testuser",
        password: hashedPassword,
      },
    });
    expect(createJWT).toHaveBeenCalledWith(user);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ username: user.username, token });
  });

  it("should handle errors when there is a problem HASHING the password and call next with a CustomError", async () => {
    (hashPassword as jest.Mock).mockRejectedValueOnce(new Error("Password hashing failed"));

    const req = {
      body: {
        username: "testuser",
        password: "password",
      },
    } as Request;

    await signup(req, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError("Error Creating a user!!", 403));
  });

  it("should handle errors when there is a problem creating a TOKEN and call next with a CustomError", async () => {
    (createJWT as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Creating Token failed");
    });

    const req = {
      body: {
        username: "testuser",
        password: "password",
      },
    } as Request;

    await signup(req, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError("Something Went Wrong Creating the user!", 403));
  });
});

describe("signin handler", () => {
  it("should sign in a user and return a token", async () => {
    const user = { username: "testuser", password: "hashed-password" };
    const token = "test-token";

    (db.user.findUnique as jest.Mock).mockResolvedValueOnce(user);
    (comparePasswords as jest.Mock).mockResolvedValueOnce(true);
    (createJWT as jest.Mock).mockReturnValueOnce(token);

    const req = {
      body: {
        username: "testuser",
        password: "password",
      },
    } as Request;

    await signin(req, mockResponse, mockNext);

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: {
        username: "testuser",
      },
    });
    expect(comparePasswords).toHaveBeenCalledWith("password", "hashed-password");
    expect(createJWT).toHaveBeenCalledWith(user);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ username: user.username, token });
  });

  it("should handle errors and call next with a CustomError", async () => {
    (db.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error("User not found"));

    const req = {
      body: {
        username: "testuser",
        password: "password",
      },
    } as Request;

    await signin(req, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError("Something Went Wrong Signing In", 500));
  });

  it("should handle invalid password and call next with a CustomError", async () => {
    const user = { username: "testuser", password: "hashed-password" };

    (db.user.findUnique as jest.Mock).mockResolvedValueOnce(user);
    (comparePasswords as jest.Mock).mockResolvedValueOnce(false);

    const req = {
      body: {
        username: "testuser",
        password: "invalid-password",
      },
    } as Request;

    await signin(req, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError("Wrong Credentials!", 401));
  });
});
