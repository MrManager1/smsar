import React from 'react';

const MapView = ({ properties = [], focusId }) => {
  // Fallback if no properties
  if (!properties || properties.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded" style={{minHeight: '400px'}}>
        <div className="text-center text-muted">
          <div className="fs-1 mb-2">🗺️</div>
          <p>لا توجد عقارات لعرضها على الخريطة</p>
        </div>
      </div>
    );
  }

  const activeProperty = focusId ? properties.find(p => p.id === focusId) : properties[0];
  const targetProp = activeProperty || properties[0];
  
  let mapQuery;
  // Prioritize precise coordinates if available
  if (targetProp.location?.lat && targetProp.location?.lng) {
    mapQuery = `${targetProp.location.lat},${targetProp.location.lng}`;
  } else {
    // Fallback to address search
    mapQuery = targetProp.location?.formatted_address || 
               targetProp.location?.neighborhood || 
               targetProp.location?.city || 
               "Cairo, Egypt";
  }

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="w-100 h-100 position-relative rounded overflow-hidden shadow-sm" style={{minHeight: '400px', background: '#f8f9fa'}}>
      <iframe
        title="map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        style={{minHeight: '400px', border: 0}}
        allowFullScreen
      ></iframe>
      
      {/* Overlay Card for Property Info */}
      <div className="position-absolute bottom-0 start-0 m-3 p-2 bg-white rounded shadow-sm d-none d-md-block" style={{maxWidth: '300px', zIndex: 10}}>
        <div className="d-flex align-items-center">
           <img src={targetProp.images?.[0] || targetProp.imageUrl} alt="" className="rounded me-2" style={{width: 50, height: 50, objectFit: 'cover'}} />
           <div>
             <h6 className="mb-0 text-truncate" style={{maxWidth: '200px'}}>{targetProp.location?.neighborhood || 'عقار'}</h6>
             <small className="text-primary fw-bold">{targetProp.price?.toLocaleString()} ج</small>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;