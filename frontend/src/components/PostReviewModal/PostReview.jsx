import { useState, useEffect } from 'react';
import * as reviewActions from '../../store/spotReviews';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReview.css';

function PostReviewModal({ spotId, onSubmitSuccess }) {
    console.log('PostReviewModal rendering with spotId:', spotId);

    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [errors, setErrors] = useState({});
    const [rating, setRating] = useState(0);
    const { closeModal } = useModal();
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        console.log('PostReviewModal mounted');
    }, []);

    useEffect(() => {
        console.log('Current state:', { review, rating, errors });
    }, [review, rating, errors]);

    const handleSubmit = async (e) => {
        console.log('handleSubmit called');
        e.preventDefault();
        setErrors({});

        console.log('Validating form data:', { review, rating });

        if (review.length < 10) {
            console.log('Review too short');
            setErrors({ review: "Review must be at least 10 characters" });
            return;
        }
        
        if (!rating || rating < 1 || rating > 5) {
            console.log('Invalid rating');
            setErrors({ stars: "Please select a rating between 1 and 5" });
            return;
        }

        try {
            console.log('Dispatching createReview action...');
            const result = await dispatch(reviewActions.createReview(spotId, { 
                review, 
                stars: rating 
            }));
            
            console.log('Review creation result:', result);

            if (onSubmitSuccess) {
                console.log('Calling onSubmitSuccess callback');
                await onSubmitSuccess();
            }
            
            console.log('Closing modal');
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
        </>
    );
}

export default PostReviewModal;
