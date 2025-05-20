// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

const request = require("supertest");
const { db } = require("./db/connection");
const { Musician } = require("./models/index");
const app = require("./src/app");
const { seedMusician } = require("./seedData");

describe("./musicians endpoint", () => {
  // testing musicians endpoint
  test("testing musicians endpoint", async () => {
    // send a request to '/musicians' endpoint
    const responseMusician = await request(app).get("/musicians");
    // to convert the JSON string back to JSON object where we can access values, use JSON.parse()
    const responseData = JSON.parse(responseMusician.text);
    // 200 indicates a successful GET request was made
    expect(responseMusician.statusCode).toBe(200);
    expect(responseData[2].instrument).toEqual("Guitar");
  });

  test("post a new musician", async () => {
    const responseMusician = await request(app)
    .post("/musicians")
    .send({ name: "Ted Nugent", instrument: "Guitar"} )
    expect(responseMusician.status).toBe(201)
    expect(responseMusician.body.name).toBe("Ted Nugent")
  })

  test("replacing a musician with a new musician", async () => {
    //create a instance of musician
    const created = await request(app)
    .post("/musicians")
    .send({ name: "Ted Nugent", instrument: "Guitar"} )
    const id = created.body.id
    // update the instance
    const responseMusician = await request(app)
    .put("/musicians/1")
    .send({ name: "Anthony Kedis", instrument: "Voice"} )
    // test the expectations
    expect(responseMusician.status).toBe(200)
    expect(responseMusician.body.name).toBe("Anthony Kedis")
  })

    test("deleting a musician", async () => {
    //create a instance of musician
    const created = await request(app)
    .post("/musicians")
    .send({ name: "Ted Nugent", instrument: "Guitar"} )
    const id = created.body.id
    // delete the instance
    const deletedMusician = await request(app)
    .delete("/musicians/1")
    // test the expectations
    expect(deletedMusician.status).toBe(200)
  })

});

describe("./bands endpoint", () => {
  // testing bands endpoint
  test("testing bands endpoint", async () => {
    // send a request to '/bands' endpoint
    const responseBand = await request(app).get("/bands");
    // to convert the JSON string back to JSON object where we can access values, use JSON.parse()
    const responseData2 = JSON.parse(responseBand.text);
    // 200 indicates a successful GET request was made
    expect(responseBand.statusCode).toBe(200);
    expect(responseData2);
  });
});
