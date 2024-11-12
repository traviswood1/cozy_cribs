import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/spotReviews';
import { fetchSpotById } from '../../store/spots';
import './PostReview.css';

function PostReviewModal({ spotId }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            console.log('Submitting review...');
            await dispatch(reviewActions.createReview(spotId, { 
                review, 
                stars: rating 
            }));
            
            console.log('Review submitted, updating spot...');
            await dispatch(fetchSpotById(spotId));
            
            console.log('Closing modal...');
            closeModal();
        } catch (error) {
            console.error('Review submission error:', error);
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: 'An error occurred while submitting your review.' });
            }
        }
    };

  useEffect(() => {
    const validateForm = () => {
      const newErrors = {};
      if (review.length < 10) {
        newErrors.review = "Review must be at least 10 characters";
      }
      if (!rating) {
        newErrors.stars = "Please select a rating";
      }
      setErrors(newErrors);
      setIsFormValid(Object.keys(newErrors).length === 0);
    };

    validateForm();
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
