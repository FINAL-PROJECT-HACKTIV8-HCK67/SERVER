const app = require('../app');
const request = require('supertest');
const database = require('../config/db');
const { hashPassword } = require('../helpers/bcrypt');

let accessToken = null

beforeAll(async () => {
    await database.collection("Users").insertOne({
        name : "Goerge Martin",
        username : "martinGG",
        email : "g.martin@email.com",
        password : hashPassword("password123")
    })
})

afterAll(async () => {
    await database.collection("Users").deleteOne({email : "john.doe@email.com"})
    await database.collection("Users").deleteOne({email : "g.martin@email.com"})
})

describe("POST /register", () => {
    test("Should return 201 and a success response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "John Doe",
                username : "john.doe",
                email : "john.doe@email.com",
                password : "password123"
            })
            expect(status).toBe(201)
            expect(body.newUser).toHaveProperty("acknowledged", expect.any(Boolean))
            expect(body.newUser).toHaveProperty("insertedId", expect.any(String))
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "",
                username : "mary.sue",
                email : "mary.sue@email.com",
                password : "password123"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Please fill all the data"})
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "Mary Sue",
                username : "",
                email : "mary.sue@email.com",
                password : "password123"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Please fill all the data"})
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "Mary Sue",
                username : "mary.sue",
                email : "",
                password : "password123"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Please fill all the data"})
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "Mary Sue",
                username : "mary.sue",
                email : "mary.sue@email.com",
                password : ""
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Please fill all the data"})
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "Goerge Martin",
                username : "martinGG",
                email : "g.martin@email.com",
                password : "password123"
            })
            console.log(status, body, "<<<<<<<<<<<<<<,");
            expect(status).toBe(400)
            expect(body).toEqual({message : "This email has been used"})
    })
    test("Should return 400 and an error response", async () => {
        let {status, body} = await request(app)
            .post("/register")
            .send({
                name : "Goerge Martin",
                username : "martinGG",
                email : "gg.martin@email.com",
                password : "password123"
            })
            console.log(status, body, "<<<<<<<<<<<<<<,");
            expect(status).toBe(400)
            expect(body).toEqual({message : "This username has been used"})
    })
})

describe("POST /login", () => {
    test("Should return 200 and an access token", async () => {
        let {status, body} = await request(app)
            .post("/login")
            .send({
                email : "g.martin@email.com",
                password : "password123"
            })
            expect(status).toBe(200)
            expect(body).toHaveProperty("accessToken", expect.any(String))
    })
    test("Should return 400 and an error message (Incorret Email)", async () => {
        let {status, body} = await request(app)
            .post("/login")
            .send({
                email : "gg.martin@email.com",
                password : "password123"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Invalid Email/Password"})
    })
    test("Should return 400 and an error message (Incorrect Password)", async () => {
        let {status, body} = await request(app)
            .post("/login")
            .send({
                email : "g.martin@email.com",
                password : "password12"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Invalid Email/Password"})
    })
    test("Should return 400 and an error message (Email missing)", async () => {
        let {status, body} = await request(app)
            .post("/login")
            .send({
                email : "",
                password : "password123"
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Invalid Email/Password"})
    })
    test("Should return 400 and an error message (Password missing)", async () => {
        let {status, body} = await request(app)
            .post("/login")
            .send({
                email : "g.martin@email.com",
                password : ""
            })
            expect(status).toBe(400)
            expect(body).toEqual({message : "Invalid Email/Password"})
    })
})

describe("GET /profile", () => {
    test("Should return 200 and an object", async () => {
        const {status, body} = await request(app)
            .get("/profile")
            .set("Authorization", )
    })
})