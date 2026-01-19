import React, { useState, useEffect } from 'react';

const MortgageCalculator = ({ show, onClose, defaultPrice = 0 }) => {
  const [amount, setAmount] = useState(defaultPrice);
  const [interest, setInterest] = useState(10);
  const [years, setYears] = useState(20);
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    if (show) {
      setAmount(defaultPrice || 0);
    }
  }, [show, defaultPrice]);

  useEffect(() => {
    const principal = parseFloat(amount);
    const calculatedInterest = parseFloat(interest) / 100 / 12;
    const calculatedPayments = parseFloat(years) * 12;
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);
    setMonthlyPayment(isFinite(monthly) ? monthly : 0);
  }, [amount, interest, years]);

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow">
          <div className="modal-header bg-light">
            <h5 className="modal-title">🧮 حاسبة التمويل العقاري</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">مبلغ القرض (جنيه)</label>
              <input type="number" className="form-control" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">سعر الفائدة السنوي (%)</label>
              <input type="number" className="form-control" value={interest} onChange={e => setInterest(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">مدة القرض (سنوات)</label>
              <input type="number" className="form-control" value={years} onChange={e => setYears(e.target.value)} />
            </div>
            
            <div className="alert alert-primary text-center mt-2 mb-0">
              <small className="d-block text-muted mb-1">القسط الشهري التقديري</small>
              <h2 className="fw-bold m-0">{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} جنيه</h2>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>إغلاق</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;