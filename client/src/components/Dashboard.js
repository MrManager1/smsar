import React, { useState, useEffect } from 'react';
import FeaturedCarousel from './FeaturedCarousel';

const Dashboard = ({ onBrowse, onSearch, onCategorySelect = () => {}, onAddPropertyClick, onFeatureClick, properties = [], onViewDetails, adminInfo, onScheduleVisit, onViewArticle }) => {
  const [heroText, setHeroText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fullText = "استثمر في مستقبلك.. بيت أحلامك بانتظارك";
  const [aiInsights, setAiInsights] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  
  const handleBrowseClick = () => {
    const navBtn = document.querySelector('button[title="العقارات"]');
    if (navBtn) {
      navBtn.click();
    } else if (onBrowse) {
      onBrowse();
    }
  };

  const handleSearchClick = () => {
    if (onSearch && searchTerm.trim()) {
        onSearch(searchTerm);
    } else {
        handleBrowseClick();
    }
  };

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      if (i < fullText.length) {
        setHeroText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  useEffect(() => {
    // محاكاة توليد المقالات بواسطة الذكاء الاصطناعي
    const generateAIInsights = () => {
        setTimeout(() => {
            const insights = [
                { 
                    title: 'تحليل السوق العقاري 2026', 
                    date: 'اليوم', 
                    img: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=500&q=80', 
                    desc: 'رؤية شاملة مدعومة بالبيانات لمستقبل العقارات في مصر.',
                    fullText: 'مع التغيرات الاقتصادية العالمية والمحلية، يشهد السوق العقاري المصري نقطة تحول حاسمة. يتوقع الخبراء أن تستمر أسعار العقارات في المناطق الجديدة مثل العاصمة الإدارية والعلمين الجديدة في النمو، مدفوعة بالطلب المتزايد والبنية التحتية المتطورة.\n\nمن ناحية أخرى، قد تشهد المناطق القديمة استقراراً نسبياً في الأسعار. ننصح المستثمرين بالتركيز على العقارات التجارية والإدارية في المناطق الحيوية، حيث يظل العائد على الإيجار قوياً ومستداماً. أما بالنسبة للباحثين عن سكن، فإن عام 2026 قد يكون فرصة جيدة للشراء قبل موجة ارتفاعات جديدة متوقعة.'
                },
                { 
                    title: 'أفضل فرص الاستثمار', 
                    date: 'أمس', 
                    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80', 
                    desc: 'خوارزمياتنا ترشح لك المناطق الأعلى عائداً هذا الشهر.',
                    fullText: 'بناءً على تحليل بيانات أكثر من 10,000 عقار، ترشح خوارزميات الذكاء الاصطناعي في سمسار منطقة "الشيخ زايد" و "التجمع الخامس" كأفضل المناطق للاستثمار العقاري السكني هذا الشهر. تتميز هذه المناطق بطلب إيجاري مرتفع ونمو مستمر في قيمة الأصول.\n\nللاستثمار التجاري، تبرز منطقة "وسط البلد" و "المعادي" كخيارات واعدة بفضل الكثافة السكانية والحركة التجارية الدائمة. تواصل مع خبرائنا للحصول على استشارة مخصصة حول أفضل الفرص التي تناسب ميزانيتك وأهدافك الاستثمارية.'
                },
                { 
                    title: 'دليل المشتري الذكي', 
                    date: 'هذا الأسبوع', 
                    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80', 
                    desc: 'كيف تستخدم التكنولوجيا لاختيار منزلك المثالي بأفضل سعر.',
                    fullText: 'شراء منزل هو أحد أهم القرارات المالية في حياتك. لذا، من الضروري استخدام كل الأدوات المتاحة لاتخاذ القرار الصحيح. منصة سمسار توفر لك أدوات تحليلية متقدمة:\n\n1. **حاسبة التمويل العقاري:** لتقدير الأقساط الشهرية ومعرفة قدرتك الشرائية.\n2. **تحليل العائد الاستثماري (ROI):** إذا كنت تشتري بهدف الاستثمار، هذه الأداة ستوضح لك الأرباح المتوقعة.\n3. **خاصية المقارنة:** قارن بين عدة عقارات جنباً إلى جنب لاتخاذ قرار مبني على البيانات.\n4. **الجولات الافتراضية 360°:** وفر وقتك وجهدك واستكشف العقارات من منزلك.\n\nلا تتردد في استخدام هذه الأدوات والتواصل مع فريقنا لمساعدتك في كل خطوة.'
                }
            ];
            setAiInsights(insights);
            setLoadingInsights(false);
        }, 2000);
    };

    generateAIInsights();
  }, []);

  const handleRefreshInsights = () => {
    setLoadingInsights(true);
    setTimeout(() => {
      // Replace with actual logic to fetch new insights
      const newInsights = [...aiInsights].sort(() => Math.random() - 0.5); // Shuffle existing
      setAiInsights(newInsights);
      setLoadingInsights(false);
    }, 1500);
  };


  return (
    <div className="dashboard-container bg-light" style={{ position: 'relative', zIndex: 1 }}>
      {/* Hero Slider */}
      <div className="container-fluid p-0 position-relative">
        <div className="bg-dark text-white position-relative overflow-hidden hero-bg" style={{ minHeight: '600px' }}>
           <video autoPlay muted loop playsInline className="position-absolute w-100 h-100" style={{ objectFit: 'cover', zIndex: 0, opacity: 0.6 }}>
             <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-11-large.mp4" type="video/mp4" />
           </video>
           
           <div className="container position-relative h-100 d-flex align-items-center justify-content-center py-5 hero-content" style={{ minHeight: '600px', zIndex: 4 }}>
              <div className="text-center glass-card p-5 fade-in-up">
                  <span className="badge bg-warning text-dark mb-3 fs-6 px-3 py-2 rounded-pill shadow-sm">✨ مستقبل العقارات في مصر</span>
                  <h1 className="display-3 fw-bold mb-3 text-shadow" style={{ minHeight: '80px' }}>{heroText}<span className="cursor-blink">|</span></h1>
                  <p className="lead mb-4 text-white opacity-90">نجمع لك أرقى الفرص العقارية وأكثرها تميزاً في منصة واحدة ذكية.</p>
                  
                  {/* Smart Search Bar */}
                  <div className="input-group bg-white rounded-pill p-1 shadow-lg mb-4 mx-auto search-bar-anim" style={{maxWidth: '600px', transform: 'scale(1)'}}>
                      <span className="input-group-text border-0 bg-transparent ps-3 text-primary">🔍</span>
                      <input 
                        type="text" 
                        className="form-control border-0 shadow-none" 
                        placeholder="ابحث عن شقة، فيلا، أو منطقة..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()} 
                      />
                      <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={handleSearchClick}>بحث</button>
                  </div>

                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                      <button className="btn btn-primary btn-lg px-5 rounded-pill fw-bold shadow-lg hover-scale" onClick={handleBrowseClick}>تصفح العقارات 🏠</button>
                      {adminInfo && (
                        <button className="btn btn-light btn-lg px-5 rounded-pill fw-bold shadow-lg hover-scale" data-bs-toggle="modal" data-bs-target="#newPropertyModal" onClick={(e) => { e.stopPropagation(); onAddPropertyClick && onAddPropertyClick(); }}>أضف عقارك مجاناً</button>
                      )}
                  </div>
              </div>
              
              <div className="position-absolute bottom-0 mb-5 scroll-indicator">
                <div className="mouse"></div>
              </div>
           </div>
        </div>
        
        {/* Wave Separator */}
        <div className="position-absolute bottom-0 w-100" style={{ lineHeight: 0, zIndex: 3 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f8f9fa" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1252,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
        </div>
      </div>

      {/* Quick Actions Section (Replaces Stats) */}
      <div className="container mb-5 position-relative" style={{ marginTop: '-80px', zIndex: 4 }}>
        <div className="row g-4 justify-content-center">
            <div className="col-6 col-md-3">
                <div className="card border-0 shadow-lg text-center py-4 rounded-4 hover-lift glass-action cursor-pointer h-100" onClick={() => onCategorySelect && onCategorySelect('شقة')}>
                    <div className="fs-1 mb-2">🏢</div>
                    <h5 className="fw-bold text-primary mb-1">شقق سكنية</h5>
                    <small className="text-muted fw-bold">تصفح أحدث العروض</small>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="card border-0 shadow-lg text-center py-4 rounded-4 hover-lift glass-action cursor-pointer h-100" onClick={() => onCategorySelect && onCategorySelect('فيلا')}>
                    <div className="fs-1 mb-2">🏡</div>
                    <h5 className="fw-bold text-success mb-1">فيلات فاخرة</h5>
                    <small className="text-muted fw-bold">حياة الرفاهية</small>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="card border-0 shadow-lg text-center py-4 rounded-4 hover-lift glass-action cursor-pointer h-100" onClick={() => onCategorySelect && onCategorySelect('مكتب')}>
                    <div className="fs-1 mb-2">💼</div>
                    <h5 className="fw-bold text-warning mb-1">مقار إدارية</h5>
                    <small className="text-muted fw-bold">مساحات عمل متميزة</small>
                </div>
            </div>
            <div className="col-6 col-md-3">
                <div className="card border-0 shadow-lg text-center py-4 rounded-4 hover-lift glass-action cursor-pointer h-100" onClick={onAddPropertyClick}>
                    <div className="fs-1 mb-2">📢</div>
                    <h5 className="fw-bold text-danger mb-1">اعرض عقارك</h5>
                    <small className="text-muted fw-bold">بع عقارك بأسرع وقت</small>
                </div>
            </div>
        </div>
      </div>

      <FeaturedCarousel properties={properties} onViewDetails={onViewDetails} onPropertyClick={onViewDetails} />

      {/* How It Works Section */}
      <div className="container py-5 mb-5">
        <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase letter-spacing-2">خطوات بسيطة</h6>
            <h2 className="fw-bold display-6">كيف يعمل سمسار؟</h2>
            <div className="bg-primary mx-auto mt-3 rounded-pill" style={{ width: '80px', height: '4px' }}></div>
        </div>
        <div className="row g-4 position-relative">
            <div className="col-md-4">
                <div className="step-card text-center p-4 h-100 position-relative">
                    <div className="step-number">1</div>
                    <div className="icon-circle bg-primary bg-opacity-10 text-primary mb-4 mx-auto">🔍</div>
                    <h4 className="fw-bold">ابحث عن عقارك</h4>
                    <p className="text-muted">استخدم أدوات البحث المتقدمة والخرائط للعثور على العقار المناسب في منطقتك المفضلة.</p>
                </div>
                <div className="d-none d-md-block position-absolute top-50 start-0 translate-middle-y text-muted opacity-25" style={{left: '-15px', zIndex: 0}}>
                    <svg width="50" height="20"><path d="M0,10 Q25,0 50,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" /></svg>
                </div>
            </div>
            <div className="col-md-4">
                <div className="step-card text-center p-4 h-100 position-relative">
                    <div className="step-number">2</div>
                    <div className="icon-circle bg-success bg-opacity-10 text-success mb-4 mx-auto">📅</div>
                    <h4 className="fw-bold">احجز معاينة</h4>
                    <p className="text-muted">تواصل مباشرة مع المالك أو احجز موعداً للمعاينة عبر الإنترنت بضغطة زر.</p>
                </div>
                <div className="d-none d-md-block position-absolute top-50 start-0 translate-middle-y text-muted opacity-25" style={{left: '-15px', zIndex: 0}}>
                    <svg width="50" height="20"><path d="M0,10 Q25,20 50,10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" /></svg>
                </div>
            </div>
            <div className="col-md-4">
                <div className="step-card text-center p-4 h-100 position-relative">
                    <div className="step-number">3</div>
                    <div className="icon-circle bg-warning bg-opacity-10 text-warning mb-4 mx-auto">🔑</div>
                    <h4 className="fw-bold">استلم مفتاحك</h4>
                    <p className="text-muted">أكمل إجراءات التعاقد بأمان وموثوقية واستلم مفتاح منزلك الجديد.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Parallax Banner */}
      <div className="parallax-section py-5 text-white text-center d-flex align-items-center justify-content-center" style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          minHeight: '400px',
          position: 'relative'
      }}>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
          <div className="position-relative z-2">
              <h2 className="display-4 fw-bold mb-3">هل أنت مستعد لامتلاك منزلك؟</h2>
              <p className="lead mb-4">نحن هنا لمساعدتك في كل خطوة على الطريق.</p>
              <button className="btn btn-primary btn-lg rounded-pill px-5 shadow-lg hover-scale" onClick={handleBrowseClick}>تصفح العقارات الآن</button>
          </div>
      </div>

      {/* Features Section (Refined) */}
      <div className="bg-white py-5 border-top position-relative overflow-hidden">
        <div className="container position-relative z-1">
          <div className="row align-items-center mb-5">
              <div className="col-lg-6 mb-4 mb-lg-0">
                  <h2 className="fw-bold display-6 mb-3">لماذا تختار <span className="text-primary">سمسار</span>؟</h2>
                  <p className="lead text-muted">نقدم لك تجربة عقارية متكاملة تجمع بين التكنولوجيا والسهولة.</p>
                  <ul className="list-unstyled mt-4">
                      <li className="mb-3 d-flex align-items-center"><span className="badge bg-success rounded-circle p-2 me-3">✓</span> <span>جولات افتراضية 360° توفر وقتك وجهدك.</span></li>
                      <li className="mb-3 d-flex align-items-center"><span className="badge bg-success rounded-circle p-2 me-3">✓</span> <span>بيانات موثقة ومحدثة يومياً لضمان المصداقية.</span></li>
                      <li className="mb-3 d-flex align-items-center"><span className="badge bg-success rounded-circle p-2 me-3">✓</span> <span>تواصل مباشر مع الملاك بدون وسطاء مزعجين.</span></li>
                      <li className="d-flex align-items-center"><span className="badge bg-success rounded-circle p-2 me-3">✓</span> <span>أدوات تحليل أسعار ذكية لمساعدتك في القرار.</span></li>
                  </ul>
              </div>
              <div className="col-lg-6">
                  <div className="row g-3">
                    <div className="col-6">
                        <div className="feature-box bg-light p-4 rounded-4 mb-3 text-center cursor-pointer hover-border-primary" onClick={() => onFeatureClick && onFeatureClick('360')}>
                            <div className="display-4 mb-2">🔄</div>
                            <h6 className="fw-bold">جولات 360°</h6>
                        </div>
                        <div className="feature-box bg-light p-4 rounded-4 text-center cursor-pointer hover-border-primary" onClick={() => onFeatureClick && onFeatureClick('verified')}>
                            <div className="display-4 mb-2">🛡️</div>
                            <h6 className="fw-bold">عقارات موثقة</h6>
                        </div>
                    </div>
                    <div className="col-6 mt-4">
                        <div className="feature-box bg-light p-4 rounded-4 mb-3 text-center cursor-pointer hover-border-primary" onClick={() => onFeatureClick && onFeatureClick('contact')}>
                            <div className="display-4 mb-2">📞</div>
                            <h6 className="fw-bold">تواصل مباشر</h6>
                        </div>
                        <div className="feature-box bg-light p-4 rounded-4 text-center cursor-pointer hover-border-primary" onClick={() => onFeatureClick && onFeatureClick('map')}>
                            <div className="display-4 mb-2">📍</div>
                            <h6 className="fw-bold">خرائط دقيقة</h6>
                        </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        {/* Decorative Circle */}
        <div className="position-absolute top-0 end-0 translate-middle-y bg-primary opacity-5 rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(80px)' }}></div>
      </div>

      {/* Latest Insights */}
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h6 className="text-primary fw-bold text-uppercase letter-spacing-2">مدونة سمسار</h6>
                <h2 className="fw-bold display-6">أحدث المقالات</h2>
            </div>
            <button className="btn btn-outline-primary rounded-pill px-4" onClick={handleRefreshInsights} disabled={loadingInsights}>{loadingInsights ? '🔄 تحديث...' : '🔄 تحديث'}</button>
        </div>
        
        {loadingInsights ? (
            <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <p className="text-muted fade-in">🤖 جاري تحليل السوق وتوليد المقالات...</p>
            </div>
        ) : (
        <div className="row g-4">
            {aiInsights.map((post, i) => (
                <div key={i} className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm hover-lift overflow-hidden rounded-4 cursor-pointer" onClick={() => onViewArticle && onViewArticle(post)}>
                        <div className="position-relative overflow-hidden" style={{height: '200px'}}>
                            <img src={post.img} className="w-100 h-100 object-fit-cover zoom-img" alt={post.title} />
                            <div className="position-absolute top-0 start-0 m-3 badge bg-white text-dark shadow-sm">{post.date}</div>
                        </div>
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-2">{post.title}</h5>
                            <p className="text-muted small mb-3">{post.desc}</p>
                            <span className="text-primary fw-bold small stretched-link">اقرأ المزيد ←</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        )}
      </div>
      
      <style>{`
        .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 24px;
            max-width: 800px;
        }
        .glass-action {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            transition: all 0.3s ease;
        }
        .glass-action:hover {
            background: #fff;
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        .text-shadow { text-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        .hover-scale { transition: transform 0.3s; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-lift { transition: transform 0.3s, box-shadow 0.3s; }
        .hover-lift:hover { transform: translateY(-10px); box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important; }
        .zoom-effect { animation: zoom 20s infinite alternate; }
        @keyframes zoom { from { transform: scale(1); } to { transform: scale(1.1); } }
        .fade-in-up { animation: fadeInUp 1s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .search-bar-anim { animation: popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.5s forwards; opacity: 0; transform: scale(0.9); }
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }
        
        @media (max-width: 768px) {
          .hero-bg, .hero-content { min-height: 450px !important; }
          .display-3 { font-size: 2rem !important; }
          .glass-card { padding: 1.5rem !important; margin: 0 10px; }
          .lead { font-size: 1rem !important; }
          .btn-lg { padding: 0.5rem 1.5rem !important; font-size: 1rem !important; }
          .step-card { margin-bottom: 1rem; }
          .step-number { width: 30px; height: 30px; font-size: 1rem; top: -10px; right: -10px; }
          .icon-circle { width: 60px; height: 60px; font-size: 1.5rem; }
        }

        .icon-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
        .step-card { background: #fff; border-radius: 20px; border: 1px solid #eee; transition: all 0.3s; }
        .step-card:hover { border-color: var(--bs-primary); box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .step-number { position: absolute; top: -15px; right: -15px; width: 40px; height: 40px; background: var(--bs-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3); }
        
        .feature-box { transition: all 0.3s; border: 2px solid transparent; }
        .hover-border-primary:hover { border-color: var(--bs-primary); background: white !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        .cursor-pointer { cursor: pointer; }
        .letter-spacing-2 { letter-spacing: 2px; }
        .cursor-blink { animation: blink 1s infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        
        .scroll-indicator { animation: bounce 2s infinite; opacity: 0.7; }
        .mouse { width: 30px; height: 50px; border: 2px solid white; border-radius: 20px; position: relative; }
        .mouse::before { content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: white; border-radius: 50%; animation: scrollMouse 2s infinite; }
        @keyframes scrollMouse { 0% { top: 10px; opacity: 1; } 100% { top: 30px; opacity: 0; } }
        
        .grayscale-hover { transition: all 0.3s; }
        .grayscale-hover:hover { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default Dashboard;