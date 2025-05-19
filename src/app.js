const express = require("express");
const app = express();
const { Musician } = require("../models/index");
const { db } = require("../db/connection");

const port = 3000;

//TODO: Create a GET /musicians route to return all musicians
app.get("/musicians", async (req, res) => {
  const musicians = await Musician.findAll({});
  // send books converted as a json string
  res.json(musicians);
});

app.get("/musicians/1", async (req, res) => {
  const musician1 = await Musician.findByPk(1);
  res.json(musician1);
});

app.get("/musicians/2", async (req, res) => {
  const musician2 = await Musician.findByPk(2);
  res.json(musician2);
});

app.get("/musicians/3", async (req, res) => {
  const musician3 = await Musician.findByPk(3);
  res.json(musician3);
});

app.get("/bands", async (req, res) => {
  const bands = await Band.findAll({});
  res.json(bands);
});

module.exports = app;
