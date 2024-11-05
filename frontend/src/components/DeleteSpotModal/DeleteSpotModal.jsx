import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteSpot } from '../../store/spots';
import './DeleteSpot.css';

function DeleteSpotModal({ spotId, onClose, onDelete }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      const result = await dispatch(deleteSpot(spotId));
      if (result.success) {
        onDelete();
        onClose();
      } else {
        console.error('Failed to delete spot:', result.error);
        // Optionally, display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className='delete-spot-modal-container'>
      <h1>Confirm Delete</h1>
      <p>Are you sure you want to remove this spot from the listings?</p>
      <button className='delete-button' onClick={handleDelete}>Yes (Delete Spot)</button>
      <button className='dont-delete-button' onClick={closeModal}>No (Keep Spot)</button>
    </div>
  );
}

export default DeleteSpotModal;
