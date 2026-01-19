import React, { useState, useEffect } from 'react';

const FeaturedCarousel = ({ properties = [], onViewDetails, onPropertyClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // تصفية العقارات المميزة (مثلاً السعر أعلى من 2 مليون أو لها حالة خاصة)
  const featured = properties.filter(p => p.price > 2000000 || p.featured).slice(0, 5);
  
  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % featured.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);

  // تشغيل تلقائي
  useEffect(() => {
    if (featured.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [featured.length]);

  // إذا لم توجد عقارات مميزة، لا نعرض القسم
  if (featured.length === 0) return null;

  const activeProp = featured[activeIndex];

  if (!activeProp) return null;

  return (
    <div className="featured-carousel-container my-5 position-relative overflow-hidden py-4 bg-light bg-opacity-50">
       <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                  <h6 className="text-warning fw-bold text-uppercase letter-spacing-2">نخبة العقارات</h6>
                  <h2 className="fw-bold display-6">⭐ عقارات مميزة</h2>
              </div>
              <div className="d-flex gap-2">
                  <button className="btn btn-outline-dark rounded-circle shadow-sm" onClick={prevSlide} style={{width: 40, height: 40}}>←</button>
                  <button className="btn btn-outline-dark rounded-circle shadow-sm" onClick={nextSlide} style={{width: 40, height: 40}}>→</button>
              </div>
          </div>
          
          <div className="row">
             <div className="col-12">
                <div 
                    className="featured-image-container rounded-4 shadow-lg overflow-hidden position-relative carousel-height" 
                    style={{height: '500px', cursor: 'pointer'}}
                    onClick={() => onPropertyClick && onPropertyClick(activeProp)}
                >
                   <img 
                     src={activeProp.imageUrl || (activeProp.images && activeProp.images[0])} 
                     alt={activeProp.type} 
                     className="w-100 h-100 object-fit-cover transition-img"
                     key={activeProp.id} // مفتاح لتفعيل الأنيميشن عند التغيير
                   />
                   <div className="position-absolute top-0 start-0 m-4 badge bg-warning text-dark shadow px-3 py-2 fs-6">💎 فرصة استثمارية</div>
                   <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'}}>
                        <div className="d-flex justify-content-between align-items-end">
                            <div>
                                <h2 className="fw-bold text-white mb-1">{activeProp.location?.neighborhood}</h2>
                                <p className="text-white-50 mb-0">{activeProp.type} | {activeProp.area} م²</p>
                            </div>
                            <div className="text-end">
                                <h3 className="text-warning fw-bold mb-0">{activeProp.price?.toLocaleString()} ج</h3>
                            </div>
                        </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
       <style>{`
         .transition-img { animation: zoomFade 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
         @keyframes zoomFade { from { opacity: 0.8; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }
         
         .fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
         @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

         @media (max-width: 768px) {
            .carousel-height { height: 300px !important; }
         }
       `}</style>
    </div>
  );
};

export default FeaturedCarousel;