import React, { useState, useEffect } from 'react';

const AdminChat = ({ adminToken }) => {
  // Placeholder state for chat functionality
  const [chats, setChats] = useState([]);

  useEffect(() => {
    if (adminToken) {
      // Logic to fetch chats would go here
      // fetch('/api/admin/chats', { headers: { 'x-admin-token': adminToken } })
      //   .then(res => res.json())
      //   .then(data => setChats(data));
    }
  }, [adminToken]);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">رسائل العملاء</h5>
            <span className="badge bg-light text-dark">{chats.length} محادثات</span>
          </div>
          <div className="card-body" style={{ minHeight: '400px' }}>
            {!adminToken ? (
              <div className="alert alert-danger m-3" role="alert">
                <strong>غير مصرح:</strong> يرجى تسجيل الدخول كمسؤول للوصول إلى المحادثات.
              </div>
            ) : (
              <div className="text-center text-muted py-5">
                <h3>لا توجد محادثات نشطة</h3>
                <p>عندما يبدأ العملاء محادثة، ستظهر هنا.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;