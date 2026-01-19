import React from 'react';

function ConfirmModal({ show, title, body, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          <div className="modal-body">
            <p>{body}</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={onCancel}>إلغاء</button>
              <button className="btn btn-danger" onClick={onConfirm}>تأكيد</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
