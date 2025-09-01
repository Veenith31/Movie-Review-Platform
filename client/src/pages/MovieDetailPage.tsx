import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieById, getWatchlist, addToWatchlist, removeFromWatchlist } from '../services/api';
import type { MovieDetails, Review, Movie } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewForm from '../components/ReviewForm';
import styles from './MovieDetailPage.module.css';

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Reset states on ID change
    setLoading(true);
    setError(null);

    const getMovieData = async () => {
      try {
        const movieData = await fetchMovieById(id);
        setMovie(movieData);
      } catch (err) {
        setError('Failed to load movie details.');
      }
    };

    const checkWatchlistStatus = async () => {
      if (!token) return;
      try {
        const watchlist: Movie[] = await getWatchlist(token);
        setIsInWatchlist(watchlist.some(m => m.id === id));
      } catch (err) {
        console.error('Failed to fetch watchlist status');
      }
    };
    
    // Run all fetches
    Promise.all([getMovieData(), checkWatchlistStatus()]).finally(() => {
      setLoading(false);
    });
  }, [id, token]);

  const handleWatchlistToggle = async () => {
    if (!token || !id) return;
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(id, token);
        setIsInWatchlist(false);
      } else {
        await addToWatchlist(id, token);
        setIsInWatchlist(true);
      }
    } catch (err) {
      console.error('Failed to update watchlist');
    }
  };

  const handleReviewSubmitted = (newReview: Review) => {
    setMovie(prevMovie => {
      if (!prevMovie) return null;
      
      const totalRating = prevMovie.reviews.reduce((acc, r) => acc + r.rating, 0) + newReview.rating;
      const newAverage = totalRating / (prevMovie.reviews.length + 1);

      return {
        ...prevMovie,
        reviews: [newReview, ...prevMovie.reviews],
        average_rating: newAverage.toFixed(2)
      };
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>Movie not found.</p>;

    return (
    <div 
      className={styles.pageContainer} 
      style={{ backgroundImage: `linear-gradient(to top, rgba(20,20,20,1) 10%, rgba(20,20,20,0.7) 50%), url(${movie.poster_url})`, backgroundSize: 'cover', backgroundPosition: 'center top' }}
    >
      <div className={styles.detailsContainer}>
        <img src={movie.poster_url} alt={movie.title} className={styles.poster} />
        <div className={styles.details}>
          <h1 className={styles.title}>{movie.title} ({movie.release_year})</h1>
          
          <div className={styles.metaInfo}>
            <span><strong>Rating:</strong> {Number(movie.average_rating).toFixed(1)} ★</span>
            <span><strong>Genre:</strong> {movie.genre}</span>
          </div>
          <p><strong>Director:</strong> {movie.director}</p>
          
          <p className={styles.synopsis}>{movie.synopsis}</p>
          
          {token && (
            <button onClick={handleWatchlistToggle} className={`${styles.actionButton} ${isInWatchlist ? styles.inWatchlist : ''}`}>
              {isInWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
          )}
          
          <hr className={styles.divider} />

          {token && id && (
            <ReviewForm movieId={id} onReviewSubmitted={handleReviewSubmitted} />
          )}
          
          <h2>Reviews</h2>
          <div className={styles.reviewsSection}>
            {movie.reviews.length > 0 ? (
              movie.reviews.map(review => (
                <div key={review.id} className={styles.review}>
                  <strong>{review.username}</strong> - <span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                  <p>{review.review_text}</p>
                  <small>{new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;