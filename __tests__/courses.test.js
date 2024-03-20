const app = require("../app");
const request = require("supertest");
const database = require("../config/db");
const courseTest = require("../data/biology1.json");
import { ObjectId } from "mongodb";
import { signToken } from "../helpers/jwt";

const userTest = {
  name: "George Martin",
  username: "martinGG",
  email: "g.martin@email.com",
  password: hashPassword("password123"),
};

beforeAll(async () => {
  await database.collection("Courses").insertOne(courseTest);
  await database.collection("Users").insertOne(userTest);
  let accessTokenUser = await database
    .collection("Users")
    .findOne({ where: "g.martin@email.com" });
  let accesToken = signToken({
    _id: ObjectId(accessTokenUser._id),
    name: accessTokenUser.name,
    email: accessTokenUser.email,
  });
});

afterAll(async () => {
  await database.collection("Users").deleteOne({ email: "g.martin@email.com" });
  await database.collection("Courses").deleteMany();
});
describe("GET /course", () => {
  test("Should return 201 and a success response", async () => {
    let { status, body } = await request(app).get("/course");
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
});
describe("GET /course/my-course", () => {
  test("Should return 401 and a success response", async () => {
    let { status, body } = await request(app)
      .get("/course/my-course")
      .set("Authorization", `Bearer ${accesToken}`);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
  test("Should return 201 and a success response", async () => {
    let { status, body } = await request(app)
      .get("/course/my-course")
      .set("Authorization", `Bearer ${accesToken}`);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
  test("Should return 201 and a success response", async () => {
    let { status, body } = await request(app)
      .get("/course/my-course")
      .set("Authorization", `Bearer ${accesToken}`);
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
  });
});
