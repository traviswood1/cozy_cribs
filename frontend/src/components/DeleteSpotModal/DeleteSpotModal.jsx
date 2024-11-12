import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/thunks/spotThunks';
import './DeleteSpot.css';

function DeleteSpotModal({ spotId, onDelete }) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await dispatch(deleteSpot(spotId));
            closeModal();
            if (onDelete) onDelete();
        } catch (error) {
            console.error('Error deleting spot:', error);
        }
    };

    return (
        <div className="delete-spot-modal">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot?</p>
            <button className="delete-button" onClick={handleDelete}>
                Yes (Delete Spot)
            </button>
            <button className="dont-delete-button" onClick={closeModal}>
                No (Keep Spot)
            </button>
        </div>
    );
}

export default DeleteSpotModal;
