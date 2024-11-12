import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotById, fetchReviewsBySpotId } from '../../store';
import PostReviewModal from '../PostReviewModal/PostReview';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import { useModal } from '../../context/Modal';
import './SpotDetails.css';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const { setModalContent } = useModal();
    const [isLoading, setIsLoading] = useState(true);
    
    // Selectors
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.spotReviews.reviews || []);
    const currentUser = useSelector(state => state.session.user);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [spotResult, reviewsResult] = await Promise.all([
                    dispatch(fetchSpotById(spotId)),
                    dispatch(fetchReviewsBySpotId(spotId))
                ]);
                console.log('Loaded data:', { spotResult, reviewsResult }); // Debug log
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadData();
    }, [dispatch, spotId]);

    // Handlers
    const handleReviewSubmitSuccess = async () => {
        try {
            await dispatch(fetchSpotById(spotId));
            await dispatch(fetchReviewsBySpotId(spotId));
        } catch (error) {
            console.error('Error updating data after review:', error);
        }
    };

    const openReviewModal = () => {
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

    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!spot) {
        return <div>Spot not found</div>;
    }

    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;
    const userHasReviewed = currentUser && reviews.some(review => review.userId === currentUser.id);
    const canPostReview = currentUser && currentUser.id !== spot.ownerId && !userHasReviewed;

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
                <h2>
                    ★ {Number(spot.avgStarRating) || 'New'} · 
                    {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}
                </h2>
                
                {canPostReview && (
                    <button 
                        onClick={openReviewModal}
                        className="review-button"
                    >
                        Post Your Review
                    </button>
                )}

                <div className="reviews-container">
                    {Array.isArray(reviews) && reviews.length > 0 ? (
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
                        <div className="no-reviews">
                            {currentUser && currentUser.id !== spot.ownerId ? (
                                <p>Be the first to post a review!</p>
                            ) : (
                                <p>No reviews yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotDetails;
