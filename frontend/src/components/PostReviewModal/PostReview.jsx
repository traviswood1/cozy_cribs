import { useState, useEffect } from 'react';
import * as reviewActions from '../../store/spotReviews';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReview.css';

function PostReviewModal({ spotId, onSubmitSuccess }) {
    console.log('PostReviewModal function called with spotId:', spotId);

    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState({});
    const [rating, setRating] = useState(0);
    const { closeModal } = useModal();
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        console.log('PostReviewModal mounted');
        return () => console.log('PostReviewModal unmounted');
    }, []);

    useEffect(() => {
        console.log('Review state changed:', review);
    }, [review]);

    useEffect(() => {
        console.log('Rating state changed:', rating);
    }, [rating]);

    console.log('PostReviewModal rendering with state:', { review, rating, errors });

    const handleSubmit = async (e) => {
        console.log('Submit button clicked');
        e.preventDefault();
        console.log('Form submission started');
        setErrors({});

        try {
            console.log('Attempting to create review...');
            const result = await dispatch(reviewActions.createReview(spotId, { 
                review, 
                stars: rating 
            }));
            
            console.log('Review creation successful:', result);
            
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

    const handleTextChange = (e) => {
        console.log('Text changed:', e.target.value);
        setReview(e.target.value);
    };

    const handleStarClick = (star) => {
        console.log('Star clicked:', star);
        setRating(star);
    };

    return (
        <div className="review-modal">
            <h1>How was your stay?</h1>
            {errors.general && <p className="error-message">{errors.general}</p>}
            <form onSubmit={handleSubmit}>
                {errors.review && <p className="error-message">{errors.review}</p>}
                <label>
                    <textarea 
                        className='review-textarea'
                        value={review}
                        placeholder='Leave your review here...'
                        onChange={handleTextChange}
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
                            onClick={() => handleStarClick(star)}
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
                >
                    Submit Your Review
                </button>
            </form>
        </div>
    );
}

export default PostReviewModal;
