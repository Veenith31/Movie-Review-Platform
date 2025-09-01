import React from 'react';

import { Link } from 'react-router-dom'; 
import type { Movie } from '../services/api';
import styles from './MovieCard.module.css'; 

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
    <div className={styles.card}>
      <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>{movie.release_year}</p>
      </div>
    </div>
    </Link>
  );
};

export default MovieCard;