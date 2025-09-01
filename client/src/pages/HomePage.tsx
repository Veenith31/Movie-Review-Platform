
import { useEffect, useState } from 'react';
import { fetchMovies } from '../services/api';
import type { Movie } from '../services/api';
import MovieCard from '../components/MovieCard';
import styles from './HomePage.module.css'; 

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for our filters
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
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, genre]); 

  return (
    <div className={styles.homePage}>
      <h1 className={styles.title}>Browse Movies</h1>
      
      {/*  Filter and Search UI */}
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
          {/* Add more genres as needed */}
        </select>
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p className={styles.error}>{error}</p>}
      
      {!loading && !error && (
        <div className={styles.movieGrid}>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))
          ) : (
            <p>No movies found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;