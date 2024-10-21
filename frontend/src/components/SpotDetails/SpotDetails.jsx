import React, { useState, useEffect } from 'react';
import './SpotDetails.css';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotById } from '../../store/spots';
import { fetchReviewsBySpotId } from '../../store/spotReviews';
import PostReviewModal from '../PostReviewModal/PostReview';
import { useModal } from '../../context/Modal';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.singleSpot);
    const reviews = useSelector(state => state.spotReviews.reviews || []);
    const currentUser = useSelector(state => state.session.user);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const { setModalContent } = useModal();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log('Fetching spot details...');
        dispatch(fetchSpotById(spotId))
            .then(() => {
                console.log('Spot details fetched successfully');
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching spot details:', error);
                setIsLoading(false);
            });
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

    const openReviewModal = () => {
        setModalContent(
            <PostReviewModal
                spotId={spotId}
                onClose={() => setModalContent(null)}
            />
        );
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
    };

    const openDeleteModal = () => {
        setModalContent(<DeleteSpotModal spotId={spotId} />);
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
            <div className='spot-details-reviews'>
                <h1>
                    {spot.numReviews === 0 ? (
                        '★ New'
                    ) : (
                        <>
                            ★ {spot.avgStarRating ? spot.avgStarRating : 'New'}
                            {spot.numReviews > 0 && (
                                <>
                                    <span style={{ margin: '0 5px' }}>·</span>
                                    {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}
                                </>
                            )}
                        </>
                    )}
                </h1>
                {canPostReview ? (
                    <div className='spot-details-review-button'>
                        <button className='login-button post-review-button' onClick={openReviewModal}>
                            Post Your Review
                        </button>
                    </div>
                ) : (
                    <div className='spot-details-review-button'></div>
                )}
                <div className='spot-details-reviews-list'>
                    {reviews.length > 0 ? (
                        [...reviews].reverse().map(review => {
                            return (
                                <div key={review.id} className='spot-details-review'>
                                    <h3 className="review-header">
                                        <span>{review.User?.firstName} {review.User?.lastName}</span>
                                        <span className='review-stars'>★{review.stars}</span>
                                    </h3>
                                    <h4>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })}</h4>
                                    <p>{review.review}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className='spot-details-review'>
                            <p>Be the first to post a review!</p>
                        </div>
                    )}
                </div>
            </div>
            {showReviewModal && (
                <PostReviewModal
                    spotId={spot.id}
                    onClose={closeReviewModal}
                />
            )}
        </div>
    );
};

export default SpotDetails;
