// CSS
import './ConfirmBox.css'

const ConfirmBox = ({ message, onConfirm, onCancel }) => {
  // Cancel if Clicked Directly on the Overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div className="confirm-overlay" onClick={handleOverlayClick}>
      <div className="confirm-box">
        <p className="bold">{message}</p>
        <div className="confirm-buttons">
          <button onClick={onConfirm} className="cancel-button">
            Delete
          </button>
          <button onClick={onCancel} className="cancel-box">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmBox
