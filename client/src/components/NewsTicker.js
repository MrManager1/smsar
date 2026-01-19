import React from 'react';

const NewsTicker = () => {
  return (
    <div className="bg-dark text-white py-1 overflow-hidden" style={{ fontSize: '0.9rem', borderBottom: '1px solid #333' }}>
      <div className="container-fluid d-flex align-items-center">
        <span className="badge bg-danger me-2 rounded-0 shadow-sm">عاجل</span>
        <div className="flex-grow-1 overflow-hidden position-relative" style={{ height: '25px' }}>
          <div className="position-absolute w-100 ticker-text" style={{ whiteSpace: 'nowrap' }}>
            <span className="mx-4">🔥 أسعار العقارات في التجمع الخامس تشهد ارتفاعاً طفيفاً هذا الشهر.</span>
            <span className="mx-4">📢 فتح باب الحجز في مشروع "العاصمة الخضراء" بمقدم 10%.</span>
            <span className="mx-4">📉 البنك المركزي يعلن عن مبادرة جديدة للتمويل العقاري بفائدة 3%.</span>
            <span className="mx-4">🏠 نصيحة عقارية: الموقع هو أهم عامل يحدد قيمة العقار الاستثمارية.</span>
            <span className="mx-4">✨ جديد: خدمة التصوير 360 درجة متاحة الآن لجميع العملاء مجاناً لفترة محدودة.</span>
          </div>
        </div>
      </div>
      <style>{`
        .ticker-text {
          animation: ticker 40s linear infinite;
          display: inline-block;
        }
        .ticker-text:hover {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;