import React, { useState } from 'react';

export default function Newsletter({ darkMode }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    const cleanEmail = email.trim(); // إزالة المسافات الزائدة
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(cleanEmail)) {
      // التحقق من التكرار محلياً
      let subscribed = [];
      try {
        subscribed = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
        if (!Array.isArray(subscribed)) subscribed = [];
      } catch (e) {
        subscribed = [];
      }

      if (subscribed.includes(cleanEmail)) {
        alert('هذا البريد الإلكتروني مشترك بالفعل!');
        return;
      }

      setLoading(true);
      fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      })
      .then(res => {
        // التحقق من أن الاستجابة JSON فعلية (لتجنب استجابات HTML الافتراضية)
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          alert('شكراً لاشتراكك! 📩');
          setEmail(''); 
          localStorage.setItem('subscribedEmails', JSON.stringify([...subscribed, cleanEmail]));
        } else {
          // في حالة عدم وجود السيرفر (404) ننتقل لوضع التجربة
          throw new Error('API not found');
        }
      })
      .catch(() => {
        // محاكاة النجاح
        alert('شكراً لاشتراكك! 📩 (وضع تجريبي)');
        setEmail('');
        try {
          localStorage.setItem('subscribedEmails', JSON.stringify([...subscribed, cleanEmail]));
        } catch (e) {}
      })
      .finally(() => setLoading(false));
    } else {
      alert('الرجاء إدخال بريد إلكتروني صحيح.');
    }
  };

  return (
    <div className="py-5 text-white" style={{ background: darkMode ? '#1a1d20' : 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}>
      <div className="container text-center">
        <h2 className="fw-bold mb-3">📬 اشترك في النشرة العقارية</h2>
        <p className="mb-4 opacity-75">احصل على أحدث الفرص العقارية والعروض الحصرية فور نزولها.</p>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group mb-3">
              <input type="email" className={`form-control form-control-lg border-0 ${darkMode ? 'bg-dark text-white' : ''}`} placeholder="أدخل بريدك الإلكتروني" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className={`btn btn-lg px-4 ${darkMode ? 'btn-primary' : 'btn-dark'}`} type="button" onClick={handleSubscribe} disabled={loading}>
                {loading ? 'جاري...' : 'اشترك الآن'}
              </button>
            </div>
            <small className="opacity-50">نعدك بعدم إرسال رسائل مزعجة.</small>
          </div>
        </div>
      </div>
    </div>
  );
}