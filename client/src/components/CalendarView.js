import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/ar';

// إعداد اللغة العربية للتقويم
moment.locale('ar');
const localizer = momentLocalizer(moment);

const CalendarView = ({ visits = [] }) => {
  const [selectedVisit, setSelectedVisit] = useState(null);

  // تصفية المواعيد المؤكدة فقط
  const confirmedVisits = visits.filter(v => v.status === 'confirmed');

  // تحويل المواعيد إلى الصيغة التي يفهمها التقويم
  const events = confirmedVisits.map(visit => {
    const visitDate = new Date(visit.date);
    // التأكد من أن الوقت موجود وصحيح
    const timeParts = typeof visit.time === 'string' ? visit.time.split(':') : ['0', '0'];
    const hour = parseInt(timeParts[0], 10) || 0;
    const minute = parseInt(timeParts[1], 10) || 0;
    
    const start = new Date(visitDate.getFullYear(), visitDate.getMonth(), visitDate.getDate(), hour, minute);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // افتراض أن مدة المعاينة ساعة واحدة

    return {
      title: `معاينة: ${visit.property.location?.neighborhood} - ${visit.name}`,
      start,
      end,
      resource: visit, // الاحتفاظ ببيانات الموعد الأصلي
    };
  });

  // ترجمة رسائل التقويم إلى العربية
  const messages = {
    allDay: 'يوم كامل',
    previous: 'السابق',
    next: 'التالي',
    today: 'اليوم',
    month: 'شهر',
    week: 'أسبوع',
    day: 'يوم',
    agenda: 'أجندة',
    date: 'تاريخ',
    time: 'وقت',
    event: 'حدث',
    showMore: total => `+${total} المزيد`,
  };

  return (
    <>
      <div className="card shadow-sm p-3 fade-in" style={{ height: '80vh' }}>
        <h2 className="mb-4 text-primary">📅 تقويم المواعيد المؤكدة</h2>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ flex: 1 }}
          messages={messages}
          rtl={true}
          onSelectEvent={event => setSelectedVisit(event.resource)}
          eventPropGetter={() => ({ style: { backgroundColor: '#0d6efd', borderColor: '#0a58ca', cursor: 'pointer' } })}
        />
      </div>

      {/* Visit Details Modal */}
      {selectedVisit && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedVisit(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-light">
                <h5 className="modal-title">تفاصيل الموعد</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedVisit(null)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex align-items-center mb-3">
                  <img src={selectedVisit.property.imageUrl || (selectedVisit.property.images && selectedVisit.property.images[0])} alt="Property" className="rounded me-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  <div>
                    <h6 className="fw-bold mb-0">{selectedVisit.property.location?.neighborhood}</h6>
                    <span className="badge bg-primary">{selectedVisit.property.type}</span>
                  </div>
                </div>
                <p><strong>العميل:</strong> {selectedVisit.name} ({selectedVisit.phone})</p>
                <p><strong>الموعد:</strong> {new Date(selectedVisit.date).toLocaleDateString('ar-EG')} الساعة {selectedVisit.time}</p>
                {selectedVisit.notes && <p className="text-muted border-top pt-2 mt-2"><strong>ملاحظات:</strong> {selectedVisit.notes}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CalendarView;