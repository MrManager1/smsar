import React, { useState, useEffect } from 'react';
import MatchDetailsModal from './MatchDetailsModal';

function MatchingView({ clients = [], properties = [] }) {
  const [selectedClientId, setSelectedClientId] = useState(clients?.[0]?.id || '');
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const calculateMatch = (client, property) => {
    if (!client || !property || property.availability !== 'متاحة') return 0;

    let score = 0;
    // Subject Match (40%)
    if (property.type === client.desiredType) {
      score += 40;
    }
    // Location Match (25%)
    if (property.location?.neighborhood && client.preferredLocation && property.location.neighborhood.includes(client.preferredLocation)) {
      score += 25;
    }
    // Budget (20%)
    if (property.price <= client.budget) {
      score += 20;
    }
    // Area & Rooms (15%)
    if (property.status === client.desiredStatus) {
      score += 15;
    }

    return score;
  };

  useEffect(() => {
    if (!selectedClientId) {
      setMatches([]);
      return;
    }
    const currentClient = clients.find(c => String(c.id) === String(selectedClientId));
    const calculatedMatches = properties
      .map(prop => ({
        ...prop,
        matchPercentage: calculateMatch(currentClient, prop),
      }))
      .filter(prop => prop.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    setMatches(calculatedMatches);
  }, [selectedClientId, clients, properties]);

  const exportCSV = () => {
    if (!matches || matches.length === 0) return;
    const headers = ['id','type','status','city','neighborhood','price','area','rooms','matchPercentage','description'];
    const rows = matches.map(m => [m.id,m.type,m.status,m.location?.city,m.location?.neighborhood,m.price,m.area,m.rooms,m.matchPercentage,m.description]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `matches_${selectedClientId || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
    <div>
      <h2 className="mb-4">🎯 التطابق الذكي</h2>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row align-items-end">
            <div className="col-md-4">
              <label htmlFor="client-select" className="form-label fw-bold">اختر العميل:</label>
              <select 
                id="client-select" 
                className="form-select" 
                value={selectedClientId} 
                onChange={e => setSelectedClientId(e.target.value)}
              >
                <option value="" disabled>-- اختر عميل --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name} - {client.desiredType} ({client.preferredLocation})</option>
                ))}
              </select>
            </div>
            <div className="col-md-4 text-end">
              <button className="btn btn-outline-primary btn-sm" onClick={exportCSV}>تصدير CSV</button>
            </div>
          </div>
        </div>
      </div>

      {selectedClientId && (
        <div>
          <h4 className="mb-3">نتائج المطابقة:</h4>
          {matches.length > 0 ? (
            <div className="row">
              {matches.map(prop => (
                <div key={prop.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0 match-card" style={{cursor:'pointer', transition: 'transform 0.2s'}} onClick={() => { setSelectedMatch(prop); setShowModal(true); }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div className="position-relative">
                      <img 
                        src={(prop.images && prop.images.length > 0 ? prop.images[0] : prop.imageUrl) || getDefaultImage(prop.type)} 
                        className="card-img-top" 
                        alt={prop.type} 
                        style={{height: '200px', objectFit: 'cover'}} 
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className={`badge rounded-pill ${prop.matchPercentage >= 75 ? 'bg-success' : prop.matchPercentage >= 50 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                          تطابق {prop.matchPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">{prop.location?.neighborhood}</h5>
                      <p className="card-text text-muted small mb-2 text-truncate">{prop.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="text-primary fw-bold">{prop.price.toLocaleString()} ج</span>
                        <small className="text-muted">📏 {prop.area} م²</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning text-center" role="alert">
              😕 لا توجد عقارات مطابقة لهذا الطلب حاليًا.
            </div>
          )}
        </div>
      )}

      {/* Match details modal */}
      <MatchDetailsModal
        show={showModal}
        onClose={() => { setShowModal(false); setSelectedMatch(null); }}
        property={selectedMatch}
        client={clients.find(c => String(c.id) === String(selectedClientId))}
      />
    </div>
  );
}

export default MatchingView;
