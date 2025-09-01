import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWatchlist, getUserReviews } from '../services/api';
import type { Movie } from '../services/api';
import { Link } from 'react-router-dom';

interface UserReview {
  rating: number;
  review_text: string;
  created_at: string;
  title: string;
  movie_id: string;
}

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsData, watchlistData] = await Promise.all([
          getUserReviews(token),
          getWatchlist(token),
        ]);
        setReviews(reviewsData);
        setWatchlist(watchlistData);
      } catch (error) {
        console.error("Failed to fetch profile data");
        // Optional: handle token expiration by logging out
        // if (error.response.status === 401) logout();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>My Profile</h1>
      
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h2>My Watchlist</h2>
          {watchlist.length > 0 ? (
            <ul>
              {watchlist.map(movie => (
                <li key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>{movie.title}</Link> ({movie.release_year})
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no movies in your watchlist.</p>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2>My Reviews</h2>
          {reviews.length > 0 ? (
            <ul>
              {reviews.map((review, index) => (
                <li key={index} style={{ marginBottom: '1rem' }}>
                  <p>
                    For the movie <Link to={`/movie/${review.movie_id}`}><strong>{review.title}</strong></Link>:
                  </p>
                  <p>"{review.review_text}" - {'★'.repeat(review.rating)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not submitted any reviews.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;