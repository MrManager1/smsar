import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (isLocal ? `http://${window.location.hostname}:5000` : null);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const messagesRef = useRef(null);
  const conversationIdRef = useRef(null);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  const playNotificationSound = () => {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    if (!SOCKET_URL) return; // لا تقم بالاتصال إذا لم يكن هناك رابط سيرفر محدد في البيئة الحية

    const s = io(SOCKET_URL, { autoConnect: true });
    socketRef.current = s;

    s.on('connect', () => {
      // console.log('chat socket connected', s.id);
    });

    s.on('new_message', (msg) => {
      if (conversationIdRef.current && msg.conversationId === conversationIdRef.current) {
        setMessages(prev => [...prev, msg]);
        playNotificationSound();
      }
    });

    s.on('message_created', (msg) => {
      if (conversationIdRef.current && msg.conversationId === conversationIdRef.current) {
        setMessages(prev => [...prev, msg]);
      }
    });

    s.on('conversation_created', (conv) => {
      // nothing for now
    });

    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (conversationId && socketRef.current) {
      socketRef.current.emit('join_conversation', conversationId);
      fetch(`/api/conversations/${conversationId}/messages`)
        .then(r => {
          if (r.ok && r.headers.get('content-type')?.includes('application/json')) return r.json();
          throw new Error('Server error');
        })
        .then(setMessages)
        .catch(() => setMessages([]));
    }
  }, [conversationId]);

  useEffect(() => { if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight; }, [messages]);

  const startConversation = () => {
    const guestName = name.trim() || 'زائر';
    const payload = { guestName, guestContact: contact };
    
    const handleSuccess = (conv) => {
        setConversationId(conv.id);
        if (socketRef.current) socketRef.current.emit('join_conversation', conv.id);
        setOpen(true);
    };

    const performFetch = () => {
      fetch('/api/conversations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(r => {
             if (r.ok && r.headers.get('content-type')?.includes('application/json')) return r.json();
             throw new Error('Server error');
          })
          .then(handleSuccess)
          .catch(() => {
            // Fallback for demo mode
            const mockConv = { id: Date.now() };
            setConversationId(mockConv.id);
            setOpen(true);
          });
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('create_conversation', payload, (res) => {
        if (res && res.ok && res.conversation) {
          handleSuccess(res.conversation);
        } else {
          performFetch();
        }
      });
    } else {
      performFetch();
    }
  };

  const sendMessage = () => {
    if (!text || !conversationId) return;
    
    // التحقق مما إذا كانت هذه أول رسالة للزائر
    const isFirstMessage = messages.filter(m => m.sender === 'visitor').length === 0;

    const payload = { conversationId, sender: 'visitor', senderName: name, text };
    
    const triggerAutoReply = () => {
      if (isFirstMessage) {
        setTimeout(() => {
          let replyText = 'أهلاً بك! تم استلام رسالتك، وسنقوم بالرد عليك في أقرب وقت ممكن.';
          
          // تحليل ذكي بسيط للنص (Keyword Analysis)
          const lowerText = text.toLowerCase();
          if (lowerText.includes('سعر') || lowerText.includes('بكام') || lowerText.includes('تكلفة')) {
            replyText = 'بخصوص الأسعار، يمكنك استخدام حاسبة التمويل العقاري المتاحة في صفحة التفاصيل، أو تصفح العقارات حسب ميزانيتك.';
          } else if (lowerText.includes('معاينة') || lowerText.includes('موعد') || lowerText.includes('أشوف')) {
            replyText = 'يمكنك حجز موعد معاينة مباشرة من صفحة العقار بالضغط على زر "حجز موعد".';
          } else if (lowerText.includes('مكان') || lowerText.includes('موقع') || lowerText.includes('فين')) {
            replyText = 'نغطي معظم مناطق القاهرة والجيزة والساحل. يمكنك استخدام الخريطة في الموقع لتحديد العقارات القريبة منك.';
          } else if (lowerText.includes('بيع') || lowerText.includes('أعرض')) {
            replyText = 'يسعدنا مساعدتك في بيع عقارك! اضغط على زر "أضف عقارك مجاناً" في الصفحة الرئيسية.';
          }

          const autoReply = {
            id: Date.now() + 999,
            conversationId,
            sender: 'support',
            senderName: 'المساعد الذكي 🤖',
            text: replyText,
            ts: new Date().toISOString()
          };
          setMessages(prev => [...prev, autoReply]);
          playNotificationSound();
        }, 1000);
      }
    };

    const performSend = () => {
      fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(r => {
             if (r.ok && r.headers.get('content-type')?.includes('json')) return r.json();
             throw new Error('فشل الإرسال');
          })
          .then(m => { 
            setMessages(prev => [...prev, m]); 
            setText(''); 
            playNotificationSound(); 
            triggerAutoReply();
          })
          .catch(() => {
             // Fallback for demo mode
             const mockMsg = { ...payload, ts: new Date().toISOString() };
             setMessages(prev => [...prev, mockMsg]);
             setText('');
             playNotificationSound();

             // ربط الدردشة برسائل الأدمن (محاكاة)
             const savedChats = localStorage.getItem('adminChats');
             const currentAdminChats = savedChats ? JSON.parse(savedChats) : [];
             const newAdminMsg = {
                 id: Date.now(),
                 senderName: name || 'زائر',
                 senderContact: contact || 'غير متوفر',
                 message: text,
                 timestamp: new Date().toISOString()
             };
             localStorage.setItem('adminChats', JSON.stringify([newAdminMsg, ...currentAdminChats]));
             window.dispatchEvent(new Event('adminChatsUpdated'));
             
             triggerAutoReply();
          });
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', payload, (res) => {
        if (res && res.ok && res.message) {
          setMessages(prev => [...prev, res.message]);
          setText('');
          playNotificationSound();
          triggerAutoReply();
        } else {
          performSend();
        }
      });
    } else {
      performSend();
    }
  };

  return (
    <div className="floating-widget widget-chat" style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1050 }}>
      {!open ? (
        <button 
          className="btn btn-primary rounded-circle shadow" 
          onClick={() => setOpen(true)} 
          style={{ width: 60, height: 60, fontSize: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          💬
        </button>
      ) : (
        <div style={{ width: 320 }} className="card shadow">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <strong>{conversationId ? 'دردشة الدعم' : 'تحدث معنا'}</strong>
            <button type="button" className="btn-close btn-close-white" onClick={() => setOpen(false)}></button>
          </div>
          
          {!conversationId ? (
            <div className="card-body">
              <p className="small text-muted mb-3">مرحباً بك! أدخل بياناتك لبدء المحادثة معنا.</p>
              <div className="mb-2">
                <input className="form-control form-control-sm" placeholder="الاسم (اختياري)" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="mb-3">
                <input className="form-control form-control-sm" placeholder="رقم الهاتف (اختياري)" value={contact} onChange={e => setContact(e.target.value)} />
              </div>
              <div className="d-grid">
                <button className="btn btn-success btn-sm" onClick={startConversation}>بدء المحادثة</button>
              </div>
            </div>
          ) : (
            <>
              <div ref={messagesRef} style={{ height: 300, overflowY: 'auto', padding: 10, background: '#f8f9fa' }}>
                {messages.map((m, i) => (
                  <div key={i} className={`d-flex flex-column mb-2 ${m.sender === 'visitor' ? 'align-items-end' : 'align-items-start'}`}>
                    <div className={`p-2 rounded ${m.sender === 'visitor' ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: '85%', fontSize: '0.9rem' }}>
                      {m.text}
                    </div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      {new Date(m.ts || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </small>
                  </div>
                ))}
                {messages.length === 0 && <div className="text-center text-muted small mt-4">لا توجد رسائل بعد</div>}
              </div>
              <div className="card-footer p-2">
                <div className="input-group">
                  <input 
                    className="form-control" 
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && sendMessage()} 
                    placeholder="أكتب رسالة..." 
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>➤</button>
                </div>
                <div className="text-center mt-1">
                   <button className="btn btn-link btn-sm text-danger text-decoration-none" style={{ fontSize: '0.8rem' }} onClick={() => { setConversationId(null); localStorage.removeItem('conversationId'); setMessages([]); }}>إنهاء المحادثة</button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
