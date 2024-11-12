import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSpots } from '../../store';
import { useModal } from '../../context/Modal';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './UserSpots.css';

const UserSpots = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const spotsObj = useSelector(state => state.spots.allSpots);
    const { setModalContent } = useModal();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Convert spots object to array and filter
    const spots = user && spotsObj
        ? Object.values(spotsObj).filter(spot => spot.ownerId === user.id)
        : [];

    useEffect(() => {
        dispatch(fetchSpots())
            .then(() => setIsLoading(false))
            .catch(error => {
                console.error('Error fetching spots:', error);
                setIsLoading(false);
            });
    }, [dispatch]);

    const handleMouseEnter = (spotId) => {
        setActiveTooltip(spotId);
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleDeleteClick = (spotId) => {
        setModalContent(
            <DeleteSpotModal 
                spotId={spotId}
            />
        );
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="user-spots">
            <div className='user-spots-header'>
                <h1>Manage Spots</h1>
            </div>
            <div className='user-spots-container'>
                {spots.length > 0 ? (
                    spots.map(spot => (
                        <div 
                            key={spot.id} 
                            className="spot-wrapper"
                            onMouseEnter={() => handleMouseEnter(spot.id)}
                            onMouseLeave={handleMouseLeave}
                            onMouseMove={handleMouseMove}
                        >
                            <Link className='spot-link' to={`/spots/${spot.id}`}>
                                <div className='spot-image-container'>
                                    <img src={spot.previewImage} alt={spot.name} />
                                </div>
                                <div className='spot-info'>
                                    <div className='location-price'>
                                        <h3>{spot.city}, {spot.state}</h3>
                                        <p>Price: ${spot.price} / night</p>
                                    </div>
                                    <div className='rating'>
                                        <p>★{spot.avgRating ? spot.avgRating.toFixed(1) : 'New'}</p>
                                    </div>
                                </div>
                            </Link>
                            {activeTooltip === spot.id && (
                                <div 
                                    className="custom-tooltip" 
                                    style={{
                                        left: mousePos.x,
                                        top: mousePos.y + 20,
                                        position: 'fixed'
                                    }}
                                >
                                    {spot.name}
                                </div>
                            )}
                            <div className='update-delete-buttons'>
                                <Link 
                                    className='user-spots-button' 
                                    to={`/spots/${spot.id}/edit`}
                                >
                                    Update
                                </Link>
                                <button 
                                    className='user-spots-button'
                                    onClick={() => handleDeleteClick(spot.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='no-spots-message'>
                        <Link className='create-spot-button' to="/spots/new">
                            Create a New Spot
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSpots;
