// Importo las action types
import {
  GET_ALL_VIDEOGAMES,
  GET_VIDEOGAME_DETAILS,
  CREATE_VIDEOGAME,
  GET_GENRES,
} from "../actions";
import {
  FILTER_ORIGIN,
  FILTER_GENRE,
  ORDER_BY,
  SEARCH_BY_NAME,
} from "../actions";

const initialState = {
  videoGames: [],
  allVideogames: [],
  videogameDetail: {},
  allGenres: [],
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_VIDEOGAMES:
      return {
        ...state,
        videoGames: action.payload,
        allVideogames: action.payload,
      };
    case GET_VIDEOGAME_DETAILS:
      return {
        ...state,
        videogameDetail: action.payload,
      };
    case GET_GENRES:
      return {
        ...state,
        allGenres: action.payload,
      };
    case FILTER_ORIGIN:
      // state.videoGames = [...state.allVideogames];
      const filterOrigin =
        action.payload === "db"
          ? state.allVideogames.filter((vg) => vg.local)
          : state.allVideogames.filter((vg) => !vg.local);
      console.log("filterOrigin: ", filterOrigin);
      if (state.videoGames.length > 0) {
        return {
          ...state,
          videoGames:
            action.payload === "all" ? [...state.allVideogames] : filterOrigin,
        };
      }
    case FILTER_GENRE:
      // state.videoGames = [...state.allVideogames];
      const filterGenre = state.allVideogames.filter(
        (vg) => vg.genres && vg.genres.includes(action.payload)
      );
      console.log("filterGenre: ", filterGenre);
      return {
        ...state,
        videoGames:
          action.payload === "all" ? [...state.allVideogames] : filterGenre,
      };
    case ORDER_BY:
      // state.videoGames = [...state.allVideogames];
      console.log("action.payload: ", action.payload);
      console.log("state.allVideogames: ", state.allVideogames);
      let orderedBy = [];
      if (action.payload === "rating_asc") {
        orderedBy = state.videoGames.sort((a, b) => a.rating - b.rating);
      } else if (action.payload === "rating_desc") {
        orderedBy = state.videoGames.sort((a, b) => b.rating - a.rating);
      } else if (action.payload === "name_asc") {
        orderedBy = state.videoGames.sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
      } else if (action.payload === "name_desc") {
        orderedBy = state.videoGames.sort((a, b) => {
          if (a.name > b.name) return -1;
          if (a.name < b.name) return 1;
          return 0;
        });
      } else/*  if (action.payload === "disordered") */ {
        orderedBy = [...state.allVideogames];
      }
      console.log("state.allVideogames: ", state.allVideogames);
      console.log("orderedBy: ", orderedBy);
      return {
        ...state,
        videoGames: [...orderedBy],
      };
    case SEARCH_BY_NAME:
      return {
        ...state,
        videoGames: action.payload,
      };
    case CREATE_VIDEOGAME:
      return {
        ...state,
      };

    default:
      return state;
  }
}

export default rootReducer;
