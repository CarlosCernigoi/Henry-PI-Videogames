import React from 'react';
import "./Card.css"

// mostrar imagen, nombre, géneros
export default function Card({ name, image, genres, rating }) {
    return (
        <div className='card'>
            <div className='element'>
                <img className='imagen' src={image} alt='not found' width="175px" height="110px" />
                <h3>{name}</h3>
                <h5>Genres: {genres}</h5>
                <h5>Rating: {rating}</h5>
            </div>
        </div>
    )
}

//