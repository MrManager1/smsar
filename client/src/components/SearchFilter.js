import React, { useState, useEffect } from 'react';

// Professional animations and styles
const styles = `
  @keyframes slideDownFade {
    from { opacity: 0; transform: translateY(-20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .search-modal-anim {
    animation: slideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(13, 110, 253, 0); }
    100% { box-shadow: 0 0 0 0 rgba(13, 110, 253, 0); }
  }
  .listening-mode {
    animation: pulse-ring 1.5s infinite;
    background-color: #dc3545 !important;
    border-color: #dc3545 !important;
    color: white !important;
  }
`;

function SearchFilter({ onApply, onClear, initial = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Load from localStorage or initial props
  const [q, setQ] = useState(() => initial.q || localStorage.getItem('smsar_q') || '');
  const [type, setType] = useState(() => initial.type || localStorage.getItem('smsar_type') || '');
  const [status, setStatus] = useState(() => initial.status || localStorage.getItem('smsar_status') || '');
  const [minPrice, setMinPrice] = useState(() => initial.minPrice || localStorage.getItem('smsar_minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(() => initial.maxPrice || localStorage.getItem('smsar_maxPrice') || '');
  const [minRooms, setMinRooms] = useState(() => initial.minRooms || localStorage.getItem('smsar_minRooms') || '');

  const apply = () => {
    // Save filters to localStorage
    localStorage.setItem('smsar_q', q);
    localStorage.setItem('smsar_type', type);
    localStorage.setItem('smsar_status', status);
    localStorage.setItem('smsar_minPrice', minPrice);
    localStorage.setItem('smsar_maxPrice', maxPrice);
    localStorage.setItem('smsar_minRooms', minRooms);

    onApply({ q, type, status, minPrice: minPrice ? Number(minPrice) : '', maxPrice: maxPrice ? Number(maxPrice) : '', minRooms: minRooms ? Number(minRooms) : '' });
    setIsOpen(false);
  };

  const clear = () => {
    // Clear localStorage
    ['q', 'type', 'status', 'minPrice', 'maxPrice', 'minRooms'].forEach(k => localStorage.removeItem(`smsar_${k}`));
    
    setQ(''); setType(''); setStatus(''); setMinPrice(''); setMaxPrice(''); setMinRooms('');
    onClear();
  };

  const handleVoiceSearch = () => {
    if (isListening) return; // Prevent multiple clicks

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('عذراً، متصفحك لا يدعم البحث الصوتي.');
      return;
    }
    
    setIsListening(true);
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-EG';
    recognition.start();
    
    recognition.onresult = (event) => {
      setQ(event.results[0][0].transcript);
      setIsListening(false);
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  return (
    <>
      <style>{styles}</style>
      {!isOpen && (
        <div style={{ position: 'fixed', top: 100, right: 20, zIndex: 1050 }}>
          <button 
            className="btn btn-primary rounded-circle shadow" 
            onClick={() => setIsOpen(true)} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ 
              width: 60, height: 60, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: isHovered ? 1 : 0.6,
              transition: 'opacity 0.3s'
            }}
            title="بحث وتصفية"
          >
            🔍
          </button>
        </div>
      )}

      {isOpen && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1060 }} onClick={() => setIsOpen(false)}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content search-modal-anim border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">🔍 بحث وتصفية</h5>
                <button type="button" className="btn-close" onClick={() => setIsOpen(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">بحث عام</label>
                    <div className="input-group">
                      <input className="form-control" placeholder="المنطقة، المالك، الوصف..." value={q} onChange={e => setQ(e.target.value)} />
                      <button 
                        className={`btn ${isListening ? 'listening-mode' : 'btn-outline-primary'}`} 
                        type="button" 
                        onClick={handleVoiceSearch} 
                        title="بحث صوتي"
                      >
                        {isListening ? 'جاري الاستماع...' : '🎤'}
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">نوع العقار</label>
                    <select className="form-select" value={type} onChange={e => setType(e.target.value)}>
                      <option value="">كل الأنواع</option>
                      <option>شقة</option>
                      <option>فيلا</option>
                      <option>مكتب</option>
                      <option>محل</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">الحالة</label>
                    <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                      <option value="">الكل</option>
                      <option>للبيع</option>
                      <option>للإيجار</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">أقل سعر</label>
                    <input type="number" className="form-control" placeholder="أقل سعر" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">أعلى سعر</label>
                    <input type="number" className="form-control" placeholder="أعلى سعر" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">عدد الغرف (على الأقل)</label>
                    <select className="form-select" value={minRooms} onChange={e => setMinRooms(e.target.value)}>
                        <option value="">أي عدد</option>
                        <option value="1">1+</option>
                        <option value="2">2+</option>
                        <option value="3">3+</option>
                        <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary me-auto" onClick={clear}>مسح الفلاتر</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>إغلاق</button>
                <button type="button" className="btn btn-primary" onClick={apply}>تطبيق</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchFilter;
