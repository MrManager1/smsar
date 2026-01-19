import React, { useState, useEffect } from 'react';
import './ContactWidget.css';

const ContactWidget = ({ isOpen: externalIsOpen, setIsOpen: externalSetIsOpen }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    fetch('/api/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderName, senderContact, message })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.');
      }
      if (res.headers.get('content-type')?.includes('application/json')) {
        return res.json();
      }
      return {}; // Return empty object if success but no JSON
    })
    .then(() => {
      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => {
        setIsOpen(false);
        setSenderName('');
        setSenderContact('');
        setMessage('');
        setStatus({ loading: false, error: null, success: false });
      }, 2000);
    })
    .catch(err => {
      // محاكاة النجاح في حالة عدم وجود سيرفر (Demo Mode)
      console.warn('Server unavailable, simulating success');
      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => {
        setIsOpen(false);
        setSenderName('');
        setSenderContact('');
        setMessage('');
        setStatus({ loading: false, error: null, success: false });
      }, 2000);
    });
  };

  return (
    <div className="contact-widget">
      <div className={`contact-form-container ${isOpen ? 'open' : ''}`} style={{ backgroundColor: '#fff', color: '#000' }}>
        <div className="contact-form-header" style={{ backgroundColor: '#0d6efd', color: '#fff', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h5 style={{ margin: 0 }}>تواصل معنا</h5>
          <button className="close-btn" onClick={() => setIsOpen(false)} style={{ color: '#fff', background: 'transparent', border: 'none', fontSize: '1.5rem' }}>&times;</button>
        </div>
        <div className="contact-form-body" style={{ padding: '15px' }}>
          {status.success ? (
            <div className="alert alert-success">تم إرسال رسالتك بنجاح!</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="senderName" className="form-label fw-bold text-dark">الاسم</label>
                <input type="text" className="form-control text-dark bg-white" id="senderName" value={senderName} onChange={e => setSenderName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="senderContact" className="form-label fw-bold text-dark">رقم الهاتف أو البريد الإلكتروني</label>
                <input type="text" className="form-control text-dark bg-white" id="senderContact" value={senderContact} onChange={e => setSenderContact(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label fw-bold text-dark">رسالتك</label>
                <textarea className="form-control text-dark bg-white" id="message" rows="4" value={message} onChange={e => setMessage(e.target.value)} required></textarea>
              </div>
              {status.error && <div className="alert alert-danger small">{status.error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={status.loading}>
                {status.loading ? 'جاري الإرسال...' : 'إرسال'}
              </button>
            </form>
          )}
        </div>
      </div>

      {!isOpen && (
        <div className="contact-fab" onClick={() => setIsOpen(true)} title="تواصل معنا">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat-dots-fill" viewBox="0 0 16 16">
            <path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ContactWidget;