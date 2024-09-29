import React from 'react';

const NotificationModal = ({ notification, onClose }) => {
  return (
    <div className="notification-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{notification.title}</h2>
        <p>{notification.content}</p>
        <p>{notification.timestamp}</p>
      </div>
    </div>
  );
};

export default NotificationModal;
