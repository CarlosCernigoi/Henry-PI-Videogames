require("dotenv").config();
const { Router } = require("express");
const axios = require("axios");
const { API_KEY } = process.env;
const { Videogame, Genre } = require("../db.js");
const { Op } = require("sequelize");
const router = Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  console.log(name);
  try {
    let allVGames = []; //array para guardar los vg
    if (name) {
      console.log("entro a if name");
      //uso iLike porque es case insensitive (sólo postgres)
      const localVGames = await Videogame.findAll({
        where: { name: { [Op.iLike]: `%${name}%` } },
        attributes: [
          "id",
          "name",
          "description",
          "image",
          "released",
          "rating",
          "platforms",
        ],
        include: { model: Genre, attributes: ["name"] },
      });
      console.log(localVGames);
      if (localVGames) {
        console.log("entro a if localVgames");
        localVG = localVGames.map((vg) => {
          return {
            name: vg.name,
            image: vg.image,
            genres: vg.genres && vg.genres.map((g) => g.name).join(", "), //Por si viene vacío (Tentacle-Guardian id": 394117) (y si algun g.name es null?)
            id: vg.id,
            rating: vg.rating,
            platforms: vg.platforms,
            local: true, //ver si hace falta
          };
        });
      }
      allVGames = allVGames.concat(localVG);

      let APIRAWG = `https://api.rawg.io/api/games?key=${API_KEY}&search=${name}`;
      console.log(APIRAWG);
      let respAPIRAWG = await axios.get(APIRAWG); //traigo datos externos (20 registros)
      //dentro de data.results están los videogames
      //filtro los resultados que no contengan estrictamente el nombre provisto
      let data = respAPIRAWG.data.results.filter((vg) =>
        vg.name.toLowerCase().includes(name.toLowerCase())
      );
      //mapeo y agrego flag local en false
      let extVGames = data.map((vg) => {
        console.log("vg.name: ", vg.name);
        if (vg.name.toLowerCase().includes(name.toLowerCase())) {
          //a veces la api contesta con nombres parecidos
          let vgame = {
            name: vg.name,
            image:
              vg.background_image ||
              "https://media.rawg.io/media/games/d58/d588947d4286e7b5e0e12e1bea7d9844.jpg",
            genres: vg.genres && vg.genres.map((g) => g.name).join(", "), //Por si viene vacío (Tentacle-Guardian id": 394117)
            id: vg.id,
            rating: vg.rating,
            platforms:
              vg.platforms &&
              vg.platforms.map((p) => p.platform.name).join(", "),
            local: false,
          };
          return vgame;
        }
      });
      console.log("extVGames: ", extVGames);
      allVGames = allVGames.concat(extVGames); // agrego los registros obtenidos en el map
      //Voy a mostrar sólo los primeros 15 registros, tal como pide el README
      allVGames = allVGames.slice(0, 15);
      console.log("allVGames: ", allVGames);
    } else {
      const localVGames = await Videogame.findAll({
        attributes: [
          "id",
          "name",
          "description",
          "image",
          "released",
          "rating",
          "platforms",
        ],
        include: { model: Genre, attributes: ["name"] },
      });
      console.log(localVGames);
      if (localVGames) {
        console.log("entro a if localVgames");
        localVG = localVGames.map((vg) => {
          return {
            name: vg.name,
            image: vg.image,
            genres: vg.genres && vg.genres.map((g) => g.name).join(", "), //Por si viene vacío (Tentacle-Guardian id": 394117)
            id: vg.id,
            rating: vg.rating,
            platforms: vg.platforms,
            local: true,
          };
        });
      }
      allVGames = allVGames.concat(localVG);
      //ahora los externos
      let APIRAWG = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=34`;
      //let APIRAWG = `https://api.rawg.io/api/games?key=c6c3872f7e964e0891abb8bbdb7118cb`
      let cont = 0; //Voy a traer sólo los primeros 100 registros. Como cada consulta trae 34 hago 3 pasadas
      while (cont < 3) {
        let respAPIRAWG = await axios.get(APIRAWG); //traigo datos externos
        let extVGames = respAPIRAWG.data.results.map((vg) => {
          //dentro de data.results están los videogames, mapeo y agrego flag local en false
          return {
            name: vg.name,
            image: vg.background_image,
            genres: vg.genres && vg.genres.map((g) => g.name).join(", "), //Por si viene vacío (Tentacle-Guardian id": 394117)
            id: vg.id,
            rating: vg.rating,
            platforms:
              vg.platforms &&
              vg.platforms.map((p) => p.platform.name).join(", "),
            local: false,
          };
        });
        APIRAWG = respAPIRAWG.data.next;
        allVGames = allVGames.concat(extVGames); // agrego los registros obtenidos en el map allVGames,
        cont++;
      }
    }
    if (allVGames.length === 0)
      allVGames = [{ name: "No hay registros que satisfagan la búsqueda" }];
    res.json(allVGames); //devuelvo resultado búsqueda
  } catch (error) {
    res.status(404).send(error.message);
    return [];
  }
});

router.post("/", async (req, res) => {
  let { name, description, image, released, rating, platforms, genres } =
    req.body;
    if (!image) image = 'http://www.bibliotecapopular.org/images/lucernario.jpg'

 /*  let errors = [];
  if (!name) res.status(402).json("Property name cannot be empty");
  if (!description)
    res.status(402).json("Property description cannot be empty");
  if (!platforms) res.status(402).json("Property platforms cannot be empty");
  if (!rating) res.status(402).json("Property rating cannot be empty");
  if (!isNaN(rating) || rating < 0 || rating > 5)
    res.status(402).json("Property rating must be a number between 0 and 5");
  if (!(released instanceof Date && !isNaN(released)))
    res.status(402).json("Property released must be a valid date"); */

  try {
    let newGame = await Videogame.create({
      name,
      description,
      image,
      released,
      rating,
      platforms,
    });

    genres.forEach(async (gen) => {
      let genre = await Genre.findOne({ where: { name: gen } }); //para obtener el id
      await newGame.addGenre(genre);
    });
    res.json(`New Videogame ${name} successfully created!`);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
