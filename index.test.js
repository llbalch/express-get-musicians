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
