import axios from 'axios';

export const GET_ALL_VIDEOGAMES = "GET_ALL_VIDEOGAMES";
export const GET_VIDEOGAME_DETAILS = "GET_VIDEOGAME_DETAILS";
export const CREATE_VIDEOGAME = "CREATE_VIDEOGAME";
export const GET_GENRES = "GET_GENRES";
export const FILTER_ORIGIN = "FILTER_ORIGIN";
export const FILTER_GENRE = "FILTER_GENRE";
export const ORDER_BY = "ORDER_BY";
export const ORDER_BY_NAME = "ORDER_BY_NAME";
export const ORDER_BY_RATING = 'ORDER_BY_RATING';
export const SEARCH_BY_NAME = "SEARCH_BY_NAME";


export function getAllVideogames() {
    return async function (dispatch) {
        var json = await axios.get("http://localhost:3001/videogames")
        return dispatch({
            type: GET_ALL_VIDEOGAMES,
            payload: json.data
        })
    }
}

export function getByName(name) {
    return async function (dispatch) {
        try {
            var json = await axios.get("http://localhost:3001/videogames?name=" + name)
            return dispatch({
                type: SEARCH_BY_NAME,
                payload: json.data
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export function getGenres() {
    return async function (dispatch) {
        var json = await axios.get("http://localhost:3001/genres")
        return dispatch({
            type: GET_GENRES,
            payload: json.data
        })
    }
}

export function getVideogameDetails(id){
    return async function (dispatch) {
        try {
            var json = await axios.get("http://localhost:3001/videogame/" + id)
            return dispatch({
                type: GET_VIDEOGAME_DETAILS,
                payload: json.data
            })
        } catch (error) {
            console.log(error)
            console.log('error.response.status: ',error.response.status)
            return dispatch({
                type: GET_VIDEOGAME_DETAILS,
                payload: {description: '404'}
            })
        }
    }
}

export function createVideogame(payload){
    return async function (dispatch) {
        const resp = await axios.post("http://localhost:3001/videogames",payload)
        console.log(resp)
        return  dispatch({
            type: CREATE_VIDEOGAME,
            payload
        })
        }
}

export function filterOrigin(payload) {
    return {
        type: FILTER_ORIGIN,
        payload
    }
}

export function filterGenre(payload) {
    return {
        type: FILTER_GENRE,
        payload
    }
}

/* export function orderByName(payload) {
    return {
        type: ORDER_BY_NAME,
        payload
    }
}

export function orderByRating(payload) {
    return {
        type: ORDER_BY_RATING,
        payload
    }
} */

export function orderBy(payload) {
    return {
        type: ORDER_BY,
        payload
    }
}
