import { useRef, useState, useContext, createContext, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);

  useEffect(() => {
    console.log('ModalProvider: modalContent changed:', modalContent);
  }, [modalContent]);

  const closeModal = () => {
    console.log('closeModal called');
    setModalContent(null);
    if (typeof onModalClose === "function") {
      setOnModalClose(null);
      onModalClose();
    }
  };

  const contextValue = {
    modalRef,
    modalContent,
    setModalContent,
    setOnModalClose,
    closeModal
  };

  return (
    <>
      <ModalContext.Provider value={contextValue}>
        {children}
      </ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);

  useEffect(() => {
    console.log('Modal component: modalContent present:', !!modalContent);
    console.log('Modal component: modalRef present:', !!modalRef);
    console.log('Modal component: modalRef.current present:', !!(modalRef?.current));
  }, [modalContent, modalRef]);

  if (!modalRef || !modalRef.current || !modalContent) {
    console.log('Modal returning null because:', {
      modalRef: !!modalRef,
      modalRefCurrent: !!(modalRef?.current),
      modalContent: !!modalContent
    });
    return null;
  }

  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        zIndex: 1001
      }}>
        {modalContent}
      </div>
    </div>,
    modalRef.current
  );
}

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};