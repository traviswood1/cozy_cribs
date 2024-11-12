import { useState } from 'react';
import * as reviewActions from '../../store/spotReviews';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReview.css';

function PostReviewModal({ spotId, onSubmitSuccess }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState({});
    const [rating, setRating] = useState(0);
    const { closeModal } = useModal();
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (review.length < 10) {
            setErrors({ review: "Review must be at least 10 characters" });
            return;
        }
        
        if (!rating || rating < 1 || rating > 5) {
            setErrors({ stars: "Please select a rating between 1 and 5" });
            return;
        }

        try {
            console.log('Submitting review...');
            const result = await dispatch(reviewActions.createReview(spotId, { 
                review, 
                stars: rating 
            }));
            
            console.log('Review submitted successfully');
            
            if (onSubmitSuccess) {
                await onSubmitSuccess();
            }
            
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

    console.log('Rendering PostReviewModal with state:', { review, rating, errors });

    return (
        <>
            <h1>How was your stay?</h1>
            {errors.general && <p className="error-message">{errors.general}</p>}
            <form onSubmit={handleSubmit}>
                {errors.review && <p className="error-message">{errors.review}</p>}
                <label>
                    <textarea 
                        className='review-textarea'
                        value={review}
                        placeholder='Leave your review here...'
                        onChange={(e) => {
                            console.log('Review text changed:', e.target.value);
                            setReview(e.target.value);
                        }}
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
                            onClick={() => {
                                console.log('Star clicked:', star);
                                setRating(star);
                            }}
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
                    onClick={() => console.log('Submit button clicked')}
                >
                    Submit Your Review
                </button>
            </form>
        </>
    );
}

export default PostReviewModal;
