// install dependencies
const { execSync } = require("child_process");
execSync("npm install");
execSync("npm run seed");

// const request = require("supertest");
// const { db } = require("./db/connection");
const { Musician } = require("./models/index");
// D4 - Step 10 Part 1 - import in supertest and app
const request = require("supertest");
const app = require("./src/app");

// D3 - Step 9 - Create unit tests to test the functionality of the Express router(s)
jest.mock("./models/index.js", () => ({
  Musician: {
    create: jest.fn(),
    findOne: jest.fn(), // mock findOne for delete endpoint
    findAll: jest.fn(),
  },
}));

describe("CRUD tests for musician express router", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

// POST TEST
test("post a new musician", async () => {
  // prepare the musician data
  const newMusician = {
    name: "Bob Marley",
    instrument: "Voice",
  };
  const createdMusician = { id: 1, ...newMusician}
  const allMusicians = [createdMusician]
  Musician.create.mockResolvedValue(createdMusician)
  // mock the array
  Musician.findAll.mockResolvedValue(allMusicians);

  // send the request
  const response = await request(app).post("/musicians").send(newMusician);

  // confirm the response is correct
  expect(response.statusCode).toEqual(201);
  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body).toEqual(expect.arrayContaining([expect.objectContaining(newMusician)]));

  // make sure the database is called correctly
  expect(Musician.create).toHaveBeenCalledWith(newMusician);
  expect(Musician.create).toHaveBeenCalledTimes(1);
  expect(Musician.findAll).toHaveBeenCalled()
});

// test error message
test("error posting musician", async () => {
  Musician.create.mockRejectedValue(new Error("Musician creation failed"));
  const response = await request(app)
  // in order to get status 500 you will need to send data so validation
  // will fail
  .post("/musicians")
  .send({ name: "test", instrument: "Violin" })
  expect(response.statusCode).toEqual(500);
});

// D4 - Step 10 Part 2 - create unit tests that test that returns an errors array
test("returns errors array if name is empty", async () => {
  const response = await request(app)
    .post("/musicians")
    .send({ name: "", instrument: "Guitar" });

  expect(response.body.errors).toBeInstanceOf(Array);
  expect(response.body.length).toBeGreaterThan(0);
});

test("returns errors array if instrument is empty", async () => {
  const response = await request(app)
    .post("/musicians")
    .send({ name: "Test", instrument: "" });

  expect(response.body.errors).toBeInstanceOf(Array);
  expect(response.body.length).toBeGreaterThan(0);
});

test("returns errors array if both fields are empty", async () => {
  const response = await request(app)
    .post("/musicians")
    .send({ name: "", instrument: "" });

  expect(response.body.errors).toBeInstanceOf(Array);
  expect(response.body.length).toBeGreaterThan(0);
});

// DELETE TEST
test("delete a musician", async () => {
  // create a new user to find using mock findOne
  const newMusician = {
    name: "Tina Turner",
    instrument: "Voice",
    id: 1,
    destroy: jest.fn(),
  };
  // find the new user
  Musician.findOne.mockResolvedValue(newMusician);

  // mock the user instance destroy method
  newMusician.destroy.mockResolvedValue(newMusician);

  // send the delete request
  const response = await request(app).delete(`/musicians/${newMusician.id}`);

  // check the response
  expect(response.statusCode).toEqual(200);
  expect(response.body.message).toEqual("Musician deleted");

  // check the calls to User.findOne
  expect(Musician.findOne).toHaveBeenCalledTimes(1);
  expect(Musician.findOne).toHaveBeenCalledWith({
    where: {
      id: newMusician.id,
    },
  });

  // check the calls to user.destroy
  expect(newMusician.destroy).toHaveBeenCalledTimes(1);
  expect(newMusician.destroy).toHaveBeenCalledWith();
});
});
// const app = require("./src/app");
// const { seedMusician } = require("./seedData");

// describe("./musicians endpoint", () => {
//   // testing musicians endpoint
//   test("testing musicians endpoint", async () => {
//     // send a request to '/musicians' endpoint
//     const responseMusician = await request(app).get("/musicians");
//     // to convert the JSON string back to JSON object where we can access values, use JSON.parse()
//     const responseData = JSON.parse(responseMusician.text);
//     // 200 indicates a successful GET request was made
//     expect(responseMusician.statusCode).toBe(200);
//     expect(responseData[2].instrument).toEqual("Guitar");
//   });

//   test("post a new musician", async () => {
//     const responseMusician = await request(app)
//     .post("/musicians")
//     .send({ name: "Ted Nugent", instrument: "Guitar"} )
//     expect(responseMusician.status).toBe(201)
//     expect(responseMusician.body.name).toBe("Ted Nugent")
//   })

//   test("replacing a musician with a new musician", async () => {
//     //create a instance of musician
//     const created = await request(app)
//     .post("/musicians")
//     .send({ name: "Ted Nugent", instrument: "Guitar"} )
//     const id = created.body.id
//     // update the instance
//     const responseMusician = await request(app)
//     .put("/musicians/1")
//     .send({ name: "Anthony Kedis", instrument: "Voice"} )
//     // test the expectations
//     expect(responseMusician.status).toBe(200)
//     expect(responseMusician.body.name).toBe("Anthony Kedis")
//   })

//     test("deleting a musician", async () => {
//     //create a instance of musician
//     const created = await request(app)
//     .post("/musicians")
//     .send({ name: "Ted Nugent", instrument: "Guitar"} )
//     const id = created.body.id
//     // delete the instance
//     const deletedMusician = await request(app)
//     .delete("/musicians/1")
//     // test the expectations
//     expect(deletedMusician.status).toBe(200)
//   })

// });

// describe("./bands endpoint", () => {
//   // testing bands endpoint
//   test("testing bands endpoint", async () => {
//     // send a request to '/bands' endpoint
//     const responseBand = await request(app).get("/bands");
//     // to convert the JSON string back to JSON object where we can access values, use JSON.parse()
//     const responseData2 = JSON.parse(responseBand.text);
//     // 200 indicates a successful GET request was made
//     expect(responseBand.statusCode).toBe(200);
//     expect(responseData2);
//   });
// });
