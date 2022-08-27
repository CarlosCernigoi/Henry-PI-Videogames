require("dotenv").config();
const { Router } = require('express');
const axios = require('axios');
const { API_KEY } = process.env;
const { Genre } = require('../db.js');

const router = Router();

// Obtengo los géneros desde la API y los guardo en la DB

router.get('/', async function (req, res) {
    try{
        const generos = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        generos.data.results.forEach(g => {
            Genre.findOrCreate({
                where: { name: g.name },
                defaults: {
                  id: g.id,
                  name: g.name
                }
            })
        })
        const genresDB = await Genre.findAll()
        res.json(genresDB)
    } catch (err) {
        res.status(404).json({ err })
    }
})


module.exports = router;
