import '../styles/AppointmentModal.css';

function AppointmentModal({ isOpen, onClose, onFirstTime, onReturning }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <h2>Are you a first timer patient?</h2>
        
        <div className="modal-buttons">
          <button className="btn-yes" onClick={onFirstTime}>
            <span className="btn-title">Yes, I'm New</span>
            <span className="btn-subtitle">Start your Digital Intake Form</span>
          </button>
          <button className="btn-no" onClick={onReturning}>
            <span className="btn-title">No, I'm Returning</span>
            <span className="btn-subtitle">Log in or find your records</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AppointmentModal;
