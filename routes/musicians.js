// D3 - Step 3 - Define Express router
const express = require("express");
const musicianRouter = express.Router();
const { Musician } = require("../models/index")
// D4 - Step 2 - Include check and validation methods from the Express Validator pkg
const { check, validationResult } = require("express-validator")

// D3 - Step 3 - Enable Express router to handle CRUD operations
// adding a new musician to the array
    // D4 - Steps 3 thru 8
musicianRouter.post(
  "/",
  [
    check("name").not().isEmpty().trim(),
    check("instrument").not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ error: errors.array() });
    } else {
      try {
        const newMusician = await Musician.create(req.body);
        const allMusicians = await Musician.findAll()
        res.status(201).json(allMusicians);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  }
);

// returns all musicians in the array
musicianRouter.get("/", async (req, res) => {
   try{
    const musicians = await Musician.findAll()
    res.status(200).json(musicians)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
  ;
});

// returns one musician in the array by id
musicianRouter.get("/:id", async (req, res) => {
   try{
    const foundMusician = await Musician.findByPk(req.params.id)
    res.json(foundMusician)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

// updates musician with provided info at a specified id
musicianRouter.put("/:id", async (req, res) => {
     try{
    const [updated] = await Musician.update(req.body, {
      where: { id: req.params.id}
    })
    if (updated) {
      const updatedMusician = await Musician.findByPk(req.params.id)
      res.json(updatedMusician)
    } else {
      res.status(404).json({ error: "Musician not found" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

// deletes musician at a specific id
musicianRouter.delete("/:id", async (req, res) => {
  try{
  const deleted = await Musician.destroy({ 
    where: { id: req.params.id }})
    if(deleted){
      res.status(200).json({ message: "Musician deleted" })
    } else {
      res.status(404).send()
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  } 

});

// Step 4 - Export Musician Router
module.exports = musicianRouter