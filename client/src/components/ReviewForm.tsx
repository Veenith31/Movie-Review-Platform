
import { useState } from 'react';
import type { FormEvent } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { postReview } from '../services/api'; 
import type { Review } from '../services/api';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
  movieId: string;
  onReviewSubmitted: (newReview: Review) => void;
}

const ReviewForm = ({ movieId, onReviewSubmitted }: ReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState('');
  const { token, user } = useAuth(); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('You must be logged in to post a review.');
      return;
    }

    try {
      const newReviewData = await postReview(movieId, { rating, review_text: reviewText }, token);
      const newReviewWithUsername = { ...newReviewData, username: user?.username || 'You' };
      onReviewSubmitted(newReviewWithUsername);
      setRating(5);
      setReviewText('');
    } catch (err) {
      setError('Failed to submit review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <h4 className={styles.title}>Write a Review</h4>
        <div className={styles.formGroup}>
            <label>Rating:</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={styles.select}>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
            </select>
        </div>
        <div className={styles.formGroup}>
            <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you think?"
            required
            className={styles.textarea}
            />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <button type="submit" className={styles.submitButton}>Submit Review</button>
    </form>
  );
};

export default ReviewForm;