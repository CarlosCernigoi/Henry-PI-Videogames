require("dotenv").config();
const { Router } = require('express');
const axios = require('axios');
const { API_KEY } = process.env;
const { Videogame, Genre } = require('../db.js')
const router = Router();

// Obtengo el detalle de un videogame en particular por ID
router.get('/:id', async function (req, res) {
    const { id } = req.params; 

    try { 
        //si el id es un UUIDV4 tiene guiones
        if (id.includes("-")) {
            const game = await Videogame.findByPk(id,{include: {model: Genre, attributes: ['name'],
            through: {attributes: []}}})
                const vgame = {
                    id: game.id,
                    name: game.name,
                    image: game.image,
                    rating: game.rating,
                    description: game.description,
                    released: game.released,
                    platforms: game.platforms,
                    genres: game.genres.map(p => p.name).join(', ')
                }
                return res.json(vgame)
        } else {
            const gameAPI = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
                    
                let game = gameAPI.data;
                const vgame = {
                    name: game.name,
                    image: game.background_image || 'https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg',
                    genres: game.genres && game.genres.map((p) =>
                        p.name).filter(p => p != null).join(', '),
                    description: game.description_raw,
                    released: game.released,
                    rating: game.rating,
                    platforms: game.platforms && game.platforms.map((p) =>
                        p.platform.name).filter(p => p != null).join(', ')
                }
                return res.json(vgame)
        }
    } catch (err) {
        res.status(404).json({ error: "ID not found" })
    }
})

module.exports = router;