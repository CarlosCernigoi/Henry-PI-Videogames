require("dotenv").config();
const { Router } = require('express');
const axios = require('axios');
const { API_KEY } = process.env;
const { Videogame, Genre } = require('../db.js');
const { Op } = require("sequelize");
// const router = require("./index");
const router = Router();

router.get('/', async (req, res) => {
    const { name } = req.query;
    console.log(name)
    try {
        let allVGames = [] //array para guardar los vg
        if (name) {
            console.log('entro a if name')
            //uso iLike porque es case insensitive (sólo postgres)
            const localVGames = await Videogame.findAll({
                where: { name: { [Op.iLike]: `%${name}%` } },
                attributes: ["id", "name", "description", "image", "released", "rating", "platforms"],
                include: { model: Genre, attributes: ["name"] }
                // include: { model: Genre, attributes: ["name"], through: {attributes:[],} } // ver si cambia algo
            });
            console.log(localVGames)
            if (localVGames) {
                console.log('entro a if localVgames')
                localVG = localVGames.map(vg => {
                    return {
                        name: vg.name,
                        image: vg.image,
                        genres: vg.genres && vg.genres.map(g => g.name).join(', '),  //Por si viene vacío (Tentacle-Guardian id": 394117) (y si algun g.name es null?)
                        id: vg.id,
                        rating: vg.rating,
                        platforms: vg.platforms,
                        local: true  //ver si hace falta
                    }
                })
            }
            allVGames = allVGames.concat(localVG)

            let APIRAWG = `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`
            console.log(APIRAWG)
            // let cont = 0 
            // while (cont < 5) {
            let respAPIRAWG = (await axios.get(APIRAWG)) //traigo datos externos (20 registros)
            //filtro los resultados que no contengan estrictamente el nombre provisto
            let data = respAPIRAWG.data.results.filter(vg=> vg.name.toLowerCase().includes(name.toLowerCase()))
            // let extVGames = respAPIRAWG.data.results.map(vg => { //dentro de data.results están los videogames, mapeo y agrego flag local en false
            let extVGames = data.map(vg => {
                console.log('vg.name: ', vg.name)
                if (vg.name.toLowerCase().includes(name.toLowerCase())) { //a veces la api contesta con nombres parecidos
                    let vgame = {
                        name: vg.name,
                        image: vg.background_image || 'https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg',
                        genres: vg.genres && vg.genres.map(g => g.name).join(', '),  //Por si viene vacío (Tentacle-Guardian id": 394117) (y si algun g.name es null)
                        id: vg.id,
                        rating: vg.rating,
                        platforms: vg.platforms && vg.platforms.map(p => p.platform.name).join(', '),
                        local: false  //ver si hace falta
                    }
                    return vgame
                }
            })
            console.log('extVGames: ',extVGames)
            allVGames = allVGames.concat(extVGames) // agrego los registros obtenidos en el map
            //Voy a mostrar sólo los primeros 15 registros, tal como pide el README
            allVGames = allVGames.slice(0, 15)
            console.log('allVGames: ',allVGames)
            // cont++
            // APIRAWG = respAPIRAWG.data.next
            // if (!APIRAWG) break
            // }
        } else {
            // const localVGames = await Videogame.findAll({ include: [Genre] });
            const localVGames = await Videogame.findAll({
                attributes: ["id", "name", "description", "image", "released", "rating", "platforms"],
                include: { model: Genre, attributes: ["name"] }
                // include: { model: Genre, attributes: ["name"], through: {attributes:[],} } // ver si cambia algo
            });
            console.log(localVGames)
            if (localVGames) {
                console.log('entro a if localVgames')
                localVG = localVGames.map(vg => {
                    return {
                        name: vg.name,
                        image: vg.image,
                        genres: vg.genres && vg.genres.map(g => g.name).join(', '),  //Por si viene vacío (Tentacle-Guardian id": 394117) (y si algun g.name es null)
                        id: vg.id,
                        rating: vg.rating,
                        platforms: vg.platforms,
                        local: true  //ver si hace falta
                    }
                })
            }
            allVGames = allVGames.concat(localVG)
            //ahora los externos
            let APIRAWG = `https://api.rawg.io/api/games?key=${API_KEY}`
            //let APIRAWG = `https://api.rawg.io/api/games?key=c6c3872f7e964e0891abb8bbdb7118cb`
            let cont = 0 //Voy a traer sólo los primeros 100 registros. Como cada consulta trae 20 hago 5 pasadas
            while (cont < 5) {
                let respAPIRAWG = await axios.get(APIRAWG) //traigo datos externos
                let extVGames = respAPIRAWG.data.results.map(vg => { //dentro de data.results están los videogames, mapeo y agrego flag local en false
                    // let vgame = {
                    return {
                        name: vg.name,
                        image: vg.background_image,
                        genres: vg.genres && vg.genres.map(g => g.name).join(', '),  //Por si viene vacío (Tentacle-Guardian id": 394117) (y si algun g.name es null)
                        id: vg.id,
                        rating: vg.rating,
                        platforms: vg.platforms && vg.platforms.map(p => p.platform.name).join(', '),
                        local: false  //ver si hace falta
                    }
                })
                APIRAWG = respAPIRAWG.data.next
                allVGames = allVGames.concat(extVGames) // agrego los registros obtenidos en el map allVGames,
                cont++
            }
        }
        if (allVGames.length === 0) allVGames= [{name: 'No hay registros que satisfagan la búsqueda'}]
        res.json(allVGames)  //devuelvo resultado búsqueda
    } catch (error) {
        res.status(404).send(error.message)
        return []
    }
})


router.post('/', async (req, res) => {
    const { name, description, image, released, rating, platforms, genres } = req.body;

    //Validar datos?   --ThingsTODO

    //Los géneros vienen como string separado por coma y espacio
    // let generos = genres.split(', ')
    try {
        let newGame = await Videogame.create({
            name,
            description,
            image,
            released,
            rating,
            platforms,
        })

        // generos.forEach(async (gen) => {
        genres.forEach(async (gen) => {
            let genre = await Genre.findOne({ where: { name: gen } }) //para obtener el id
            await newGame.addGenre(genre)
        })
        res.send(`New Videogame ${name} successfully created!`)
    } catch (error) {
        res.status(404).send(error.message)
    }
});

module.exports = router;