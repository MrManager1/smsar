import React from 'react';

const VisitsListModal = ({ show, onClose, visits, onUpdateVisitStatus }) => {
  if (!show) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge bg-success">مؤكد</span>;
      case 'canceled':
        return <span className="badge bg-danger">ملغي</span>;
      default:
        return <span className="badge bg-warning text-dark">قيد الانتظار</span>;
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow-lg border-0 zoom-in">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">🗓️ طلبات المعاينة المجدولة</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {visits.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <div className="fs-1 mb-3">🗂️</div>
                <h4>لا توجد طلبات معاينة حالياً</h4>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {visits.map(visit => (
                  <div key={visit.id} className="list-group-item d-flex align-items-center">
                    <img 
                      src={visit.property.imageUrl || (visit.property.images && visit.property.images[0])} 
                      alt={visit.property.type} 
                      className="rounded me-3" 
                      style={{width: 80, height: 80, objectFit: 'cover'}} 
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1 fw-bold">{visit.property.location?.neighborhood} - <span className="text-primary">{visit.property.type}</span></h6>
                        <small>{new Date(visit.date).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} - {visit.time}</small>
                      </div>
                      <p className="mb-1 text-muted">
                        العميل: {visit.name} ({visit.phone})
                      </p>
                      {visit.notes && (
                        <p className="mb-1 small text-info fst-italic">📝 ملاحظات: {visit.notes}</p>
                      )}
                      <div className="d-flex align-items-center justify-content-between mt-2">
                          {getStatusBadge(visit.status)}
                          {visit.status === 'pending' && onUpdateVisitStatus && (
                              <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-success" onClick={() => onUpdateVisitStatus(visit.id, 'confirmed')}>تأكيد</button>
                                  <button className="btn btn-outline-danger" onClick={() => onUpdateVisitStatus(visit.id, 'canceled')}>إلغاء</button>
                              </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>إغلاق</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitsListModal;