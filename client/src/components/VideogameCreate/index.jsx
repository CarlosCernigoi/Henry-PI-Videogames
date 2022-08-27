import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideogames,
  createVideogame,
  getGenres,
} from "../../redux/actions";
import styles from "./VideogameCreate.module.css";

export default function VideogameCreate() {
  const dispatch = useDispatch();
  const allGenres = useSelector((state) => state.allGenres);
  const allVideogames = useSelector((state) => state.allVideogames);
  const [errors, setErrors] = useState({}); //para validaciones

  useEffect(() => {
    dispatch(getGenres());
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllVideogames());
    // eslint-disable-next-line
  }, [dispatch]);

  //armo un array de plataformas para seleccionar
  console.log(allVideogames);
  const platforms = [];
  function getPlatforms() {
    allVideogames.forEach((vg) =>
      vg.platforms
        .split(", ")
        .forEach((p) => !platforms.includes(p) && platforms.push(p))
    );
    return platforms;
  }
  getPlatforms();
  console.log(platforms);

  // const history = useHistory()

  // useEffect(() => {
  //     dispatch(getGenres());
  // }, [dispatch])

  console.log("genres: ", allGenres);
  let initialInput = {
    name: "",
    description: "",
    image: "",
    released: "",
    rating: 0,
    platforms: "",
    genres: [],
  };
  const [input, setInput] = useState(initialInput);

  function validation(input) {
    console.log("entra a validation");
    let errors = {};
    /* if (input.name === "")
      setErrors(
        validation({
          ...errors,
          name: "Name cannot be empty!",
        })
      ); */
    if (!input.name) errors.name = "Name cannot be empty!";
    else if (input.name.length > 255)
      errors.name = "Name max length is 255 characters!";
    //   if (!input.genres) errors.genres = "Select at least one genre";
    if (!input.platforms) errors.platforms = "Select at least one platform";
    //   if (!input.rating) errors.rating = "Rate your videogame!";
    if (input.rating < 0 || input.rating > 5)
      errors.rating = "Rating must be between 0 and 5";
    if (!input.description) errors.description = "Description cannot be empty!";
    console.log("errors.name: ", errors.name);
    console.log("errors: ", Object.values(errors).join('; '));
    return errors;
  }

  function handleChange(e) {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    console.log("input: ", input);
    setErrors(
      validation({
        ...errors,
        [e.target.name]: e.target.value,
      })
    );
    console.log("errors: ", errors);
  }
  function handleSelectGenre(e) {
    if (e.target.value !== "Select genre") {
      let newGenres = [];
      if (input.genres.includes(e.target.value))
        newGenres = input.genres.filter((g) => g !== e.target.value);
      else newGenres = [...input.genres, e.target.value];
      console.log("newgenres: ", newGenres);
      setInput({
        ...input,
        genres: newGenres,
      });
      console.log("input.genres: ", input.genres);
      let element = document.getElementById("Select genre");
      element.value = "Select genre";
    }
  }

  function handleSelectPlatform(e) {
    if (e.target.value !== "Select platform") {
      console.log(e.target.value);
      setInput({
        ...input,
        platforms:
          input.platforms.length === 0
            ? e.target.value
            : input.platforms.includes(e.target.value)
            ? input.platforms
                .split(", ")
                .filter((p) => p !== e.target.value)
                .join(", ")
            : input.platforms.concat(", ", e.target.value),
      });
      console.log("input.platforms: ", input.platforms);
      let element = document.getElementById("Select platform");
      element.value = "Select platform";
    }
  }

  function handleSubmit(e) {
    // document.forms.form.submit();
    e.preventDefault();
    console.log("input: ", input);
    let errors = validation(input);
    console.log("errors en handleSubmit: ", Object.values(errors).join('; '));
    let msg = "Input errors must be corrected: \n".concat(Object.values(errors).join(';\n')) 
    console.log('msg: ', msg)
    if (errors) {
      alert(msg);
      return;
    }
    dispatch(createVideogame(input));
    alert("Videogame created!!");
    setInput(initialInput);
    // history.push('/home') //vuelve a página principal
  }
  function handleCleanForm(e) {
    e.preventDefault();
    setInput(initialInput);
  }

  return (
    <div>
      <h1> Create your Videogame!!</h1>
      <div className={styles.divbuttons}>
        <button
          className={"${styles.divbuttons} ${styles.boton}"}
          onClick={(e) => handleCleanForm(e)}
        >
          Clean form
        </button>
        <button type="submit" form="form" className={styles.boton}>
          Create Videogame
        </button>
        <Link to="/home">
          <button className={styles.boton}>Back to Home</button>
        </Link>
      </div>
      <div className={styles.containerPpal}>
        <form
          id="form"
          className={styles.container}
          onSubmit={(e) => handleSubmit(e)}
        >
          <label /* for="name" */ className={`${styles.label} ${styles.uno}`}>
            Name:{" "}
          </label>
          <input
            type="text"
            className={`${styles.input} ${styles.iuno}`}
            value={input.name}
            name="name"
            id="name"
            onChange={(e) => handleChange(e)}
          />
          {errors.name && (
            <span className={`${styles.error}${styles.input} ${styles.idos}`}>
              {" <-- " + errors.name}
            </span>
          )}
          <label
            /* for="description" */ className={`${styles.label} ${styles.tres}`}
          >
            Description:{" "}
          </label>
          <br />
          <textarea
            rows="6"
            cols="50"
            className={`${styles.input} ${styles.itres}`}
            value={input.description}
            id="description"
            name="description"
            placeholder="Write description here"
            onChange={(e) => handleChange(e)}
          ></textarea>
          {errors.description && (
            <span className={`${styles.error}${styles.input} ${styles.idos}`}>
              {" <-- " + errors.description}
            </span>
          )}
          <label
            /* for="image" */ className={`${styles.label} ${styles.cuatro}`}
          >
            Image:{" "}
          </label>
          <input
            type="text"
            className={`${styles.input} ${styles.icuatro}`}
            value={input.image}
            id="image"
            name="image"
            onChange={(e) => handleChange(e)}
          />
          <label
            /* for="released" */ className={`${styles.label} ${styles.cinco}`}
          >
            Released:{" "}
          </label>
          <input
            type="date"
            className={`${styles.input} ${styles.icinco}`}
            value={input.released}
            id="released"
            name="released"
            onChange={(e) => handleChange(e)}
          />
          <label
            /* for="rating" */ className={`${styles.label} ${styles.seis}`}
          >
            Rating:{" "}
          </label>
          <input
            type="number"
            value={input.rating}
            className={`${styles.input} ${styles.iseis}`}
            id="rating"
            name="rating"
            onChange={(e) => handleChange(e)}
          />
          {errors.rating && (
            <span className={styles.error}>{" <-- " + errors.rating}</span>
          )}
          <label
            /* for="platforms" */ className={`${styles.label} ${styles.siete}`}
          >
            Platforms:{" "}
          </label>
          <select
            id="Select platform"
            className={`${styles.input} ${styles.isiete}`}
            onChange={(e) => handleSelectPlatform(e)}
          >
            <option value="Select platform" id="platforms" key="0">
              {" "}
              Select platform...
            </option>
            {platforms.map((p) => (
              <option value={p} key={platforms.indexOf(p)}>
                {" "}
                {p}
              </option>
            ))}
            {errors.platforms && (
              <span className={styles.error}>{errors.platforms}</span>
            )}
          </select>
          {/* <p>{input.platforms}</p> */}
          <label
            /* for="genres" */ className={`${styles.label} ${styles.ocho}`}
          >
            Genres:{" "}
          </label>
          <select
            id="Select genre"
            className={`${styles.input} ${styles.iocho}`}
            onChange={(e) => handleSelectGenre(e)}
          >
            <option value="Select genre" id="genres" key="0">
              {" "}
              Select genre...
            </option>
            {allGenres?.map((g) => (
              <option value={g.name} key={g.id}>
                {" "}
                {g.name}
              </option>
            ))}
            {errors.genres && (
              <span className={styles.error}>{errors.genres}</span>
            )}
          </select>
          {/* <p>
            {input.genres.map((el, idx) => {
              if (idx === input.genres.length - 1) return el;
              else return el + ", ";
            })}
          </p> */}
        </form>
        <div className={styles.options}>
          {input.errors ? (
            <p className={styles.optuno}>Input errors: {input.errors}</p>
          ) : null}
          <p className={styles.optdos}>Selected Platforms: {input.platforms}</p>
          <p className={styles.opttres}>
            Selected Genres:
            {input.genres.map((el, idx) => {
              if (idx === input.genres.length - 1) return el;
              else return el + ", ";
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
