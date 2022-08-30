const { Router } = require('express');
const videogamexid = require('./videogamexid');
const videogames = require('./videogames.js');
const genres = require('./genres')
const router = Router();

//100 primeros videogames o búsqueda por nombre ?name="tentacle" o POST nuevo videogame
router.use('/videogames', videogames);
// Busco un videogame por su ID--> /videogame:Id
router.use('/videogame', videogamexid);
// Busco todos los géneros
router.use('/genres', genres); 

module.exports = router;
