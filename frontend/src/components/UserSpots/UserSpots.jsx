import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import { useModal } from '../../context/Modal';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './UserSpots.css';

const UserSpots = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const spotsState = useSelector(state => state.spots);
    const spots = user && spotsState.allSpots
        ? Object.values(spotsState.allSpots).filter(spot => spot.ownerId === user.id)
        : [];
    const [isLoading, setIsLoading] = useState(true);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const { setModalContent, setOnModalClose } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Fetching spots...');
        dispatch(fetchSpots())
            .then(() => {
                console.log('Spots fetched successfully');
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching spots:', error);
                setIsLoading(false);
            });
    }, [dispatch]);

    useEffect(() => {
        console.log('Current user:', user);
        console.log('All spots:', spotsState.allSpots);
        console.log('Filtered spots:', spots);
    }, [user, spotsState.allSpots, spots]);

    const handleMouseEnter = (spotId) => {
        setActiveTooltip(spotId);
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    const openDeleteModal = (spotId) => {
        setModalContent(<DeleteSpotModal spotId={spotId} />);
    };

    const handleDelete = () => {
        // Perform any necessary state updates
        navigate('/spots/current'); // Or wherever you want to navigate after deletion
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-spots">
            <div className='user-spots-header'>
                <h1>Manage Your Spots</h1>
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
                            <Link 
                                className='spot-link' 
                                to={`/spots/${spot.id}`}
                            >
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
                                <Link className='user-spots-button' to={`/spots/${spot.id}/edit`}>Update</Link>
                                <button className='user-spots-button' onClick={() => openDeleteModal(spot.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='update-delete-buttons'>
                        <Link className='login-button' to='/spots/new'>Create a New Spot</Link>
                    </div>
                )}
            </div>
        </div>
    );
}   

export default UserSpots;
