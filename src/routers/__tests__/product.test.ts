import supertest from "supertest";
import jwt from "jsonwebtoken";

import app from "../../server";
import db from "../../db";

// Mock jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

// Mock the database functions
jest.mock("../../db", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

beforeEach(async () => {
  (jwt.verify as jest.Mock).mockReturnValueOnce({});
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll((done) => {
  done();
});

describe("GET /api/product", () => {
  it("should return an array of products", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValueOnce({
      products: [],
    });

    const response = await supertest(app).get("/api/product").set("Authorization", "Bearer userTokenMock");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ products: [] });
  });

  it("should return an error if the owner doesnt exist in the database", async () => {
    (db.user.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const response = await supertest(app).get("/api/product").set("Authorization", "Bearer userTokenMock");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Error Getting Owner of the Products", errors: [] });
  });

  it("should return an error if something goes wrong with the database", async () => {
    (db.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error("Database Connection Error!"));

    const response = await supertest(app).get("/api/product").set("Authorization", "Bearer userTokenMock");

    expect(response.status).toBe(500);
    expect(response.body.message).toEqual("Something Went Wrong Getting Products");
  });
});
