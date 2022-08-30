import { useState, useEffect } from "react";
import { NavLink, Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideogames,
  createVideogame,
  getGenres,
} from "../../redux/actions";
import styles from "./VideogameCreate.module.css";

function validation(input) {
  console.log("entra a validation");
  console.log("input: ", input);
  let errors = {};
  if (!input.name) errors.name = "Name cannot be empty!";
  else if (input.name.length > 255)
    errors.name = "Name max length is 255 characters!";
  if (!input.platforms) errors.platforms = "Select at least one platform";
  if (input.genres.length === 0) errors.genres = "Select at least one genre";
  if (input.rating < 0 || input.rating > 5)
    errors.rating = "Rating must be between 0 and 5";
  if (!input.description) errors.description = "Description cannot be empty!";
  if (input.released === "") errors.released = "Date of release must be completed"
  console.log("errors.name: ", errors.name);
  console.log("errors: ", Object.values(errors).join("; "));
  for (const property in errors) {
    console.log(`${property}: ${errors[property]}`);
  }
  return errors;
}

export default function VideogameCreate() {
  const dispatch = useDispatch();
  const allGenres = useSelector((state) => state.allGenres);
  const allVideogames = useSelector((state) => state.allVideogames);
  const [errors, setErrors] = useState({}); //para validaciones

  useEffect(() => {
    dispatch(getGenres());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    dispatch(getAllVideogames());
    // eslint-disable-next-line
  }, []);

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

  const history = useHistory();

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

  function handleChange(e) {
    console.log("e.target: ", e.target);
    console.log("e.target.value: ", e.target.value);
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    setErrors(
      validation({
        ...input,
        [e.target.name]: e.target.value,
      })
    );
    console.log("errors: ", errors);
    console.log("input: ", input);
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
      setErrors(
        validation({
          ...input,
          genres: newGenres,
        })
      );
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
      setErrors(
        validation({
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
        })
      );
      console.log("input.platforms: ", input.platforms);
      let element = document.getElementById("Select platform");
      element.value = "Select platform";
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("input: ", input);
    let errors = validation(input);
    console.log("errors en handleSubmit: ", Object.values(errors).join("; "));
    let msg = "Input errors must be corrected: \n".concat(
      Object.values(errors).join(";\n")
    );
    console.log("msg: ", msg);
    if (Object.values(errors).join("; ")) {
      alert(msg);
      return;
    }
    dispatch(createVideogame(input))
      .then((data) => {console.log(data)
        alert("Videogame created!!");
        setInput(initialInput);
      })
      .catch((e) => {console.log(e)
        alert(e.response.data.routine);
      });
      dispatch(getAllVideogames());
    // history.push('/home') //vuelve a página principal (pero no la actualiza con el nuevo registro
  }
  function handleCleanForm(e) {
    e.preventDefault();
    setInput(initialInput);
  }

  return (
    <div >
      <h1> Create your Videogame!!</h1>
      <form
        id="form"
        className={styles.formgrid}
        onSubmit={(e) => handleSubmit(e)}
      >
        <label className={styles.label1}>Name: </label>
        <input
          type="text"
          className={styles.input1}
          value={input.name}
          name="name"
          id="name"
          onChange={(e) => handleChange(e)}
        />
        {errors.name && (
          <span className={styles.error1} id="errorName">
            {errors.name}
          </span>
        )}
        <label className={styles.label2}>Description: </label>
        <br />
        <textarea
          rows="6"
          cols="50"
          className={styles.input2}
          value={input.description}
          id="description"
          name="description"
          placeholder="Write description here"
          onChange={(e) => handleChange(e)}
        ></textarea>
        {errors.description && (
          <span className={styles.error2} id="errorDescription">
            {errors.description}
          </span>
        )}
        <label className={styles.label3}>Image: </label>
        <input
          type="text"
          className={styles.input3}
          value={input.image}
          id="image"
          name="image"
          onChange={(e) => handleChange(e)}
        />
        <label className={styles.label4}>Released: </label>
        <input
          type="date"
          className={styles.input4}
          value={input.released}
          id="released"
          name="released"
          onChange={(e) => handleChange(e)}
        />
        {errors.released && (
          <span className={styles.error4} id="errorReleased">
            {errors.released}
          </span>
        )}
        <label className={styles.label5}>Rating: </label>
        <input
          type="number"
          value={input.rating}
          className={styles.input5}
          id="rating"
          name="rating"
          onChange={(e) => handleChange(e)}
        />
        {errors.rating && (
          <span className={styles.error5} id="errorRating">
            {errors.rating}
          </span>
        )}
        <label className={styles.label6}>Platforms: </label>
        <select
          id="Select platform"
          className={styles.input6}
          name="platforms"
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
        </select>
        {errors.platforms && (
          <span className={styles.error6} id="errorPlatforms">
            {errors.platforms}
          </span>
        )}
        <label className={styles.platform} name="selectedPlatforms">
          Selected Platforms: {input.platforms}
        </label>
        <label className={styles.label7}>Genres: </label>
        <select
          id="Select genre"
          className={styles.input7}
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
        </select>
        {errors.genres && (
          <span className={styles.error7} id="errorGenres">
            {errors.genres}
          </span>
        )}
        <label className={styles.genres}>
          Selected Genres: {input.genres.map((el, idx) => {
            if (idx === input.genres.length - 1) return el;
            else return el + ", ";
          })}
        </label>
      </form>
      <br />
      <div className={styles.divbuttons}>
        <button className={styles.buttn1} onClick={(e) => handleCleanForm(e)}>
          Clean form
        </button>
        <button type="submit" form="form" className={styles.buttn2}>
          Create Videogame
        </button>
        <NavLink className={styles.buttn3} to="/home">
          <label> Back to Home </label>
        </NavLink>
      </div>
    </div>
  );
}
