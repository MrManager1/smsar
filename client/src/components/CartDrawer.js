import React from 'react';

export default function CartDrawer({ show, onClose, cartItems, onRemove, onCheckout }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`} tabIndex="-1" style={{ visibility: show ? 'visible' : 'hidden', zIndex: 1090 }}>
      <div className="offcanvas-header bg-light">
        <h5 className="offcanvas-title">📋 قائمة الاهتمامات ({cartItems.length})</h5>
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
      <div className="offcanvas-body d-flex flex-column">
        {cartItems.length === 0 ? (
          <div className="text-center my-auto text-muted">
            <div className="fs-1 mb-3">🏠</div>
            <p>القائمة فارغة</p>
            <button className="btn btn-outline-primary btn-sm" onClick={onClose}>تصفح العقارات</button>
          </div>
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="d-flex align-items-center mb-3 border-bottom pb-3">
                  <img src={item.imageUrl || (item.images && item.images[0])} alt={item.type} className="rounded" style={{ width: 60, height: 80, objectFit: 'cover' }} />
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-0 small fw-bold">{item.location?.neighborhood || item.description}</h6>
                    <small className="text-muted">{item.type}</small>
                    <div className="text-primary fw-bold">{item.price?.toLocaleString()} ج</div>
                  </div>
                  <button className="btn btn-sm text-danger" onClick={() => onRemove(idx)}>&times;</button>
                </div>
              ))}
            </div>
            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-bold">الإجمالي:</span>
                <span className="fw-bold text-success fs-5">{total.toLocaleString()} ج</span>
              </div>
              <button className="btn btn-success w-100 py-2" onClick={onCheckout}>طلب معاينة للكل</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}