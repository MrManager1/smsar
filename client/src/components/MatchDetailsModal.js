/* eslint-disable no-unused-vars */
import React from 'react';

function MatchDetailsModal({ show, onClose, property, client }) {
  // Log view when opened - call hook unconditionally but guard inside
  React.useEffect(() => {
    if (show && property && client) {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'view_match',
          propertyId: property.id,
          clientId: client.id,
          matchPercentage: property.matchPercentage,
          ts: new Date().toISOString()
        })
      }).catch(() => {});
    }
  }, [show, property, client]);

  if (!property || !client) return null;

  const phoneForWhatsApp = (raw) => {
    if (!raw) return '';
    let filtered = raw.replace(/[^0-9+]/g, '');
    if (filtered.startsWith('+')) filtered = filtered.slice(1);
    if (filtered.startsWith('0')) filtered = '20' + filtered.slice(1); // assume Egypt numbers
    return filtered;
  };

  const contactOwner = () => {
    // log and open tel
    fetch('/api/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact_owner', propertyId: property.id, ts: new Date().toISOString() }) }).catch(()=>{});
    window.location.href = `tel:${property.ownerPhone}`;
  };

  const contactWhatsAppOwner = () => {
    fetch('/api/logs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'contact_owner_whatsapp', propertyId: property.id, ts: new Date().toISOString() }) }).catch(()=>{});
    const phone = phoneForWhatsApp(property.ownerPhone);
    const msg = `مرحبًا، أود الاستعلام عن العقار: ${property.location?.neighborhood || property.type}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getDefaultImage = (type) => {
    switch (type) {
      case 'شقة': return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'فيلا': return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'مكتب': return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'محل': return 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      default: return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80';
    }
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ background: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content zoom-in" style={{ borderRadius: 12 }}>
          <div className="modal-body p-0">
            <div className="d-flex flex-column flex-md-row">
              <div className="col-md-7 p-3 border-end">
                <div className="mb-2 d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">{property.location?.neighborhood || property.description}</h5>
                    <small className="text-muted">{property.type} · {property.status}</small>
                  </div>
                  <div>
                    <strong className="text-success">{property.price?.toLocaleString()} ج</strong>
                  </div>
                </div>

                {/* Carousel of images */}
                <div id="matchCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
                  <div className="carousel-indicators">
                    {(property.images && property.images.length > 0 ? property.images : [property.imageUrl || getDefaultImage(property.type)]).map((_, idx) => (
                      <button key={idx} type="button" data-bs-target="#matchCarousel" data-bs-slide-to={idx} className={idx === 0 ? 'active' : ''} aria-current={idx===0} aria-label={`Slide ${idx+1}`}></button>
                    ))}
                  </div>
                  <div className="carousel-inner">
                    {(property.images && property.images.length > 0 ? property.images : [property.imageUrl || getDefaultImage(property.type)]).map((img, idx) => (
                      <div key={idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
                        <img src={img} className="d-block w-100 rounded" alt={`صورة ${idx+1}`} style={{height: '300px', objectFit: 'cover'}} />
                      </div>
                    ))}
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#matchCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">السابق</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#matchCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">التالي</span>
                  </button>
                </div>

                <p>{property.description}</p>

                <div className="d-flex align-items-center mb-3">
                  <img src={property.ownerPhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt={`المالك ${property.ownerName}`} className="rounded-circle me-3" style={{width:72,height:72,objectFit:'cover'}} />
                  <div>
                    <div><strong>{property.ownerName} (المالك)</strong></div>
                    <div className="small text-muted">{property.ownerPhone}</div>
                  </div>
                </div>

                <ul className="list-inline small text-muted">
                  <li className="list-inline-item">📏 المساحة: {property.area} م²</li>
                  <li className="list-inline-item">| 🛏️ الغرف: {property.rooms}</li>
                  <li className="list-inline-item">| 🛁 الحمامات: {property.bathrooms}</li>
                  <li className="list-inline-item">| 🔖 الحالة: {property.status}</li>
                </ul>

                <div className="mt-3">
                  <button className="btn btn-outline-primary me-2" onClick={contactOwner}>
                    اتصال بالمالك
                  </button>
                  <button className="btn btn-success me-2" onClick={contactWhatsAppOwner}>
                    واتساب
                  </button>
                  <button className="btn btn-outline-secondary" onClick={() => { navigator.clipboard && navigator.clipboard.writeText(property.ownerPhone || ''); alert('تم نسخ الرقم'); }}>
                    نسخ الرقم
                  </button>
                </div>
              </div>

              <div className="col-md-5 p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">معلومات الطلب</h6>
                  <small className="text-muted">نسبة التطابق: {property.matchPercentage || '—'}%</small>
                </div>

                <div className="card shadow-sm mb-3">
                  <div className="card-body d-flex">
                    <img src={client.photo || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} alt={`صورة ${client.name}`} className="rounded-circle me-3" style={{width:64,height:64,objectFit:'cover'}} />
                    <div>
                      <h6 className="mb-1">{client.name}</h6>
                      <p className="mb-1 small text-muted">{client.notes}</p>
                      <ul className="list-unstyled small mt-2 mb-0">
                        <li>🔎 النوع: <strong>{client.desiredType}</strong></li>
                        <li>📍 تفضيل الموقع: <strong>{client.preferredLocation}</strong></li>
                        <li>💰 ميزانية: <strong>{client.budget?.toLocaleString()} ج</strong></li>
                        <li>📏 حد أدنى مساحة: <strong>{client.minArea} م²</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <a className="btn btn-primary" href={`tel:${client.contact}`}>اتصل بالعميل</a>
                  <a className="btn btn-success" href={`https://wa.me/${phoneForWhatsApp(client.contact)}`} target="_blank" rel="noreferrer">واتساب العميل</a>
                  <a className="btn btn-outline-primary" href={`mailto:${client.email}`}>ارسل ايميل للعميل</a>
                </div>

                <div className="mt-3 text-end">
                  <button className="btn btn-sm btn-link text-muted" onClick={onClose}>إغلاق</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetailsModal;
