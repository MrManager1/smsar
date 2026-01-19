import React from 'react';

function NewClientModal({
  clientName, setClientName,
  clientPhone, setClientPhone,
  clientEmail, setClientEmail,
  clientDesiredType, setClientDesiredType,
  clientDesiredStatus, setClientDesiredStatus,
  clientPreferredLocation, setClientPreferredLocation,
  clientBudget, setClientBudget,
  clientMinArea, setClientMinArea,
  clientMinRooms, setClientMinRooms,
  clientNotes, setClientNotes,
  handleAddClient, handleUpdateClient,
  editingClient
}) {
  const handleSubmit = () => {
    if (editingClient) {
      handleUpdateClient();
    } else {
      handleAddClient();
    }
  };

  return (
    <div className="modal fade" id="newClientModal" tabIndex="-1" aria-labelledby="newClientModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content zoom-in">
          <div className="modal-header">
            <h5 className="modal-title" id="newClientModalLabel">{editingClient ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="clientName" className="form-label">اسم العميل</label>
                <input type="text" className="form-control" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientPhone" className="form-label">رقم الهاتف</label>
                <input type="text" className="form-control" id="clientPhone" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientEmail" className="form-label">البريد الإلكتروني</label>
                <input type="email" className="form-control" id="clientEmail" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientDesiredType" className="form-label">نوع العقار</label>
                <select className="form-select" id="clientDesiredType" value={clientDesiredType} onChange={(e) => setClientDesiredType(e.target.value)}>
                  <option value="">اختر النوع</option>
                  <option value="شقة">شقة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="مكتب">مكتب</option>
                  <option value="محل">محل</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="clientDesiredStatus" className="form-label">الحالة</label>
                <select className="form-select" id="clientDesiredStatus" value={clientDesiredStatus} onChange={(e) => setClientDesiredStatus(e.target.value)}>
                  <option value="">اختر الحالة</option>
                  <option value="للبيع">للبيع</option>
                  <option value="للإيجار">للإيجار</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="clientPreferredLocation" className="form-label">المنطقة المفضلة</label>
                <input type="text" className="form-control" id="clientPreferredLocation" value={clientPreferredLocation} onChange={(e) => setClientPreferredLocation(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientBudget" className="form-label">الميزانية</label>
                <input type="number" className="form-control" id="clientBudget" value={clientBudget} onChange={(e) => setClientBudget(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientMinArea" className="form-label">أقل مساحة (م²)</label>
                <input type="number" className="form-control" id="clientMinArea" value={clientMinArea} onChange={(e) => setClientMinArea(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientMinRooms" className="form-label">أقل عدد غرف</label>
                <input type="number" className="form-control" id="clientMinRooms" value={clientMinRooms} onChange={(e) => setClientMinRooms(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="clientNotes" className="form-label">ملاحظات</label>
                <textarea className="form-control" id="clientNotes" rows="3" value={clientNotes} onChange={(e) => setClientNotes(e.target.value)}></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">{editingClient ? 'تحديث البيانات' : 'تسجيل العميل'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewClientModal;
