import React from 'react';

const NeighborhoodAnalysis = ({ location }) => {
  // محاكاة تحليل الذكاء الاصطناعي بناءً على اسم المنطقة
  const getScore = (str) => {
      if (!str) return 75;
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return 60 + (Math.abs(hash) % 35); // Score between 60 and 95
  };
  
  const locName = location?.neighborhood || location?.city || 'المنطقة';
  
  const scores = {
    safety: getScore(locName + 'safety'),
    services: getScore(locName + 'services'),
    transport: getScore(locName + 'transport'),
    education: getScore(locName + 'education'),
    entertainment: getScore(locName + 'entertainment')
  };

  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);

  const getColor = (s) => s >= 85 ? 'success' : s >= 75 ? 'primary' : s >= 60 ? 'warning' : 'danger';

  return (
    <div className="card border-0 shadow-sm bg-light mb-4 fade-in">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
            <h5 className="fw-bold text-primary m-0">🤖 تحليل الذكاء الاصطناعي للمنطقة</h5>
            <span className="badge bg-primary ms-auto">AI Powered</span>
        </div>
        
        <div className="row align-items-center mb-4">
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <div className={`position-relative d-inline-flex align-items-center justify-content-center rounded-circle border border-4 border-${getColor(overall)}`} style={{width: 100, height: 100, background: 'white'}}>
               <div>
                 <div className="h3 fw-bold m-0">{overall}</div>
                 <small className="text-muted" style={{fontSize: '0.7rem'}}>/ 100</small>
               </div>
            </div>
            <div className="mt-2 fw-bold small">جودة الحياة</div>
          </div>
          <div className="col-md-8">
             <p className="text-muted small mb-0" style={{lineHeight: '1.6'}}>
               بناءً على تحليل البيانات، تتميز منطقة <strong>{locName}</strong> بمستوى {overall > 80 ? 'ممتاز' : 'جيد'} من حيث المعيشة. 
               {scores.safety > 80 ? ' تعتبر المنطقة آمنة جداً ومناسبة للعائلات.' : ''}
               {scores.transport > 80 ? ' تتمتع بشبكة مواصلات قوية وسهولة الوصول.' : ''}
               {scores.services > 80 ? ' الخدمات التجارية والطبية متوفرة بكثرة.' : ''}
             </p>
          </div>
        </div>

        <div className="row g-3">
           {[
             { label: 'الأمان والخصوصية', val: scores.safety, icon: '🛡️' },
             { label: 'الخدمات والمرافق', val: scores.services, icon: '🏥' },
             { label: 'المواصلات والطرق', val: scores.transport, icon: '🚌' },
             { label: 'التعليم والمدارس', val: scores.education, icon: '🎓' },
             { label: 'الترفيه والتسوق', val: scores.entertainment, icon: '🛍️' },
           ].map((item, idx) => (
             <div key={idx} className="col-12">
               <div className="d-flex align-items-center mb-1">
                 <span className="me-2">{item.icon}</span>
                 <span className="small fw-bold">{item.label}</span>
                 <span className={`ms-auto badge bg-${getColor(item.val)} rounded-pill`}>{item.val}%</span>
               </div>
               <div className="progress" style={{height: 6, backgroundColor: '#e9ecef'}}>
                 <div className={`progress-bar bg-${getColor(item.val)}`} style={{width: `${item.val}%`, transition: 'width 1s ease-in-out'}}></div>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodAnalysis;