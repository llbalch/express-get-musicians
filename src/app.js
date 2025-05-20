const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");
const { Band } = require("../models/index")

const port = 3000;

// Call app.use() to payy in express.json() and express.urlencoded()
app.use(express.json())
app.use(express.urlencoded())

//TODO: Create a GET /musicians route to return all musicians
app.get("/musicians", async (req, res) => {
  const musicians = await Musician.findAll({});
  // send books converted as a json string
  res.json(musicians);
});

// app.get("/musicians/1", async (req, res) => {
//   const musician1 = await Musician.findByPk(1);
//   res.json(musician1);
// });

// app.get("/musicians/2", async (req, res) => {
//   const musician2 = await Musician.findByPk(2);
//   res.json(musician2);
// });

// app.get("/musicians/3", async (req, res) => {
//   const musician3 = await Musician.findByPk(3);
//   res.json(musician3);
// });

app.get("/bands", async (req, res, next) => {
  try{
    const bands = await Band.findAll({});
  res.json(bands);
  } catch (error){
    next(error)
  }
  
});

app.get("/musicians/:id", async (req, res, next) => {
const foundId = (req.params.id)
const foundMusician = await Musician.findByPk(foundId)
res.json(foundMusician)
})

app.post("/musicians", async (req, res, next) => {

  try{
    const newMusician = await Musician.create(req.body)
  res.status(201).json(newMusician)
  } catch (error) {
    next(error)
  }
})

// create a route for updating replacing an exisiting musician with a new musician based on ID 
app.put("/musicians/:id", async (req, res, next) => {
try{ 
  let musician = await Musician.findOne({
    where: {
      id: req.params.id
    }
  })
  if (musician) {
    musician = await musician.update(req.body)
    res.json(musician)
  } else {
    res.status(404).send("musician not found")
  }
} catch (error) {
    next(error)
  }
})

app.delete("/musicians/:id", async (req, res, next) => {
  try{
    const musician = await Musician.findOne({
      where: {
        id: req.params.id
      }
    })
    if (musician) {
      const musicianDeleted = await musician.destroy();
      res.send(`Successful Deletion`)
    } else {
      res.status(404).send("musician not found")
    }
  }catch (error){
    next(error)
  }
})



module.exports = app;
