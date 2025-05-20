import React, { useEffect, useRef } from "react";
import "./PopUp.css";

const PopUp = ({ isOpen, onClose, children , canGoBack, onBack}) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    
    if (isOpen) {
      dialog.showModal();
      
      // Thêm event listener phát hiện click bên ngoài
      const handleClickOutside = (e) => {
        const rect = dialog.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);


  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="popup-dialog"
    >
      <div className="popup-content">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className={`popup-back-btn ${!canGoBack ? 'disabled' : ''}`}
          disabled={!canGoBack}
        >
          &larr;
        </button>
        <button
          type="button"
          aria-label="Close popup"
          onClick={onClose}
          className="popup-close-btn"
        >
          &times;
        </button>
        {children}
      </div>
    </dialog>
  );
};

export default PopUp;
