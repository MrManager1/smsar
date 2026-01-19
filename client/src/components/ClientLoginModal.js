import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebaseConfig';

export default function ClientLoginModal({ show, onClose, onLogin, onSwitchToAdmin }) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const appUser = {
        id: user.uid,
        name: user.displayName || 'مستخدم جوجل',
        email: user.email,
        photo: user.photoURL,
        provider: 'google'
      };
      onLogin(appUser);
    } catch (error) {
      console.error("Google Login Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError("تم إغلاق النافذة قبل اكتمال التسجيل.");
      } else {
        setError("فشل تسجيل الدخول عبر جوجل. حاول مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1080 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0 overflow-hidden">
          <div className="modal-header border-0 bg-light">
            <h5 className="modal-title fw-bold">👋 تسجيل الدخول</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body p-4">
            
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <p className="text-center text-muted mb-4">سجل الدخول للمتابعة وحفظ العقارات المفضلة.</p>

            <div className="d-grid gap-2">
              <button className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center" onClick={handleGoogleLogin} disabled={loading}>
                {loading ? (
                  <span>جاري الاتصال...</span>
                ) : (
                  <><span className="me-2">🔴</span> الاستمرار باستخدام Google</>
                )}
              </button>
            </div>

            <div className="text-center mt-4 pt-3 border-top">
              <button className="btn btn-link btn-sm text-secondary text-decoration-none" onClick={onSwitchToAdmin}>
                🔐 الدخول كمسؤول
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}