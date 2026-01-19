import React from 'react';

const defaultReviews = [
  { name: 'محمد أحمد', text: 'وجدت شقة أحلامي في التجمع الخامس بسهولة من خلال الموقع. شكراً لكم!', role: 'عميل', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'منى السيد', text: 'الموقع ممتاز وسهل الاستخدام، ساعدني في بيع فيلتي بسرعة.', role: 'مالك عقار', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'علي حسن', text: 'خدمة العملاء ممتازة وتوفير خيارات متنوعة تناسب كل الميزانيات.', role: 'مستثمر', img: 'https://randomuser.me/api/portraits/men/85.jpg' },
];

export default function Testimonials({ darkMode, reviews = defaultReviews }) {
  return (
    <div className={`py-5 ${darkMode ? 'bg-dark' : 'bg-white'}`}>
      <div className="container">
        <div className="text-center mb-5">
          <h2 className={`fw-bold ${darkMode ? 'text-white' : ''}`}>💬 آراء عملائنا</h2>
          <p className={darkMode ? 'text-white-50' : 'text-muted'}>نفتخر بمساعدة عملائنا في العثور على منزلهم المثالي</p>
        </div>
        <div className="row g-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="col-md-4">
              <div className={`card h-100 border-0 shadow-sm text-center p-4 testimonial-card position-relative overflow-hidden ${darkMode ? 'bg-secondary text-white' : 'bg-light'}`} style={{borderRadius: '20px', animationDelay: `${idx * 0.1}s`}}>
                <div className="position-absolute top-0 start-0 p-3 opacity-10 display-1 text-primary" style={{lineHeight: 0.5, fontFamily: 'serif'}}>“</div>
                <div className="mb-3">
                  <img src={review.img} alt={review.name} className="rounded-circle shadow border border-3 border-white" style={{width: 80, height: 80, objectFit: 'cover'}} />
                </div>
                <h5 className="card-title">{review.name}</h5>
                <h6 className={`card-subtitle mb-3 small ${darkMode ? 'text-light' : 'text-primary'}`}>{review.role}</h6>
                <p className={`card-text fst-italic position-relative z-1 ${darkMode ? 'text-white-50' : 'text-muted'}`}>"{review.text}"</p>
                <div className="text-warning">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .testimonial-card { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .testimonial-card:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}