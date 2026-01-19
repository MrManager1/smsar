import React from 'react';

export default function Footer({ onViewChange, onAreaSelect }) {
  return (
    <footer className="bg-dark text-light mt-auto position-relative">
      {/* Wave SVG for smooth transition */}
      <div className="position-absolute top-0 start-0 w-100 overflow-hidden" style={{ transform: 'translateY(-99%)', lineHeight: 0 }}>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: '100%', height: '60px', fill: '#212529' }}>
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
      </div>
      <div className="container pt-4 pb-3">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold text-primary mb-3">🏠 سمسار</h5>
            <p className="text-white-50">
              منصتك العقارية الأولى للبيع والشراء والإيجار.
              نقدم لك أفضل الفرص العقارية في أرقى المناطق بأسعار تنافسية.
            </p>
          </div>
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold mb-3">روابط سريعة</h6>
            <ul className="list-unstyled">
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0" onClick={() => onViewChange && onViewChange('dashboard')}>الرئيسية</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0" onClick={() => onViewChange && onViewChange('properties')}>العقارات</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0" onClick={() => onViewChange && onViewChange('about')}>من نحن</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0" onClick={() => { const w = document.querySelector('.contact-fab'); if(w) w.click(); }}>اتصل بنا</button></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">أهم المناطق</h6>
            <ul className="list-unstyled">
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0 footer-link" onClick={() => onAreaSelect && onAreaSelect('التجمع الخامس')}>التجمع الخامس</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0 footer-link" onClick={() => onAreaSelect && onAreaSelect('الشيخ زايد')}>الشيخ زايد</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0 footer-link" onClick={() => onAreaSelect && onAreaSelect('العاصمة الإدارية')}>العاصمة الإدارية</button></li>
              <li><button className="btn btn-link text-white-50 text-decoration-none p-0 footer-link" onClick={() => onAreaSelect && onAreaSelect('الساحل الشمالي')}>الساحل الشمالي</button></li>
            </ul>
          </div>
          <div className="col-md-3 mb-4">
            <h6 className="fw-bold mb-3">تواصل معنا</h6>
            <p className="text-white-50 mb-1">📞 01000000000</p>
            <p className="text-white-50 mb-1">📧 info@smsar.com</p>
            <p className="text-white-50 mb-3">📍 القاهرة، مصر</p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white-50 text-decoration-none social-icon fs-5" title="Facebook">FB</a>
              <a href="#" className="text-white-50 text-decoration-none social-icon fs-5" title="Twitter">TW</a>
              <a href="#" className="text-white-50 text-decoration-none social-icon fs-5" title="Instagram">IN</a>
              <a href="#" className="text-white-50 text-decoration-none social-icon fs-5" title="LinkedIn">LI</a>
            </div>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-white-50">
          <small>&copy; {new Date().getFullYear()} سمسار. جميع الحقوق محفوظة.</small>
        </div>
      </div>
      <style>{`
        .footer-link, .social-icon { transition: color 0.2s ease-in-out; }
        .footer-link:hover, .social-icon:hover { color: var(--bs-primary) !important; }
      `}</style>
    </footer>
  );
}