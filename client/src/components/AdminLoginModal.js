import React, { useState } from 'react';

export default function AdminLoginModal({ adminToken, setAdminToken, adminInfo, setAdminInfo }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [secretCode, setSecretCode] = useState('');

  // تعريف المستخدمين والصلاحيات (محاكاة قاعدة بيانات)
  const USERS = [
    { username: 'Manager', password: 'Manager142007@', name: 'المدير العام', role: 'admin' },
    { username: 'supervisor', password: 'SupervisorPass2025', name: 'مشرف المبيعات', role: 'supervisor' }
  ];

  const handleLogin = () => {
    setError('');
    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) { 
      const token = `mock-token-${user.role}-${Date.now()}`;
      setAdminToken(token);
      setAdminInfo({ name: user.name, role: user.role, username: user.username });
      // Close the modal programmatically after successful login
      const modalEl = document.getElementById('adminLoginModal');
      if (modalEl) {
        const closeBtn = modalEl.querySelector('.btn-close');
        if (closeBtn) closeBtn.click();
      }
      setUsername('');
      setPassword('');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleCodeLogin = () => {
    setError('');
    // الكود السري الذي يمنحك صلاحيات كاملة (يمكنك تغييره هنا)
    if (secretCode === '1020') {
      const token = `master-token-${Date.now()}`;
      setAdminToken(token);
      setAdminInfo({ name: 'المدير العام (Master)', role: 'admin', username: 'master_admin' });
      
      const modalEl = document.getElementById('adminLoginModal');
      if (modalEl) {
        const closeBtn = modalEl.querySelector('.btn-close');
        if (closeBtn) closeBtn.click();
      }
      setSecretCode('');
    } else {
      setError('الكود غير صحيح');
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    setAdminInfo(null);
    // Also close the modal
    const modalEl = document.getElementById('adminLoginModal');
    if (modalEl) {
        const closeBtn = modalEl.querySelector('.btn-close');
        if (closeBtn) closeBtn.click();
    }
  };

  return (
    <div className="modal fade" id="adminLoginModal" tabIndex="-1" aria-labelledby="adminLoginModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content zoom-in">
          <div className="modal-header">
            <h5 className="modal-title" id="adminLoginModalLabel">لوحة تحكم المسؤول</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {adminToken ? (
              <div className="text-center">
                <p className="mb-4">مرحباً بك، {adminInfo?.name || 'المسؤول'}</p>
                {adminInfo?.role && <span className="badge bg-info mb-3">{adminInfo.role === 'admin' ? 'مدير النظام' : 'مشرف'}</span>}
                <button className="btn btn-danger w-100" onClick={handleLogout}>تسجيل الخروج</button>
              </div>
            ) : (
              <div>
                {/* قسم الدخول بالكود السري */}
                <div className="mb-4 p-3 bg-light rounded border">
                  <label className="form-label fw-bold text-primary">🔑 الدخول السريع (كود الأدمن)</label>
                  <div className="input-group">
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="أدخل الكود السري" 
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCodeLogin()}
                    />
                    <button className="btn btn-primary" onClick={handleCodeLogin}>دخول</button>
                  </div>
                </div>

                <hr className="my-4" />
                <h6 className="text-muted mb-3">أو الدخول باسم المستخدم</h6>

                <div className="mb-3">
                  <label htmlFor="adminUsername" className="form-label">اسم المستخدم</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="adminUsername"
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="أدخل اسم المستخدم"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="adminPassword" className="form-label">كلمة المرور</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="adminPassword"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="أدخل كلمة المرور"
                  />
                </div>
                {error && <div className="alert alert-danger mt-2 py-1 small">{error}</div>}
                <button className="btn btn-outline-secondary w-100" onClick={handleLogin}>دخول تقليدي</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
