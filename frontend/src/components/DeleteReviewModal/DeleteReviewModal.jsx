import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/thunks/reviewThunks';
import { fetchSpotById } from '../../store/thunks/spotThunks';
import './DeleteReview.css';

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteReview(reviewId, spotId));
      await dispatch(fetchSpotById(spotId));
      closeModal();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <>
      <h1 className='modal-title'>Confirm Delete</h1>
      <p>Are you sure you want to delete this review?</p>
      <div className="modal-buttons">
        <button 
          className='delete-button'
          onClick={handleDelete}
        >
          Yes (Delete Review)
        </button>
        <button 
          className='dont-delete-button'
          onClick={closeModal}
        >
          No (Keep Review)
        </button>
      </div>
    </>
  );
}

export default DeleteReviewModal;
