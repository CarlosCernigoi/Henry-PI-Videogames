const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

// require("dotenv").config();
// const axios = require('axios');
// const { API_KEY } = process.env;
// const { Videogame, Genre } = require('../db.js');
// const { Op } = require("sequelize"); 

const videogamexid = require('./videogamexid');
const videogames = require('./videogames.js');
const genres = require('./genres')
const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

//100 primeros videogames o búsqueda por nombre ?name="tentacle" o POST nuevo videogame
router.use('/videogames', videogames);
// Busco un videogame por su ID--> /videogame:Id
router.use('/videogame', videogamexid);
// Busco todos los géneros
router.use('/genres', genres); 
  

module.exports = router;
