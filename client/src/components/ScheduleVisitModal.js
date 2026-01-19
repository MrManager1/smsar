import React, { useState, useEffect } from 'react';

export default function ScheduleVisitModal({ show, property, onClose, onConfirm }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('14:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (property) {
      setDate('');
      setTime('14:00');
      setName('');
      setPhone('');
      setNotes('');
      setIsSuccess(false);
    }
  }, [property]);

  if (!show || !property) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // تحقق بسيط للتأكد من تعبئة البيانات
    if (!date || !name || !phone) {
      alert('الرجاء ملء جميع الحقول المطلوبة (التاريخ، الاسم، الهاتف)');
      return;
    }

    if (onConfirm) {
      onConfirm({
        propertyId: property.id,
        property: property,
        date,
        time,
        name,
        phone,
        notes,
        status: 'pending'
      });
      setIsSuccess(true);
    }
  };

  // الحصول على تاريخ اليوم بصيغة YYYY-MM-DD بشكل آمن
  const todayDate = new Date();
  const yyyy = todayDate.getFullYear();
  const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
  const dd = String(todayDate.getDate()).padStart(2, '0');
  const today = `${yyyy}-${mm}-${dd}`;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 zoom-in">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">📅 طلب معاينة</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {isSuccess ? (
              <div className="text-center py-5 fade-in">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h4 className="fw-bold text-success mb-3">تم استلام طلبك بنجاح!</h4>
                <p className="text-muted mb-4">شكراً لك <strong>{name}</strong>، سنتواصل معك قريباً على الرقم {phone} لتأكيد الموعد.</p>
                <button className="btn btn-primary px-5 rounded-pill shadow-sm" onClick={onClose}>حسناً، شكراً</button>
              </div>
            ) : (
              <>
                <div className="alert alert-light border mb-3 d-flex align-items-center">
                    <img src={property.imageUrl || (property.images && property.images[0])} alt="" style={{width: 60, height: 60, objectFit: 'cover', borderRadius: 8}} className="me-3" />
                    <div>
                        <strong>{property.location?.neighborhood}</strong>
                        <div className="small text-muted">{property.price?.toLocaleString()} ج | {property.area} م²</div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">تاريخ المعاينة</label>
                      <input type="date" className="form-control" required value={date} onChange={e => setDate(e.target.value)} min={today} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">الوقت المقترح</label>
                      <input type="time" className="form-control" required value={time} onChange={e => setTime(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">الاسم بالكامل</label>
                    <input type="text" className="form-control" placeholder="اسمك" required value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">رقم الهاتف للتواصل</label>
                    <input type="tel" className="form-control" placeholder="01xxxxxxxxx" required value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">ملاحظات إضافية (اختياري)</label>
                    <textarea className="form-control" rows="2" placeholder="أي تفاصيل أخرى تود إضافتها..." value={notes} onChange={e => setNotes(e.target.value)}></textarea>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-success fw-bold">تأكيد الحجز</button>
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