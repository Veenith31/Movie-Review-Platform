
import { useEffect, useState } from 'react';
import { fetchMovies } from '../services/api';
import type { Movie } from '../services/api';
import MovieCard from '../components/MovieCard';
import styles from './HomePage.module.css';

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonImage}></div>
    <div className={styles.skeletonText}></div>
    <div className={styles.skeletonTextShort}></div>
  </div>
);


const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    const getMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { search: searchTerm, genre: genre };
        const data = await fetchMovies(params);
        setMovies(data);
      } catch (err) {
        setError('Failed to load movies.');
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        getMovies();
    }, 500); 

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, genre]);

  return (
    <div className={styles.homePage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Browse Movies</h1>
        <p className={styles.subtitle}>Find your next favorite film</p>
      </div>

   
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className={styles.genreSelect}
        >
          <option value="">All Genres</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Action">Action</option>
          <option value="Thriller">Thriller</option>
        
        </select>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.movieGrid}>
        {loading ? (
          
          Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)
        ) : movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        ) : (
          <p className={styles.noResults}>No movies found matching your criteria.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
