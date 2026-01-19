import React, { useState, useMemo, useEffect } from 'react';
import NeighborhoodAnalysis from './NeighborhoodAnalysis';
import PropertyCard from './PropertyCard';
import MapView from './MapView';

export default function PropertyDetailsModal({ show, onClose, property, allProperties = [], onScheduleVisit, onOpenCalculator, onOpenROICalculator, onViewDetails }) {
  const [activeTab, setActiveTab] = useState('photos'); // photos, map, history
  const [lightboxImage, setLightboxImage] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [readerMode, setReaderMode] = useState(false);
  const [readerDarkMode, setReaderDarkMode] = useState(false);

  useEffect(() => {
    // Reset to the first tab when a new property is viewed
    if (show) {
      setActiveTab('photos');
      setLoadedImages({});
      setReaderMode(false);
      setReaderDarkMode(false);
    }
  }, [show, property?.id]);
  
  // Smart Recommendations Logic: Find properties with same type or location
  const similarProperties = useMemo(() => {
    if (!property) return [];
    return allProperties
      .filter(p => p.id !== property.id)
      .map(p => {
        let score = 0;
        if (p.type === property.type) score += 3;
        if (p.status === property.status) score += 2;
        if (p.location?.city === property.location?.city) score += 1;
        if (p.location?.neighborhood === property.location?.neighborhood) score += 3;
        if (p.price && property.price && Math.abs(p.price - property.price) / property.price < 0.25) score += 2;
        return { ...p, score };
      })
      .filter(p => p.score >= 4) // Show only relevant matches
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [property, allProperties]);

  if (!property) return null;

  // Property DNA (Randomized for demo)
  const dnaTraits = [
    { name: 'استثمار', val: 70, color: '#ff6b6b' },
    { name: 'سكن', val: 85, color: '#4ecdc4' },
    { name: 'تجاري', val: 60, color: '#ffe66d' },
  ];

  // Mock Price History Data
  const priceHistory = [
    { year: '2020', price: property.price * 0.8 },
    { year: '2021', price: property.price * 0.85 },
    { year: '2022', price: property.price * 0.95 },
    { year: '2023', price: property.price },
  ];

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `شاهد هذا العقار المميز: ${property.type} في ${property.location?.neighborhood} بسعر ${property.price?.toLocaleString()} جنيه`;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(text + '\n' + url);
      alert('تم نسخ الرابط بنجاح! 📋');
      return;
    }

    let shareUrl = '';
    if (platform === 'whatsapp') shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    else if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    else if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    if (shareUrl) window.open(shareUrl, '_blank');
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg overflow-hidden zoom-in">
          <div className="modal-header border-0 bg-primary text-white">
            <h5 className="modal-title">✨ تفاصيل العقار</h5>
            <div className="ms-auto d-flex align-items-center gap-2">
                {readerMode && (
                    <button className="btn btn-sm btn-link text-white text-decoration-none" onClick={() => setReaderDarkMode(!readerDarkMode)} title="الوضع الليلي للقراءة">{readerDarkMode ? '☀️' : '🌙'}</button>
                )}
                <button className={`btn btn-sm ${readerMode ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => setReaderMode(!readerMode)} title="وضع القراءة">📖 {readerMode ? 'إيقاف' : 'قراءة'}</button>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
          </div>
          <div className="modal-body p-0">
            {/* Hero Image */}
            <div style={{ height: readerMode ? '300px' : '450px', position: 'relative', background: '#000', transition: 'height 0.3s' }}>
              {activeTab === 'photos' && (
                <>
                {/* Desktop Grid Layout (Modern Look) */}
                <div className="d-none d-lg-flex h-100 w-100">
                    <div className="flex-grow-1 h-100 position-relative overflow-hidden" style={{cursor: 'zoom-in'}} onClick={() => setLightboxImage(property.images?.[0] || property.imageUrl)}>
                        <img src={property.images?.[0] || property.imageUrl} className="w-100 h-100 object-fit-cover hover-zoom" alt="Main" style={{transition: 'transform 0.5s'}} />
                    </div>
                    {(property.images && property.images.length > 1) && (
                        <div className="d-flex flex-column h-100" style={{width: '35%', borderRight: '2px solid white'}}>
                            <div className="h-50 position-relative overflow-hidden border-bottom border-2 border-white" style={{cursor: 'zoom-in'}} onClick={() => setLightboxImage(property.images[1])}>
                                <img src={property.images[1]} className="w-100 h-100 object-fit-cover hover-zoom" alt="Sub 1" style={{transition: 'transform 0.5s'}} />
                            </div>
                            <div className="h-50 position-relative overflow-hidden" style={{cursor: 'zoom-in'}} onClick={() => setLightboxImage(property.images[2] || property.images[0])}>
                                <img src={property.images[2] || property.images[0]} className="w-100 h-100 object-fit-cover hover-zoom" alt="Sub 2" style={{transition: 'transform 0.5s'}} />
                                {property.images.length > 3 && (
                                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center text-white fw-bold fs-4" style={{backdropFilter: 'blur(2px)'}}>
                                        +{property.images.length - 3} صور
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile Carousel (Classic Look) */}
                <div id="propertyImagesCarousel" className="carousel slide h-100 d-lg-none" data-bs-ride="carousel" data-bs-interval="false">
                  <div className="carousel-inner h-100">
                    {(property.images && property.images.length > 0 ? property.images : [property.imageUrl]).map((img, idx) => (
                      <div key={idx} className={`carousel-item h-100 ${idx === 0 ? 'active' : ''}`}>
                        {!loadedImages[idx] && (
                          <div className="d-flex align-items-center justify-content-center h-100 bg-light">
                            <div className="spinner-border text-muted spinner-border-sm" role="status"></div>
                          </div>
                        )}
                        <img src={img} className="d-block w-100 h-100" alt={`${property.type} ${idx + 1}`} style={{ objectFit: 'cover', cursor: 'zoom-in', opacity: loadedImages[idx] ? 1 : 0, transition: 'opacity 0.3s' }} onClick={() => setLightboxImage(img)} onLoad={() => setLoadedImages(prev => ({...prev, [idx]: true}))} loading={idx === 0 ? "eager" : "lazy"} />
                      </div>
                    ))}
                  </div>
                  {(property.images && property.images.length > 1) && (
                    <>
                      <button className="carousel-control-prev" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="prev"><span className="carousel-control-prev-icon"></span></button>
                      <button className="carousel-control-next" type="button" data-bs-target="#propertyImagesCarousel" data-bs-slide="next"><span className="carousel-control-next-icon"></span></button>
                    </>
                  )}
                </div>

                {/* Shared Overlay Info */}
                <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }}>
                    <h2 className="text-white mb-0 fw-bold" style={{textShadow: '0 2px 4px rgba(0,0,0,0.7)'}}>{property.location?.neighborhood}</h2>
                    <p className="text-white-50 mb-0 fs-5">{property.type} | {property.status}</p>
                </div>
                </>
              )}
              
              {activeTab === 'map' && (
                <div style={{height: '100%'}}>
                   <MapView properties={[property]} focusId={property.id} />
                </div>
              )}

              {activeTab === 'history' && (
                <div className="d-flex align-items-center justify-content-center h-100 bg-white">
                   <div className="text-center w-75">
                      <h4 className="mb-4 text-primary">📈 تطور سعر العقار</h4>
                      <div className="d-flex align-items-end justify-content-between" style={{height: '200px'}}>
                        {priceHistory.map((item, i) => (
                          <div key={i} className="text-center flex-grow-1 mx-1">
                             <div className="bg-primary bg-opacity-25 rounded-top mx-auto" style={{width: '60%', height: `${(item.price / property.price) * 100}%`, position: 'relative'}}>
                                <span className="position-absolute top-0 start-50 translate-middle-x mt-2 small fw-bold">{item.price.toLocaleString()}</span>
                             </div>
                             <div className="border-top border-2 border-primary mt-1"></div>
                             <small className="text-muted">{item.year}</small>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              )}

              {/* Tabs Controller */}
              <div className="position-absolute top-0 start-0 m-3 btn-group shadow bg-white rounded-pill overflow-hidden">
                 <button className={`btn btn-sm ${activeTab === 'photos' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('photos')}>🖼️ الصور</button>
                 <button className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('map')}>📍 الخريطة</button>
                 <button className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('history')}>📊 الأسعار</button>
              </div>

              {/* Thumbnails for Photos Tab */}
              {activeTab === 'photos' && property.images && property.images.length > 1 && window.innerWidth < 992 && (
                <div className="position-absolute bottom-0 w-100 p-2" style={{ zIndex: 5, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}>
                  <div className="d-flex justify-content-center overflow-auto hide-scrollbar" style={{gap: '0.5rem'}}>
                    {property.images.map((img, idx) => (
                      <img 
                        key={idx}
                        src={img}
                        alt={`Thumb ${idx}`}
                        className="rounded"
                        style={{ height: '50px', width: '70px', objectFit: 'cover', cursor: 'pointer', border: '2px solid transparent', transition: 'border-color 0.2s' }}
                        data-bs-target="#propertyImagesCarousel"
                        data-bs-slide-to={idx}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'white'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="row g-0">
              <div className={`col-lg-${readerMode ? '10 mx-auto' : '8'} p-4 transition-all`} style={readerMode ? {fontSize: '1.1rem', lineHeight: '1.8', backgroundColor: readerDarkMode ? '#212529' : '#fdfbf7', color: readerDarkMode ? '#e9ecef' : '#212529', borderRadius: '0 0 15px 15px'} : {}}>
                <h4 className={`mb-3 fw-bold ${readerMode && readerDarkMode ? 'text-info' : 'text-primary'}`}>عن العقار</h4>
                <p className={`lead ${readerMode ? '' : 'text-muted'}`} style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
                
                {property.videoUrl && (
                  <div className="my-4">
                    <h5 className="mb-3">🎬 فيديو للعقار</h5>
                    <div className="ratio ratio-16x9 rounded shadow-sm overflow-hidden">
                      <video src={property.videoUrl} controls preload="metadata" style={{width: '100%', height: '100%'}}></video>
                    </div>
                    <div className="text-center mt-2"><small className="text-muted"><a href={property.videoUrl} target="_blank" rel="noreferrer" download className="text-decoration-none">📥 تحميل الفيديو</a> (إذا لم يعمل المشغل)</small></div>
                  </div>
                )}

                
                <div className="row text-center my-4">
                  <div className="col-3">
                    <div className="p-3 border rounded bg-light">
                      <div className="fs-2">📏</div>
                      <small>{property.area} م²</small>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded bg-light">
                      <div className="fs-2">🛏️</div>
                      <small>{property.rooms} غرف</small>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded bg-light">
                      <div className="fs-2">🛁</div>
                      <small>{property.bathrooms} حمام</small>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="p-3 border rounded bg-light">
                      <div className="fs-2">💰</div>
                      <small>{property.price?.toLocaleString()} ج</small>
                    </div>
                  </div>
                </div>

                {/* AI Neighborhood Analysis */}
                <NeighborhoodAnalysis location={property.location} />

                <div className="mt-4 p-3 bg-white rounded border border-dashed">
                    <h6 className="fw-bold text-primary mb-3">🧬 تحليل العقار (Property DNA)</h6>
                    <div className="d-flex align-items-end justify-content-around" style={{height: '100px'}}>
                        {dnaTraits.map((t, i) => (
                            <div key={i} className="text-center w-100">
                                <div className="mx-auto rounded-top" style={{width: '30px', height: `${t.val}%`, backgroundColor: t.color, transition: 'height 1s'}}></div>
                                <div className="border-top border-2 w-100 mt-1"></div>
                                <small className="d-block mt-1 fw-bold" style={{fontSize: '0.7rem'}}>{t.name}</small>
                                <small className="text-muted" style={{fontSize: '0.65rem'}}>{t.val}%</small>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Similar Properties Section */}
                {similarProperties.length > 0 && (
                  <div className="mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold m-0">✨ عقارات مشابهة قد تعجبك</h5>
                        <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => document.getElementById('similar-scroll').scrollBy({left: 200, behavior: 'smooth'})} title="التالي">←</button>
                            <button className="btn btn-sm btn-outline-secondary rounded-circle" onClick={() => document.getElementById('similar-scroll').scrollBy({left: -200, behavior: 'smooth'})} title="السابق">→</button>
                        </div>
                    </div>
                    
                    <div id="similar-scroll" className="d-flex overflow-auto pb-3 hide-scrollbar" style={{ gap: '1rem', scrollBehavior: 'smooth' }}>
                      {similarProperties.map(sim => (
                        <div key={sim.id} style={{ minWidth: '240px', width: '240px' }} onClick={() => { onClose(); setTimeout(() => onViewDetails(sim), 100); }}>
                          <PropertyCard 
                            prop={sim}
                            isMini={true}
                            onViewDetails={() => { onClose(); setTimeout(() => onViewDetails(sim), 100); }}
                            toggleFavorite={() => {}} // Dummy functions
                            toggleCompare={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                    <style>{`
                        .hide-scrollbar::-webkit-scrollbar { height: 6px; }
                        .hide-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
                        .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
                        .hover-zoom:hover { transform: scale(1.05); }
                    `}</style>
                  </div>
                )}
              </div>

              <div className={`col-lg-4 bg-light p-4 border-start ${readerMode ? 'd-none' : ''}`}>
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body text-center">
                    <img src={property.ownerPhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} className="rounded-circle mb-3 shadow-sm" style={{width: 80, height: 80, objectFit: 'cover'}} alt="Owner" />
                    <h5>{property.ownerName}</h5>
                    <p className="text-muted small">المالك / الوكيل</p>
                    <div className="d-grid gap-2">
                      <a href={`tel:${property.ownerPhone}`} className="btn btn-outline-primary">📞 اتصال</a>
                      <a href={`https://wa.me/${property.ownerPhone}`} target="_blank" rel="noreferrer" className="btn btn-success">📱 واتساب</a>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body text-center">
                    <h6 className="fw-bold mb-3">مسح الكود (QR)</h6>
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`} alt="QR Code" className="img-fluid mb-2" style={{maxWidth: '120px'}} />
                    <p className="text-muted small mb-0">امسح الكود لفتح العقار على هاتفك</p>
                    <div className="d-grid mt-3">
                        <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}>🖨️ طباعة البروشور</button>
                    </div>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body text-center">
                    <h6 className="fw-bold mb-3">مشاركة العقار</h6>
                    <div className="d-flex justify-content-center gap-2">
                      <button className="btn btn-outline-success rounded-circle" style={{width:40,height:40,padding:0}} onClick={() => handleShare('whatsapp')} title="واتساب">📱</button>
                      <button className="btn btn-outline-primary rounded-circle" style={{width:40,height:40,padding:0}} onClick={() => handleShare('facebook')} title="فيسبوك">📘</button>
                      <button className="btn btn-outline-info rounded-circle" style={{width:40,height:40,padding:0}} onClick={() => handleShare('twitter')} title="تويتر">🐦</button>
                      <button className="btn btn-outline-secondary rounded-circle" style={{width:40,height:40,padding:0}} onClick={() => handleShare('copy')} title="نسخ الرابط">🔗</button>
                    </div>
                  </div>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary btn-lg mb-2 shadow-sm" onClick={() => { onClose(); onScheduleVisit(property); }}>📅 تحديد موعد معاينة</button>
                  <button className="btn btn-outline-dark mb-2 shadow-sm" onClick={() => alert('جاري فتح تجربة الواقع المعزز (AR)...')}>👓 معاينة AR (تجريبي)</button>
                  <button className="btn btn-success mb-2 shadow-sm" onClick={() => onOpenCalculator && onOpenCalculator(property.price)}>🧮 حاسبة التمويل العقاري</button>
                  <button className="btn btn-info mb-2 shadow-sm text-white" onClick={() => onOpenROICalculator && onOpenROICalculator(property.price)}>📈 حاسبة العائد (ROI)</button>
                  <button className="btn btn-outline-secondary" onClick={onClose}>إغلاق</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxImage && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in" style={{ zIndex: 2000, background: 'rgba(0,0,0,0.9)' }} onClick={() => setLightboxImage(null)}>
            <button className="btn btn-close btn-close-white position-absolute top-0 end-0 m-4 fs-4" onClick={() => setLightboxImage(null)}></button>
            <img src={lightboxImage} className="img-fluid shadow-lg" style={{ maxHeight: '90vh', maxWidth: '90vw', borderRadius: '8px' }} alt="Full View" />
        </div>
      )}
      <style>{`.transition-all { transition: all 0.3s ease; }`}</style>
    </div>
  );
}