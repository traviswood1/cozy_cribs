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
    const spot = useSelector(state => state.spots?.currentSpot || null);
    const spotImages = useSelector(state => state.spotImages?.allSpotImages || []);
    const reviewsData = useSelector(state => {
        console.log('Full Redux State:', state);
        console.log('SpotReviews State:', state.spotReviews);
        return state.spotReviews || {};
    });

    useEffect(() => {
        if (spotId) {
            console.log('Dispatching fetch actions for spotId:', spotId);
            dispatch(fetchSpotById(spotId));
            dispatch(fetchSpotImages(spotId));
            dispatch(fetchReviewsBySpotId(spotId));
        }
    }, [dispatch, spotId]);

    // Extract reviews from the nested structure
    const reviews = reviewsData.Reviews?.Reviews || [];

    console.log('Extracted Reviews:', reviews);

    if (!spot) {
        return <div>Loading...</div>;
    }

    const previewImage = spot.SpotImages?.find(img => img.preview)?.url || spot.previewImage;
    const handleReserveClick = () => {
        alert("Feature coming soon");
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
                        <div className='reservation-button login-button'>
                            <button onClick={handleReserveClick}>Reserve</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='spot-details-reviews'>
                <h1>★{spot.avgStarRating ? spot.avgStarRating : 'New'} • {spot.numReviews === 1 ? `${spot.numReviews} review` : `${spot.numReviews} reviews`}</h1>
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
                            <h3 className='review-header'>★New</h3>
                            <p>Be the first to post a review!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotDetails;
