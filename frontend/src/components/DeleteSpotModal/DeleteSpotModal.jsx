import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import './DeleteSpot.css';

function DeleteSpotModal({ spotId }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { closeModal } = useModal();

    const handleDelete = () => {
        return dispatch(deleteSpot(spotId))
            .then(() => {
                closeModal();
                navigate('/spots/current');
            })
            .catch((error) => {
                console.error('Error deleting spot:', error);
            });
    };

    return (
        <>
            <div className='delete-spot-modal-container'>
                <h1>Confirm Delete</h1>
                <p>Are you sure you want to remove this spot from the listings?</p>
                <div className="delete-spot-buttons">
                    <button 
                        className='delete-button' 
                        onClick={handleDelete}
                    >
                        Yes (Delete Spot)
                    </button>
                    <button 
                        className='dont-delete-button' 
                        onClick={closeModal}
                    >
                        No (Keep Spot)
                    </button>
                </div>
            </div>
        </>
    );
}

export default DeleteSpotModal;
