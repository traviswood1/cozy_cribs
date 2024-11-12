import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteReview } from '../../store/spotReviews';
import { fetchSpotById } from '../../store/spots';
import './DeleteReview.css';

function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(deleteReview(reviewId))
      .then(() => {
        dispatch(fetchSpotById(spotId));
        closeModal();
      })
      .catch((error) => {
        console.error('Error deleting review:', error);
      });
  };

  return (
    <div className='modal-container'>
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
    </div>
  );
}

export default DeleteReviewModal;
