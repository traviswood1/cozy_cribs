import { useState } from 'react';
import { createReview } from '../../store/thunks/reviewThunks';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PostReview.css';

function PostReviewModal({ spotId, onSubmitSuccess }) {
    const dispatch = useDispatch();
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        
        if (!review.trim()) {
            newErrors.review = "Review text is required";
        } else if (review.length < 10) {
            newErrors.review = "Review must be at least 10 characters long";
        }

        if (!rating) {
            newErrors.stars = "Please select a star rating";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await dispatch(createReview(spotId, { 
                review: review.trim(), 
                stars: rating 
            }));
            
            if (onSubmitSuccess) {
                await onSubmitSuccess();
            }
            
            closeModal();
        } catch (error) {
            console.error('Review submission error:', error);
            let errorMessage = 'An error occurred while submitting your review.';
            
            try {
                const errorData = await error.json();
                if (errorData.errors) {
                    setErrors(errorData.errors);
                    return;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (e) {
                console.error('Error parsing error response:', e);
            }
            
            setErrors({ general: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTextChange = (e) => {
        setReview(e.target.value);
        // Clear error when user starts typing
        if (errors.review) {
            setErrors(prev => ({ ...prev, review: null }));
        }
    };

    const handleStarClick = (star) => {
        setRating(star);
        // Clear error when user selects rating
        if (errors.stars) {
            setErrors(prev => ({ ...prev, stars: null }));
        }
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
                        minLength={10}
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Your Review'}
                </button>
            </form>
        </div>
    );
}

export default PostReviewModal;
