import React, { useState, useEffect, useCallback } from 'react';

const AdminChat = ({ adminToken }) => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchChats = useCallback(() => {
    if (!adminToken) return;
    setLoading(true);
    setError(null);
    fetch('/api/admin/chats', { headers: { 'x-admin-token': adminToken } })
      .then(res => {
        if (!res.ok) {
          throw new Error('فشل في جلب الرسائل. قد تكون غير مصرح لك.');
        }
        return res.json();
      })
      .then(data => {
        setChats(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [adminToken]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleDelete = (chatId) => {
    if (!window.confirm('هل أنت متأكد من أنك تريد حذف هذه الرسالة؟')) return;

    fetch(`/api/admin/chats/${chatId}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': adminToken }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('فشل في حذف الرسالة.');
      }
      // Refresh chats after deletion
      fetchChats();
    })
    .catch(err => alert(err.message));
  };

  const renderContent = () => {
    if (!adminToken) {
      return (
        <div className="alert alert-danger m-3" role="alert">
          <strong>غير مصرح:</strong> يرجى تسجيل الدخول كمسؤول للوصول إلى المحادثات.
        </div>
      );
    }

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
      <ul className="list-group list-group-flush">
        {chats.map(chat => (
          <li key={chat.id} className="list-group-item d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold">{chat.senderName || 'مجهول'} - <small className="text-muted">{chat.senderContact}</small></div>
              {chat.message}
              <div className="text-muted small mt-2">{new Date(chat.timestamp).toLocaleString('ar-EG')}</div>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(chat.id)}>
              حذف
            </button>
          </li>
        ))}
      </ul>
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
