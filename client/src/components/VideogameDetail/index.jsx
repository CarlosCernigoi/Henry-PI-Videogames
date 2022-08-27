import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideogameDetails } from '../../redux/actions'
import { Link } from 'react-router-dom';
import Loading from '../Loading'
import styles from "./VideogameDetail.module.css"

export default function VideogameDetail(props) {
    console.log(props);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVideogameDetails(props.match.params.id))
    }, [dispatch, props.match.params.id]);

    const theVideogame = useSelector(state => state.videogameDetail)
    console.log(theVideogame)
    const { description, genres, image, name, platforms, rating, released } = theVideogame;
    console.log(genres)

    return (
        <div className={styles.card}>
            {/* {theVideogame ?  */}
            {(theVideogame.description !== '404') ?
                <div className={styles.element}>
                    <h2>{name}</h2>
                    <img src={image} alt=' not found' width="500px" height="300px" />
                    <h5> Genres: {genres}</h5>
                    <h5> Description: {description}</h5>
                    <h5> Released: {released}</h5>
                    <h5> Platforms: {platforms}</h5>
                    <h5> Rating: {rating}</h5>
                    <Link to='/home'>
                        <button>Back to Home</button>
                    </Link>
                </div>
                // : <Loading />
                :
                <div>
                    <h1> Ups!! Seems this page is not found...</h1>
                    <Link to='/home'>
                        <button>Back to Home</button>
                    </Link>
                </div>
            }
        </div>
    )
}
