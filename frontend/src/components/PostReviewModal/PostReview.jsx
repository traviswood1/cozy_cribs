import { useState, useEffect, useCallback } from 'react';
import * as reviewActions from '../../store/spotReviews';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReview.css';

function PostReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [rating, setRating] = useState(0);
  const { closeModal } = useModal();
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setErrors({});

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setErrors({ stars: "Rating must be an integer from 1 to 5" });
      return;
    }

    console.log('Submitting review for spot:', spotId, 'with data:', { review, stars: rating });
    return dispatch(reviewActions.createReview(spotId, { review, stars: rating }))
      .then((data) => {
        console.log('Review submitted successfully:', data);
        closeModal();
      })
      .catch(async (error) => {
        console.error('Error submitting review:', error);
        if (error.errors) {
          console.log('Validation errors:', error.errors);
          setErrors(error.errors);
        } else if (error.message) {
          console.log('Error message:', error.message);
          setErrors({ general: error.message });
        } else {
          setErrors({ general: 'An unexpected error occurred. Please try again.' });
        }
      });
  }, [spotId, review, rating, dispatch, closeModal]);

  useEffect(() => {
    setIsFormValid(review.length >= 10 && rating !== 0);
  }, [review, rating]);

  return (
    <>
      <h1>How was your stay?</h1>
      {errors.general && <p className="error-message">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
          {errors.review && <p className="error-message">{errors.review}</p>}
        <label>
          <textarea className='review-textarea'
            value={review}
            placeholder='Leave your review here...'
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
        <div className='star-rating-container'>
             {[1, 2, 3, 4, 5].map((star) => (
               <span
                 key={star}
                 className={`star ${(hoveredRating || rating) >= star ? 'filled' : ''}`}
                 onMouseEnter={() => setHoveredRating(star)}
                 onMouseLeave={() => setHoveredRating(0)}
                 onClick={() => setRating(star)}
               >
                 {(hoveredRating || rating) >= star ? '★' : '☆'}
               </span>
             ))}
             <h3>Stars</h3>
        </div>
        {errors.stars && <p className="error-message">{errors.stars}</p>}
        <button 
          className='login-button' 
          type="submit" 
          disabled={!isFormValid}
        >
          Submit Your Review
        </button>
      </form>
    </>
  );
}

export default PostReviewModal;
