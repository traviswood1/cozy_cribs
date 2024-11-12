import React, { useState, useEffect } from 'react';
import './SpotDetails.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotById } from '../../store/spots';
import { fetchReviewsBySpotId } from '../../store/spotReviews';
import PostReviewModal from '../PostReviewModal/PostReview';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import { useModal } from '../../context/Modal';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.spotReviews.reviews || []);
    const currentUser = useSelector(state => state.session.user);
    const [isLoading, setIsLoading] = useState(true);
    const { setModalContent, closeModal } = useModal();

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchSpotById(spotId)),
                    dispatch(fetchReviewsBySpotId(spotId))
                ]);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, [dispatch, spotId]);

    useEffect(() => {
        console.log('Current spot in state:', spot);
    }, [spot]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!spot) {
        return <div>Spot not found</div>;
    }

    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;
    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    const userHasReviewed = currentUser && reviews.some(review => review.userId === currentUser.id);
    const canPostReview = currentUser && currentUser.id !== spot.ownerId && !userHasReviewed;

    const handleReviewSubmitSuccess = async () => {
        console.log('Handling review submit success...');
        try {
            await Promise.all([
                dispatch(fetchSpotById(spotId)),
                dispatch(fetchReviewsBySpotId(spotId))
            ]);
            console.log('Data updated successfully');
        } catch (error) {
            console.error('Error updating data after review:', error);
        }
    };

    const openReviewModal = () => {
        console.log('Opening review modal...');
        setModalContent(
            <PostReviewModal
                spotId={spotId}
                onSubmitSuccess={handleReviewSubmitSuccess}
            />
        );
    };

    const openDeleteReviewModal = (reviewId) => {
        setModalContent(
            <DeleteReviewModal 
                reviewId={reviewId}
                spotId={spotId}
            />
        );
    };

    return (
        <div className="spot-details-container">
            <div className="spot-details-header">
                <h1 style={{ fontWeight: 'bold' }}>{spot.name}</h1>
                <h2>{spot.city}, {spot.state}, {spot.country}</h2>
            </div>
            <div className="spot-details-images-container">
                <div className="spot-details-preview-image">
                    <img src={previewImage} alt={spot.name} />
                </div>
                <div className="spot-details-all-images">
                    {spot.SpotImages?.filter(img => !img.preview).map((image, index) => (
                        <img key={index} src={image.url} alt={`${spot.name} ${index + 1}`} />
                    ))}
                </div>
            </div>
            <div className="spot-details-info">
                <div className="spot-details-host-price">
                    <div className="spot-details-host">
                        <h2>Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}</h2>
                        <p>{spot.description}</p>
                    </div>
                    <div className="spot-details-price-rating">
                        <div className="price-rating-row">
                            <h2>${spot.price} night</h2>
                            <h2>★{spot.avgStarRating ? spot.avgStarRating : 'New'}</h2>
                        </div>
                        <div className='reservation-button'>
                            <button onClick={handleReserveClick}>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="reviews-section">
                <h2>★ {spot.avgStarRating ? spot.avgStarRating : 'New'} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</h2>
                {canPostReview && (
                    <div className="spot-details-review-button">
                        <button onClick={openReviewModal}>Post Your Review</button>
                    </div>
                )}
                <div className="reviews-container">
                    {reviews.length > 0 ? (
                        reviews
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(review => (
                                <div key={review.id} className="review-item">
                                    <h3>{review.User?.firstName}</h3>
                                    <h4>{new Date(review.createdAt).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric',
                                        day: 'numeric'
                                    })}</h4>
                                    <p>{review.review}</p>
                                    {currentUser && currentUser.id === review.userId && (
                                        <button 
                                            onClick={() => openDeleteReviewModal(review.id)}
                                            className="delete-review-button"
                                        >
                                            Delete Review
                                        </button>
                                    )}
                                </div>
                            ))
                    ) : (
                        currentUser && currentUser.id !== spot.ownerId && (
                            <p>Be the first to post a review!</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotDetails;
