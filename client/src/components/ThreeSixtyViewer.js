import React from 'react';

export default function ThreeSixtyViewer({ url, onClose }) {
  if (!url) return null;

  // التحقق مما إذا كان الرابط صورة أم ملف PDF (تقريبي)
  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.9)', zIndex: 1080 }}>
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content bg-transparent border-0 h-100">
          <div className="modal-header border-0 position-absolute top-0 end-0 p-4" style={{ zIndex: 10 }}>
            <button type="button" className="btn-close btn-close-white btn-lg shadow-none" onClick={onClose} style={{ filter: 'invert(1)' }}></button>
          </div>
          <div className="modal-body p-0 h-100 w-100 d-flex align-items-center justify-content-center">
             {isImage ? (
                 <img src={url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
             ) : (
                 <iframe src={url} title="Document Preview" style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}></iframe>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}