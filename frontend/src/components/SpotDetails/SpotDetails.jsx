import './SpotDetails.css';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotById } from '../../store/spots';
import { fetchSpotImages } from '../../store/spotImages';
import { fetchReviewsBySpotId } from '../../store/spotReviews';

const SpotDetails = () => {
    const { spotId } = useParams();
    const dispatch = useDispatch();
    const currentSpot = useSelector((state) => state.spots.currentSpot);
    const reviews = useSelector(state => state.spotReviews || {});

    useEffect(() => {
        if (spotId) {
            dispatch(fetchSpotById(spotId));
            dispatch(fetchSpotImages(spotId));
            dispatch(fetchReviewsBySpotId(spotId));
        }
    }, [dispatch, spotId]);

    console.log('currentSpot:', currentSpot);
    console.log('spotId:', spotId);

    if (!currentSpot || currentSpot.id !== parseInt(spotId)) {
        return <div>Loading...</div>;
    }

    const previewImage = currentSpot.SpotImages?.find(img => img.preview)?.url || currentSpot.previewImage;
    const handleReserveClick = () => {
        alert("Feature coming soon");
    };

    return (
        <div className="spot-details-container">
            <div className="spot-details-header">
                <h1 style={{ fontWeight: 'bold' }}>{currentSpot.name}</h1>
                <h2>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</h2>
            </div>
            <div className="spot-details-images-container">
                <div className="spot-details-preview-image">
                    <img src={previewImage} alt={currentSpot.name} />
                </div>
                <div className="spot-details-all-images">
                    {currentSpot.SpotImages?.filter(img => !img.preview).map((image, index) => (
                        <img key={index} src={image.url} alt={`${currentSpot.name} ${index + 1}`} />
                    ))}
                </div>
            </div>
            <div className="spot-details-info">
                <div className="spot-details-host-price">
                    <div className="spot-details-host">
                        <h2>Hosted by {currentSpot.Owner?.firstName} {currentSpot.Owner?.lastName}</h2>
                        <p>{currentSpot.description}</p>
                    </div>
                    <div className="spot-details-price-rating">
                        <div className="price-rating-row">
                            <h2>${currentSpot.price} night</h2>
                            <h2>★{currentSpot.avgStarRating ? currentSpot.avgStarRating : 'New'}</h2>
                        </div>
                        <div className='reservation-button login-button'>
                            <button onClick={handleReserveClick}>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='spot-details-reviews'>
                <h1>
                    {currentSpot.numReviews === 0 ? (
                        '★ New'
                    ) : (
                        <>
                            ★ {currentSpot.avgStarRating ? currentSpot.avgStarRating : 'New'}
                            {currentSpot.numReviews > 0 && (
                                <>
                                    <span style={{ margin: '0 5px' }}>·</span>
                                    {currentSpot.numReviews} {currentSpot.numReviews === 1 ? 'review' : 'reviews'}
                                </>
                            )}
                        </>
                    )}
                </h1>
                <button className='login-button post-review-button'>Post Your Review</button>
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
        </div>
    );
};

export default SpotDetails;
