const { Sequelize, db } = require('../db/connection');

const Musician = db.define('Musician', {
    name: Sequelize.STRING,
    instrument : Sequelize.STRING
});

module.exports = Musician;