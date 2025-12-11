import { useState, useEffect } from "react";

export function PanicConfirmationModal({ isOpen, onClose, onConfirm }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Reset success state when modal closes
  useEffect(() => {
    if (!isOpen) setShowSuccess(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestSupport = () => {
    setShowSuccess(true);
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="panic-modal-overlay" onClick={handleClose}>
      {/* MODAL CARD */}
      <div className="panic-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* CONFIRM STATE */}
        {!showSuccess && (
          <>
            <h2 className="mb-4 text-center text-xl font-semibold text-purple-900">
              Need immediate help?
            </h2>

            <div className="mb-8 space-y-4 text-center">
              <p className=" panic-modal-text text-purple-800 leading-relaxed">
                We can quietly notify trained support professionals and
                appropriate authorities to assist you.
              </p>
              <p className="panic-modal-text text-sm text-purple-700">
                You are in control at all times.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleRequestSupport}
                className="panic-btn confirm confirm:hover "
              >
                Continue
              </button>

              <button
                onClick={handleClose}
                className="panic-btn cancel cancel:hover"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* SUCCESS STATE */}
        {showSuccess && (
          <div className="flex flex-col items-center text-center">
            <div className="panic-success-icon">
              <svg
                className="h-4 w-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <p className="panic-modal-title">Help is on the way</p>

            <p className="panic-modal-text">
              Support professionals have been alerted.
              <br />
              You’re not alone.
            </p>

            <button
              onClick={handleClose}
              className="panic-btn cancel cancel:hover"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
