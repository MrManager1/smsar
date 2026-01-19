import React, { useMemo } from 'react';

const PropertyCard = ({ prop, isFav, isComparing, isMini, isListView, onViewDetails, onShow360, toggleFavorite, toggleCompare, onScheduleVisit, handlePrint, shareProperty, copyDetails, onOpenCalculator, handleEditProperty, handleDeleteProperty, adminInfo, onPurchase }) => {
    // Investment Logic
    const ppm = prop.price && prop.area ? prop.price / prop.area : 0;
    
    // Define what a high price is to be considered "Featured"
    const FEATURED_THRESHOLD = 1000000;
    const isFeatured = prop.price > FEATURED_THRESHOLD;

    let statusBadge = null;
    if (prop.status === 'للبيع') {
        statusBadge = <span className="badge bg-success shadow-sm px-2 py-1">للبيع</span>;
    } else if (prop.status === 'للإيجار') {
        statusBadge = <span className="badge bg-warning text-dark shadow-sm px-2 py-1">للإيجار</span>;
    }

    const isSold = ['مباعة', 'تم البيع'].includes(prop.availability);

    // Smart Tags Logic (Randomized for uniqueness feel)
    const smartTag = useMemo(() => {
        if (isSold) return null;
        if (prop.price < 2000000) return { text: '🔥 لقطة', color: 'danger' };
        if (prop.area > 300) return { text: '💎 فخامة', color: 'info' };
        if (prop.location?.neighborhood === 'الشيخ زايد') return { text: '🌲 راقي', color: 'success' };
        if (Math.random() > 0.7) return { text: '👁️ مشاهدة عالية', color: 'warning' };
        return null;
    }, [prop]);

    // NEW LIST VIEW DESIGN
    if (isListView) {
        return (
            <div className={`card h-100 shadow-sm property-card-list d-flex flex-row ${isSold ? 'sold' : ''}`} onClick={() => !isSold && onViewDetails && onViewDetails(prop)}>
                <div className="col-4 position-relative">
                    <img src={(prop.images && prop.images[0]) || prop.imageUrl} className="card-img-top h-100" alt={prop.type} style={{ objectFit: 'cover', borderTopRightRadius: 0, borderBottomRightRadius: 0 }} />
                    <div className="position-absolute top-0 start-0 m-2">{statusBadge}</div>
                    {isSold && <div className="position-absolute top-50 start-50 translate-middle badge bg-danger fs-6">🚫 تم البيع</div>}
                </div>
                <div className="col-8 d-flex flex-column p-3">
                    <div className="d-flex justify-content-between">
                        <h5 className="card-title fw-bold text-dark">{prop.location?.neighborhood || prop.description?.substring(0, 30)}</h5>
                        <h5 className="text-primary fw-bold">{prop.price?.toLocaleString?.() ?? prop.price} ج</h5>
                    </div>
                    <p className="text-muted small mb-2">🏠 {prop.type} | {prop.location?.city}</p>
                    <p className="card-text small text-muted flex-grow-1">{prop.description?.substring(0, 100)}...</p>
                    <div className="d-flex justify-content-around text-center small border-top pt-2 mt-2">
                        <div>📏<br/>{prop.area} م²</div>
                        <div>🛏️<br/>{prop.rooms} غرف</div>
                        <div>🛁<br/>{prop.bathrooms} حمام</div>
                    </div>
                    <div className="mt-auto pt-3 d-flex justify-content-end gap-2">
                        <button type="button" className={`btn btn-sm shadow-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(prop.id); }} title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}>{isFav ? '❤️' : '🤍'}</button>
                        <button className="btn btn-sm btn-primary fw-bold shadow-sm" onClick={(e) => { e.stopPropagation(); onScheduleVisit && onScheduleVisit(prop); }} disabled={isSold} title="تحديد موعد معاينة">📅 حجز موعد</button>
                    </div>
                </div>
                 <style>{`
                    .property-card-list { cursor: pointer; transition: all 0.2s ease-in-out; }
                    .property-card-list:hover { transform: translateY(-5px); box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15)!important; }
                    .property-card-list.sold { opacity: 0.7; }
                    .property-card-list.sold .card-img-top { filter: grayscale(1); }
                `}</style>
            </div>
        );
    }


    // MINI CARD DESIGN (for similar properties)
    if (isMini) {
        let compactStatusBadge = null;
        if (prop.status === 'للبيع') {
            compactStatusBadge = <span className="badge bg-success shadow-sm px-1 small">للبيع</span>;
        } else if (prop.status === 'للإيجار') {
            compactStatusBadge = <span className="badge bg-warning text-dark shadow-sm px-1 small">للإيجار</span>;
        }

        return (
            <>
                <style>{`
                    .property-card-compact {
                        cursor: pointer;
                        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                        border-radius: 12px;
                        overflow: hidden;
                        background: #fff;
                    }
                    .property-card-compact:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 0.5rem 1rem rgba(0,0,0,.15)!important;
                    }
                    .property-card-compact .card-img-top {
                        height: 140px;
                        object-fit: cover;
                    }
                    .property-card-compact.sold {
                        opacity: 0.8;
                    }
                    .property-card-compact.sold .card-img-top {
                        filter: grayscale(90%);
                    }
                `}</style>
                <div 
                    className={`card h-100 shadow-sm property-card-compact ${isSold ? 'sold' : ''}`}
                    onClick={() => !isSold && onViewDetails && onViewDetails(prop)}
                >
                    <div className="position-relative">
                        <img src={(prop.images && prop.images[0]) || prop.imageUrl} className="card-img-top" alt={prop.type} />
                        
                        {!isSold && <div className="position-absolute top-0 start-0 m-1">{compactStatusBadge}</div>}

                        <div className="price-overlay position-absolute bottom-0 end-0 m-1">
                            <span className="badge bg-dark bg-opacity-75">{prop.price?.toLocaleString?.() ?? prop.price} ج</span>
                        </div>
                        
                        {isSold && (
                            <div className="position-absolute top-50 start-50 translate-middle" style={{zIndex: 5, transform: 'translate(-50%, -50%) rotate(-10deg)'}}>
                                <span className="badge bg-danger p-2 fs-6" style={{border: '2px solid white'}}>🚫 تم البيع</span>
                            </div>
                        )}
                        
                        <button type="button" className={`btn btn-sm position-absolute top-0 end-0 m-1 p-0 ${isFav ? 'text-danger' : 'text-white'}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(prop.id); }} title="المفضلة" style={{ width: 30, height: 30, background: 'rgba(0,0,0,0.4)', borderRadius: '50%', textShadow: '0 0 3px black' }}>❤️</button>
                    </div>
                    <div className="card-body p-2">
                        <h6 className="card-title fw-bold text-truncate mb-1 text-black">{prop.location?.neighborhood || prop.description}</h6>
                        <small className="text-black d-block">{prop.type}</small>
                    </div>
                    <div className="card-footer p-2 d-flex justify-content-between align-items-center small text-black bg-light border-0">
                        <span>📏 {prop.area} م²</span>
                        <span>🛏️ {prop.rooms} غرف</span>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className={`card h-100 shadow-sm property-card-premium ${isSold ? 'border-secondary bg-light' : ''}`} style={isSold ? { opacity: 0.85 } : {}} onClick={() => !isSold && onViewDetails && onViewDetails(prop)}>
            <div className="position-relative">
                <div className="position-absolute top-0 start-0 m-2 d-flex flex-column gap-1" style={{zIndex:2}}>
                    {statusBadge}
                    {isFeatured && !isSold && <span className="badge bg-info shadow-sm px-2 py-1">⭐ مميز</span>}
                    {prop.videoUrl && <span className="badge bg-danger shadow-sm px-2 py-1">🎥 فيديو</span>}
                </div>
                {isSold && (
                    <div className="position-absolute top-50 start-50 translate-middle badge bg-danger fs-5 shadow" style={{zIndex: 5, transform: 'translate(-50%, -50%) rotate(-15deg)', opacity: 0.95, border: '2px solid white'}}>
                        🚫 تم البيع
                    </div>
                )}
                <img src={(prop.images && prop.images[0]) || prop.imageUrl} className="card-img-top zoom-img" alt={prop.type} style={{cursor: 'pointer', height: '220px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', filter: isSold ? 'grayscale(100%)' : 'none'}} />
                <div className="position-absolute" style={{top:10,right:10}}>
                    <span className={`badge bg-white text-black fw-bold shadow`}>{prop.price?.toLocaleString?.() ?? prop.price} ج</span>
                </div>
                {smartTag && !isSold && <div className={`position-absolute bottom-0 start-0 m-2 badge bg-${smartTag.color} shadow-sm animate-pulse`}>{smartTag.text}</div>}
            </div>
            <div className={`card-body d-flex flex-column p-3`} style={{ background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)' }}>
                <h5 className={`card-title fw-bold text-black`} style={{minHeight: '3rem'}}>{prop.location?.neighborhood || prop.description?.substring(0, 30)}</h5>
                <p className="text-black small mb-1"> {prop.area} م² | 🛏️ {prop.rooms} غرف</p>
                <p className="text-black small mb-2 fw-bold">🏠 {prop.type} | {prop.status}</p>
                <ul className="list-group list-group-flush mt-auto" style={{background: 'transparent'}}>
                    <li className={`list-group-item px-0 py-1 small border-0`} style={{background: 'transparent'}}><small className="text-black">📍 {prop.location?.city}</small></li>
                </ul>
            </div>
            <div className={`card-footer d-flex justify-content-between align-items-center p-2`} style={{background: 'rgba(255,255,255,0.05)'}}>
                <small className={prop.availability === 'متاحة' ? 'text-success fw-bold' : (isSold ? 'text-danger fw-bold' : 'text-warning fw-bold')}>
                    {prop.availability === 'متاحة' && !isSold ? `✅ متاح للمعاينة` : (isSold ? '🚫 تم البيع' : '❌ غير متاح')}
                </small>
                <div className="d-flex align-items-center gap-1">
                    <button type="button" className={`btn btn-sm shadow-sm ${isFav ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => toggleFavorite(prop.id)} title={isFav ? "إزالة من المفضلة" : "إضافة للمفضلة"}>{isFav ? '❤️' : '🤍'}</button>
                    <button className="btn btn-sm btn-primary fw-bold shadow-sm" onClick={() => onScheduleVisit && onScheduleVisit(prop)} disabled={isSold} title="تحديد موعد معاينة">📅 حجز موعد</button>
                    
                    <div className="dropdown">
                        <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id={`dropdownMenuButton-${prop.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                            ⋮
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${prop.id}`}>
                            <li><button className="dropdown-item" onClick={() => toggleCompare(prop.id)}>⚖️ {isComparing ? 'إزالة من المقارنة' : 'إضافة للمقارنة'}</button></li>
                            {prop.threeSixtyUrl && <li><button className="dropdown-item" onClick={() => onShow360(prop.threeSixtyUrl)}>📄 معاينة PDF</button></li>}
                            <li><button className="dropdown-item" onClick={() => onOpenCalculator(prop.price)}>🧮 حاسبة التمويل</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={() => shareProperty(prop)}>📱 مشاركة واتساب</button></li>
                            <li><button className="dropdown-item" onClick={() => copyDetails(prop)}>📋 نسخ التفاصيل</button></li>
                            <li><button className="dropdown-item" onClick={() => handlePrint(prop)}>🖨️ طباعة الفاتورة</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            {adminInfo && (
                                <li><button className="dropdown-item text-info" data-bs-toggle="modal" data-bs-target="#newPropertyModal" onClick={() => { handleEditProperty(prop) }}>✏️ تعديل</button></li>
                            )}
                            {adminInfo && adminInfo.role === 'admin' && (
                                <li><button className="dropdown-item text-danger" onClick={() => handleDeleteProperty(prop.id, `${prop.location?.neighborhood || prop.type}`)}>🗑️ حذف</button></li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
            <style>{`
                .property-card-premium { transition: all 0.3s ease; border: none; overflow: hidden; }
                .property-card-premium:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important; }
                .zoom-img { transition: transform 0.5s ease; }
                .property-card-premium:hover .zoom-img { transform: scale(1.05); }
                .animate-pulse { animation: pulseTag 2s infinite; }
                @keyframes pulseTag { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
            `}</style>
        </div>
    );
};

export default PropertyCard;