import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllVideogames,
  getGenres,
  filterOrigin,
  filterGenre,
  orderBy,
} from "../../redux/actions";
import Card from "../Card";
import { Link } from "react-router-dom";
import Paginador from "../Paginador";
import SearchBar from "../SearchBar";
import Loading from "../Loading";
import styles from "./Home.module.css";

export default function Home() {
  const dispatch = useDispatch();
  let stateVideoGames = useSelector((state) => state.videoGames);
  let stateAllVideoGames = useSelector((state) => state.allVideogames);
  console.log("state.videoGames: ", stateVideoGames);
  const allGenres = useSelector((state) => state.allGenres);
  console.log("allGenres: ", allGenres);
  const [ordered, setOrdered] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [vgXPage, setVgXPage] = useState(15);
  const posLastVg = currentPage * vgXPage;
  const posFirstVg = posLastVg - vgXPage;
  console.log("posLastVg: ", posLastVg);
  console.log("posFirstVg: ", posFirstVg);

  const paginado = (pageNum) => {
    setCurrentPage(pageNum);
  };
  let actualVideogames = stateVideoGames.slice(posFirstVg, posLastVg);
  console.log("actualVideogames: ", actualVideogames);

  useEffect(() => {
    dispatch(getAllVideogames());
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGenres());
    // eslint-disable-next-line
  }, [dispatch]);

  function handleClickAll(e) {
    window.location.href = window.location.href;
  }

  function handleFilterOrigin(e) {
    e.preventDefault();
    //si el filtro es por locales, me fijo si hay alguno
    if (e.target.value === "db") {
      let locales = stateAllVideoGames.filter((vg) => vg.local === true).length;
      if (locales === 0) {
        alert("No videogames in local database");
        e.target.selectedIndex = 0;
        return;
      }
    }
    setCurrentPage(1);
    dispatch(filterOrigin(e.target.value));
  }

  function handleFilterGenre(e) {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(filterGenre(e.target.value));
  }

  function handleSort(e) {
    e.preventDefault();
    dispatch(orderBy(e.target.value));
    setCurrentPage(1);
    setOrdered(`Ordenado ${e.target.value}`);
  }

  return (
    <div className={styles.containerPpal}>
      {/* Cabecera*/}
      <div className={styles.containerHeader}>
        <div className={styles.addGame}>
          <Link to="/create">
            <button>Add a Videogame</button>
          </Link>
        </div>
        <div className={styles.searchbar}>
          <SearchBar />
        </div>
        <div className={styles.searchbar} onClick={(e) => handleClickAll(e)}>
          <button>All Videogames</button>
        </div>
        <div className={styles.searchbar}>
          <label>Page: </label>
          <Paginador
            vgXPage={vgXPage}
            allVg={stateVideoGames.length}
            paginado={paginado}
          />
        </div>
        <div className={styles.filtros}>
          <div className={styles.orderBox}>
            <label>Order: </label>
            <select onChange={(e) => handleSort(e)} id="order">
              <option value="disordered"> No Ordered</option>
              <option value="name_asc"> Name [A-Z]</option>
              <option value="name_desc"> Name [Z-A]</option>
              <option value="rating_asc"> Rating [Lo-Hi]</option>
              <option value="rating_desc"> Rating [Hi-Lo]</option>
            </select>
          </div>
          <div className={styles.filterBox}>
            <label>Created: </label>
            <select onChange={(e) => handleFilterOrigin(e)} name="Created">
              <option value="all"> All</option>
              <option value="api"> API</option>
              <option value="db"> Created</option>
            </select>
            <label>Genre: </label>
            <select onChange={(e) => handleFilterGenre(e)}>
              <option value="all"> All</option>
              {allGenres?.map((g) => {
                return (
                  <option value={g.name} key={g.id}>
                    {" "}
                    {g.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>{" "}
        {/* end filtros */}
      </div>{" "}
      {/* end containerHeader */}
      {/* Fin Cabecera*/}
      <br />
      <div className={styles.showVG}>
        { actualVideogames.length > 0 ? ( 
          actualVideogames[0]?.name !==
          "No hay registros que satisfagan la b??squeda" ? (
            actualVideogames?.map((vg) => {
              return (
                <Link to={"/home/" + vg.id}>
                  <Card
                    name={vg.name}
                    image={vg.image}
                    genres={vg.genres}
                    rating={vg.rating}
                    key={vg.id}
                  />
                </Link>
              );
            })
          ) : (
            <div className="card">
              <div className="element">
                <h1>No videogame with that name!!</h1>
              </div>
            </div>
          )
         ) : 
        (
          <Loading />
        )}

      </div>
    </div>
  );
}
