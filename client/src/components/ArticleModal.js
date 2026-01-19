import React from 'react';

const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1070 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content shadow-lg border-0 zoom-in">
          <div className="modal-header border-0 p-0">
            <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" style={{ zIndex: 2 }} onClick={onClose}></button>
          </div>
          <div className="modal-body p-0">
            <div className="position-relative" style={{ height: '300px' }}>
              <img src={article.img} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={article.title} />
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
              <div className="position-absolute bottom-0 start-0 p-4 text-white">
                <span className="badge bg-primary mb-2">{article.date}</span>
                <h2 className="fw-bold">{article.title}</h2>
              </div>
            </div>
            <div className="p-4" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p style={{ whiteSpace: 'pre-line' }}>{article.fullText}</p>
            </div>
          </div>
          <div className="modal-footer bg-light">
            <button type="button" className="btn btn-secondary" onClick={onClose}>إغلاق</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;