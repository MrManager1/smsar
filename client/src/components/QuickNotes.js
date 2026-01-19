import React, { useState, useEffect } from 'react';

const QuickNotes = () => {
  const [note, setNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem('smsar_quick_note');
    if (savedNote) setNote(savedNote);
  }, []);

  const handleChange = (e) => {
    setNote(e.target.value);
    localStorage.setItem('smsar_quick_note', e.target.value);
  };

  if (!isOpen) {
    return (
      <button 
        className="btn btn-warning rounded-circle shadow position-fixed floating-widget widget-notes" 
        style={{ bottom: '80px', left: '20px', width: '50px', height: '50px', zIndex: 1050 }}
        onClick={() => setIsOpen(true)}
        title="ملاحظات سريعة"
      >
        📝
      </button>
    );
  }

  return (
    <div className="card shadow position-fixed floating-widget widget-notes" style={{ bottom: '80px', left: '20px', width: '250px', height: '300px', zIndex: 1050 }}>
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center py-2">
        <span className="small fw-bold">ملاحظات سريعة</span>
        <button className="btn-close small" onClick={() => setIsOpen(false)}></button>
      </div>
      <div className="card-body p-0">
        <textarea 
          className="form-control border-0 h-100 rounded-0 p-3" 
          style={{ resize: 'none', backgroundColor: '#fff9c4' }}
          placeholder="اكتب ملاحظاتك هنا..."
          value={note}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="card-footer bg-light py-1 text-muted text-center" style={{ fontSize: '0.7rem' }}>
        يتم الحفظ تلقائياً
      </div>
    </div>
  );
};

export default QuickNotes;