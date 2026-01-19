import React, { useState } from 'react';

const ROICalculator = ({ show, onClose, defaultPrice = 0 }) => {
  const [purchasePrice, setPurchasePrice] = useState(defaultPrice);
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [annualExpenses, setAnnualExpenses] = useState(0);

  if (!show) return null;

  const annualIncome = monthlyRent * 12;
  const netIncome = annualIncome - annualExpenses;
  const roi = purchasePrice > 0 ? (netIncome / purchasePrice) * 100 : 0;

  return (
    <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">📈 حاسبة العائد الاستثماري (ROI)</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">سعر الشراء (ج)</label>
              <input type="number" className="form-control" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label">الإيجار الشهري المتوقع (ج)</label>
              <input type="number" className="form-control" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} />
            </div>
            <div className="mb-3">
              <label className="form-label">المصاريف السنوية (صيانة/ضرائب) (ج)</label>
              <input type="number" className="form-control" value={annualExpenses} onChange={e => setAnnualExpenses(Number(e.target.value))} />
            </div>
            
            <div className="row text-center mt-4">
              <div className="col-6 mb-3">
                <div className="p-2 border rounded bg-light">
                  <small className="text-muted d-block">صافي الدخل السنوي</small>
                  <strong className="text-primary fs-5">{netIncome.toLocaleString()} ج</strong>
                </div>
              </div>
              <div className="col-6 mb-3">
                <div className="p-2 border rounded bg-light">
                  <small className="text-muted d-block">العائد السنوي</small>
                  <strong className="text-success fs-5">{roi.toFixed(2)}%</strong>
                </div>
              </div>
              <div className="col-12">
                <div className="alert alert-success mb-0">
                  فترة استرداد رأس المال: <strong>{netIncome > 0 ? (purchasePrice / netIncome).toFixed(1) : 0} سنوات</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;