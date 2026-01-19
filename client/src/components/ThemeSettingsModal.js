import React from 'react';

export const themes = {
  default: { name: 'الافتراضي (بنفسجي)', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#667eea' },
  smsar: { name: 'سمسار (برتقالي)', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#fda085' },
};

export default function ThemeSettingsModal({ show, onClose, currentTheme, onThemeChange }) {
  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1070 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">🎨 تخصيص المظهر</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-muted mb-3">اختر لون الثيم المفضل لديك للموقع:</p>
            <div className="row g-3">
              {Object.entries(themes).map(([key, theme]) => (
                <div key={key} className="col-6 col-md-4">
                  <div 
                    className={`card h-100 cursor-pointer ${currentTheme === key ? 'border-primary border-3' : ''}`}
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                    onClick={() => onThemeChange(key)}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <div className="card-body text-center p-3">
                      <div 
                        className="rounded-circle mx-auto mb-2 shadow-sm" 
                        style={{ width: 40, height: 40, background: theme.gradient }}
                      ></div>
                      <small className="fw-bold d-block text-dark" style={{fontSize: '0.8rem'}}>{theme.name}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}