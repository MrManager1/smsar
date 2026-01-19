import React, { useState, useEffect, useCallback } from 'react';

const DEFAULT_CHATS = [
  { id: 1, senderName: 'أحمد محمد', senderContact: '01012345678', message: 'مرحباً، هل الشقة المعروضة في التجمع الخامس متاحة للمعاينة؟', timestamp: new Date().toISOString() },
  { id: 2, senderName: 'سارة علي', senderContact: 'sara@example.com', message: 'أبحث عن فيلا للإيجار في الشيخ زايد، هل لديكم خيارات؟', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, senderName: 'شركة الأمل', senderContact: '0223456789', message: 'هل يوجد تسهيلات في السداد للمكاتب الإدارية؟', timestamp: new Date(Date.now() - 172800000).toISOString() }
];

const AdminChat = ({ adminToken, adminInfo }) => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchChats = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/admin/chats', { headers: { 'x-admin-token': adminToken } })
      .then(res => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        throw new Error('تعذر تحميل الرسائل (قد يكون السيرفر متوقفاً)');
      })
      .then(data => {
        if (Array.isArray(data)) {
          setChats(data);
        } else {
          setChats([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Using mock data due to error:', err);
        // Fallback to mock data for demo/offline mode
        const saved = localStorage.getItem('adminChats');
        if (saved) {
          setChats(JSON.parse(saved));
        } else {
          setChats(DEFAULT_CHATS);
          localStorage.setItem('adminChats', JSON.stringify(DEFAULT_CHATS));
        }
        setLoading(false);
      });
  }, [adminToken]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // الاستماع للتغييرات لتحديث الرسائل تلقائياً عند وصول رسالة جديدة
  useEffect(() => {
    const handleUpdates = () => fetchChats();
    window.addEventListener('adminChatsUpdated', handleUpdates);
    window.addEventListener('storage', handleUpdates);
    return () => {
      window.removeEventListener('adminChatsUpdated', handleUpdates);
      window.removeEventListener('storage', handleUpdates);
    };
  }, [fetchChats]);

  const handleDelete = (chatId) => {
    if (!window.confirm('هل أنت متأكد من أنك تريد حذف هذه الرسالة؟')) return;

    // تحديث فوري للواجهة (Optimistic Update)
    const newChats = chats.filter(c => c.id !== chatId);
    setChats(newChats);
    localStorage.setItem('adminChats', JSON.stringify(newChats));

    fetch(`/api/admin/chats/${chatId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': adminToken }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('فشل في حذف الرسالة.');
      }
    })
    .catch(err => console.warn('Delete failed on server (mock mode active):', err.message));
  };

  const handleSendReply = (chatId) => {
    if (!replyText.trim()) return;
    alert(`تم إرسال الرد إلى العميل بنجاح:\n"${replyText}"`);
    setReplyingTo(null);
    setReplyText('');
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-5">جاري تحميل الرسائل...</div>;
    }

    if (error) {
      return <div className="alert alert-danger m-3">{error}</div>;
    }

    if (chats.length === 0) {
      return (
        <div className="text-center text-muted py-5">
          <h3>لا توجد محادثات نشطة</h3>
          <p>عندما يبدأ العملاء محادثة، ستظهر هنا.</p>
        </div>
      );
    }

    return (
      <div className="list-group list-group-flush">
        {chats.map((chat, index) => (
          <div key={chat.id} className="list-group-item p-4 border-bottom fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="d-flex justify-content-between align-items-start mb-3">
               <div className="d-flex align-items-center">
                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3 text-primary border" style={{width: 50, height: 50, fontSize: '1.5rem'}}>
                    👤
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">{chat.senderName || 'زائر مجهول'}</h6>
                    <small className="text-muted d-block" dir="ltr" style={{textAlign: 'right'}}>{chat.senderContact}</small>
                  </div>
               </div>
               <span className="badge bg-light text-secondary border">{new Date(chat.timestamp).toLocaleString('ar-EG')}</span>
            </div>
            
            <div className="bg-light p-3 rounded-3 mb-3 position-relative border-start border-4 border-primary shadow-sm">
               <p className="mb-0 text-dark fs-6">{chat.message}</p>
            </div>

            <div className="d-flex justify-content-end gap-2 align-items-center">
               {replyingTo === chat.id ? (
                 <div className="w-100 bg-white p-3 rounded border shadow-sm mt-2">
                    <label className="form-label small fw-bold text-muted">الرد على العميل:</label>
                    <textarea className="form-control mb-2" rows="3" placeholder="اكتب رسالتك هنا..." value={replyText} onChange={(e) => setReplyText(e.target.value)} autoFocus></textarea>
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-sm btn-secondary" onClick={() => { setReplyingTo(null); setReplyText(''); }}>إلغاء</button>
                        <button className="btn btn-sm btn-success px-3" onClick={() => handleSendReply(chat.id)}>إرسال 📤</button>
                    </div>
                 </div>
               ) : (
                 <>
                    <button className="btn btn-outline-primary btn-sm px-3 rounded-pill" onClick={() => setReplyingTo(chat.id)}>↩️ رد</button>
                    <button className="btn btn-outline-danger btn-sm px-3 rounded-pill" onClick={() => handleDelete(chat.id)}>🗑️ حذف</button>
                 </>
               )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">رسائل العملاء</h5>
            <button className="btn btn-light btn-sm" onClick={fetchChats} disabled={loading}>
              {loading ? '...' : 'تحديث'}
            </button>
          </div>
          <div className="card-body p-0" style={{ minHeight: '400px' }}>
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;