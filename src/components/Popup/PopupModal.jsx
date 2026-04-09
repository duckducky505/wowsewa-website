import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import './PopupModal.css'; 

export const PopupModal = ({ open, onClose, title, children }) => {
  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      center 
      classNames={{ modal: 'customModal' }}
    >
      <div className="modal-body">
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-content-area">
          {children}
        </div>
      </div>
    </Modal>
  );
};

