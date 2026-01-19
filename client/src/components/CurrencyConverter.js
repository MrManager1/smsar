import React, { useState } from 'react';

const CurrencyConverter = ({ show, onClose }) => {
  const [amount, setAmount] = useState(1000000);
  const [currency, setCurrency] = useState('USD');

  // أسعار تقريبية ثابتة (يمكن ربطها بـ API لاحقاً)
  const rates = {
    USD: 0.021, 
    EUR: 0.019,
    SAR: 0.079,
    AED: 0.077
  };

  if (!show) return null;

  const converted = amount * rates[currency];

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">💱 تحويل العملات</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">المبلغ (جنيه مصري)</label>
              <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">تحويل إلى</label>
              <select className="form-select" value={currency} onChange={e => setCurrency(e.target.value)}>
                <option value="USD">🇺🇸 دولار أمريكي (USD)</option>
                <option value="EUR">🇪🇺 يورو (EUR)</option>
                <option value="SAR">🇸🇦 ريال سعودي (SAR)</option>
                <option value="AED">🇦🇪 درهم إماراتي (AED)</option>
              </select>
            </div>
            <div className="alert alert-info text-center">
              <strong>{converted.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}</strong>
            </div>
            <small className="text-muted d-block text-center">الأسعار تقريبية</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;