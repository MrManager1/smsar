import React, { useState, useEffect } from 'react';

export default function AdminManagementModal({ show, onClose, adminInfo, onSettingsChange }) {
  const [activeTab, setActiveTab] = useState('general');
  const [siteName, setSiteName] = useState(localStorage.getItem('smsar_site_name') || 'SMSAR');
  const [contactPhone, setContactPhone] = useState(localStorage.getItem('smsar_contact_phone') || '01000000000');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (show) {
      // محاكاة سجلات النشاط
      setLogs([
        { id: 1, action: 'تسجيل دخول مسؤول', user: adminInfo?.name, time: new Date().toLocaleString('ar-EG') },
        { id: 2, action: 'تحديث بيانات الموقع', user: 'النظام', time: new Date(Date.now() - 3600000).toLocaleString('ar-EG') },
        { id: 3, action: 'إضافة عقار جديد', user: 'Admin', time: new Date(Date.now() - 7200000).toLocaleString('ar-EG') },
      ]);
    }
  }, [show, adminInfo]);

  const handleSaveSettings = () => {
    localStorage.setItem('smsar_site_name', siteName);
    localStorage.setItem('smsar_contact_phone', contactPhone);
    if (onSettingsChange) onSettingsChange(siteName);
    alert('تم حفظ الإعدادات بنجاح ✅');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1090 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">⚙️ إعدادات النظام</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>عام</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>سجل النشاط</button>
              </li>
            </ul>

            {activeTab === 'general' && (
              <div className="fade-in">
                <div className="mb-3">
                  <label className="form-label">اسم الموقع (يظهر في العنوان)</label>
                  <input type="text" className="form-control" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">رقم التواصل الرئيسي</label>
                  <input type="text" className="form-control" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={handleSaveSettings}>حفظ التغييرات</button>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="fade-in">
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>الحدث</th>
                        <th>المستخدم</th>
                        <th>التوقيت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id}>
                          <td>{log.id}</td>
                          <td>{log.action}</td>
                          <td>{log.user}</td>
                          <td>{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}