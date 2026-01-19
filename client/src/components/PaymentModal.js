import React, { useState } from 'react';
import Confetti from './Confetti';

export default function PaymentModal({ show, onClose, property, onConfirm }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!show || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onConfirm(property);
        setSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1080 }}>
      {success && <Confetti />}
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">💳 الدفع الآمن</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {success ? (
              <div className="text-center py-4">
                <div className="display-1 mb-3">🎉</div>
                <h4 className="text-success fw-bold">تم الدفع بنجاح!</h4>
                <p>مبروك! تم حجز العقار مبدئياً باسمك.</p>
              </div>
            ) : (
            <>
            <div className="alert alert-info d-flex align-items-center">
               <div className="me-3 fs-1">🏠</div>
               <div>
                 <strong>{property.location?.neighborhood || property.description}</strong>
                 <div className="small">السعر: {property.price?.toLocaleString()} ج</div>
               </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">اسم حامل البطاقة</label>
                <input type="text" className="form-control" required value={name} onChange={e => setName(e.target.value)} placeholder="الاسم كما يظهر على البطاقة" />
              </div>
              <div className="mb-3">
                <label className="form-label">رقم البطاقة</label>
                <input type="text" className="form-control" required value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="0000 0000 0000 0000" maxLength="19" />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">تاريخ الانتهاء</label>
                  <input type="text" className="form-control" required value={expiry} onChange={e => setExpiry(e.target.value)} placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">CVV</label>
                  <input type="password" className="form-control" required value={cvv} onChange={e => setCvv(e.target.value)} placeholder="123" maxLength="3" />
                </div>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                  {loading ? 'جاري معالجة الدفع...' : `دفع ${property.price?.toLocaleString()} ج`}
                </button>
              </div>
            </form>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}