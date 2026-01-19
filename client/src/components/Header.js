import React, { useState, useEffect } from 'react';

export default function Header({ cartCount, onOpenCart, onLogin, adminInfo, currentUser, onLogout, onClientLogout, onSearch, onViewChange, onCategorySelect = () => {}, darkMode, toggleDarkMode, onOpenVisitsList, visitsCount, notifications, onClearNotifications, favoritesCount, onOpenAdminSettings, siteName }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm);
  };
  return (
    <header className={`shadow-sm sticky-top transition-header ${isScrolled ? 'glass-header py-2' : 'bg-white py-3'}`} style={{ borderTop: '5px solid #0d6efd', zIndex: 1020 }}>
      {/* Top Bar */}
      <div className={`bg-dark text-white py-1 small d-none d-md-block transition-height ${isScrolled ? 'h-0 overflow-hidden p-0' : ''}`}>
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <span className="me-3">📞 01000000000</span>
            <span>📧 info@smsar.com</span>
          </div>
          <div>
            <span className="me-2">أكبر منصة عقارية في مصر 🏠</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-3 text-center text-md-end mb-3 mb-md-0">
            <a href="#" className="text-decoration-none logo-hover" onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}>
              <h2 className="fw-bold m-0 text-dark" style={{ fontFamily: 'Tahoma, sans-serif', letterSpacing: '-1px' }}>
                <span className="text-primary" style={{ textShadow: '1px 1px 0 #000' }}>{siteName || 'SMSAR'}</span>
              </h2>
              <small className="text-muted" style={{ fontSize: '0.7rem', letterSpacing: '2px' }}>REAL ESTATE</small>
            </a>
          </div>
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="input-group">
              <input 
                type="text" 
                className="form-control border-2" 
                placeholder="ابحث عن المنطقة، نوع العقار، أو السعر..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{ borderRadius: '0 25px 25px 0' }}
              />
              <button className="btn btn-primary text-white fw-bold px-4" onClick={handleSearch} style={{ borderRadius: '25px 0 0 25px' }}>
                بحث
              </button>
            </div>
          </div>
          <div className="col-md-3 text-center text-md-start">
            <button className="btn btn-outline-dark me-2 rounded-pill px-3" onClick={() => onViewChange('favorites')}>
              ❤️ <span className="d-none d-lg-inline ms-1">المفضلة {favoritesCount > 0 && `(${favoritesCount})`}</span>
            </button>
            {adminInfo && onOpenVisitsList && (
              <button className="btn btn-outline-dark me-2 rounded-pill px-3 position-relative" onClick={onOpenVisitsList} title="طلبات المعاينة">
                🗓️ <span className="d-none d-lg-inline ms-1">المواعيد</span>
                {visitsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                    {visitsCount}
                    <span className="visually-hidden">مواعيد جديدة</span>
                  </span>
                )}
              </button>
            )}
            <div className="dropdown d-inline-block">
                <button className="btn btn-outline-dark me-2 rounded-pill px-3 position-relative" type="button" id="notificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false" title="الإشعارات">
                    🔔
                    {notifications && notifications.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                            {notifications.length}
                        </span>
                    )}
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="notificationsDropdown" style={{width: '350px', maxHeight: '400px', overflowY: 'auto'}}>
                    <li className="p-2 d-flex justify-content-between align-items-center">
                        <h6 className="dropdown-header p-0">الإشعارات</h6>
                        {notifications && notifications.length > 0 && <button className="btn btn-sm btn-link text-decoration-none p-0" onClick={onClearNotifications}>مسح الكل</button>}
                    </li>
                    {notifications && notifications.length > 0 ? notifications.map(notif => (
                        <li key={notif.id}>
                            <div className="dropdown-item-text p-2 border-bottom">
                                <p className="mb-1 small">{notif.message}</p>
                                <small className="text-muted">{new Date(notif.timestamp).toLocaleString('ar-EG')}</small>
                            </div>
                        </li>
                    )) : (
                        <li className="p-4 text-center text-muted">لا توجد إشعارات جديدة.</li>
                    )}
                </ul>
            </div>
            {toggleDarkMode && (
              <button 
                className={`btn rounded-circle me-2 ${darkMode ? 'btn-light text-warning' : 'btn-outline-secondary text-dark'}`} 
                onClick={toggleDarkMode}
                title={darkMode ? "الوضع النهاري" : "الوضع الليلي"}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
            {adminInfo ? (
               <div className="dropdown d-inline-block ms-2">
                 <button className="btn btn-dark rounded-pill px-3 dropdown-toggle" type="button" id="adminDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   👤 {adminInfo.name}
                 </button>
                 <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="adminDropdown">
                   <li><button className="dropdown-item" onClick={() => onViewChange('dashboard')}>📊 لوحة التحكم</button></li>
                   {onOpenAdminSettings && <li><button className="dropdown-item" onClick={onOpenAdminSettings}>⚙️ إعدادات النظام</button></li>}
                   <li><hr className="dropdown-divider" /></li>
                   <li><button className="dropdown-item text-danger" onClick={onLogout}>تسجيل الخروج</button></li>
                 </ul>
               </div>
            ) : currentUser ? (
               <div className="dropdown d-inline-block ms-2">
                 <button className="btn btn-outline-primary rounded-pill px-3 dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                   👤 {currentUser.name.split(' ')[0]}
                 </button>
                 <ul className="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                   <li><button className="dropdown-item text-danger" onClick={onClientLogout}>تسجيل الخروج</button></li>
                 </ul>
               </div>
            ) : (
               <button className="btn btn-outline-primary rounded-pill px-3" onClick={onLogin}>🔑 دخول</button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className={`border-top border-bottom ${isScrolled ? 'bg-transparent border-0' : 'bg-white'}`}>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light p-0">
            <button className="navbar-toggler w-100" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
              <span className="navbar-toggler-icon"></span> القائمة
            </button>
            <div className="collapse navbar-collapse" id="mainNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold w-100 justify-content-center gap-4">
                <li className="nav-item"><button className="nav-link btn btn-link active" onClick={() => onViewChange('dashboard')}>الرئيسية</button></li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">عقارات للبيع</a>
                  <ul className="dropdown-menu text-end border-0 shadow">
                    <li><button className="dropdown-item" onClick={() => onCategorySelect('شقة')}>شقق</button></li>
                    <li><button className="dropdown-item" onClick={() => onCategorySelect('فيلا')}>فيلات</button></li>
                    <li><button className="dropdown-item" onClick={() => onCategorySelect('أرض')}>أراضي</button></li>
                  </ul>
                </li>
                <li className="nav-item"><button className="nav-link btn btn-link" title="العقارات" onClick={() => onViewChange('properties')}>تصفح العقارات</button></li>
                <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => onViewChange('properties')}>مشاريع جديدة</button></li>
                <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => onViewChange('about')}>من نحن</button></li>
                <li className="nav-item"><button className="nav-link btn btn-link" onClick={() => { const w = document.querySelector('.contact-fab'); if(w) w.click(); }}>اتصل بنا</button></li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      
      {/* Scroll Progress Bar */}
      <div style={{ height: '3px', background: 'transparent', width: '100%' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #0d6efd, #0dcaf0)', width: `${scrollProgress}%`, transition: 'width 0.1s' }}></div>
      </div>
      
      <style>{`
        .transition-header { transition: all 0.4s ease; }
        .transition-height { transition: all 0.4s ease; }
        .h-0 { height: 0 !important; }
        .glass-header {
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .logo-hover { display: inline-block; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .logo-hover:hover { transform: scale(1.1) rotate(-2deg); }
      `}</style>
    </header>
  );
}