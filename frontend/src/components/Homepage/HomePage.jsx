import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchSpots } from '../../store/spots';
import './HomePage.css';

const HomePage = () => {
    const dispatch = useDispatch();
    const spotsObj = useSelector(state => state.spots.allSpots);
    const spots = spotsObj ? Object.values(spotsObj) : [];
    const [isLoading, setIsLoading] = useState(true);
    const [activeTooltip, setActiveTooltip] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
        console.log('Current spots in state:', spots);
    }, [spots]);

    const handleMouseEnter = (spotId) => {
        setActiveTooltip(spotId);
    };

    const handleMouseLeave = () => {
        setActiveTooltip(null);
    };

    const handleMouseMove = (e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="homepage">
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
                    </div>
                ))
            ) : (
                <p>No spots available.</p>
            )}
        </div>
    );
}   

export default HomePage;
