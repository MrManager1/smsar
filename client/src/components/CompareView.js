import React from 'react';

const CompareView = ({ properties, onRemove }) => {
  if (properties.length === 0) return (
    <div className="text-center py-5 text-muted">
      <div style={{ fontSize: '4rem' }}>⚖️</div>
      <h3>لا توجد عقارات للمقارنة</h3>
      <p>قم بتحديد عقارات من القائمة بالضغط على زر الميزان لإضافتها هنا.</p>
    </div>
  );

  return (
    <div className="container fade-in">
      <h2 className="mb-4">⚖️ مقارنة العقارات</h2>
      <div className="table-responsive">
        <table className="table table-bordered text-center align-middle bg-white shadow-sm">
          <thead className="table-light">
            <tr>
              <th style={{ width: '15%' }}>المواصفات</th>
              {properties.map(p => (
                <th key={p.id} style={{ minWidth: 220 }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-truncate" style={{ maxWidth: 180 }}>{p.location?.neighborhood}</span>
                    <button className="btn btn-sm btn-close" onClick={() => onRemove(p.id)} title="إزالة"></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold bg-light">صورة العقار</td>
              {properties.map(p => (
                <td key={p.id} className="p-0">
                  <img src={(p.images && p.images[0]) || p.imageUrl} alt={p.type} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                </td>
              ))}
            </tr>
            <tr>
              <td className="fw-bold bg-light">السعر</td>
              {properties.map(p => <td key={p.id} className="text-success fw-bold fs-5">{p.price?.toLocaleString()} ج</td>)}
            </tr>
            <tr>
              <td className="fw-bold bg-light">النوع</td>
              {properties.map(p => <td key={p.id}>{p.type}</td>)}
            </tr>
            <tr>
              <td className="fw-bold bg-light">المساحة</td>
              {properties.map(p => <td key={p.id}>{p.area} م²</td>)}
            </tr>
            <tr>
              <td className="fw-bold bg-light">الغرف / الحمامات</td>
              {properties.map(p => <td key={p.id}>{p.rooms} غرف | {p.bathrooms} حمام</td>)}
            </tr>
            <tr>
              <td className="fw-bold bg-light">الحالة</td>
              {properties.map(p => <td key={p.id}><span className="badge bg-secondary">{p.status}</span></td>)}
            </tr>
             <tr>
              <td className="fw-bold bg-light">التوفر</td>
              {properties.map(p => <td key={p.id} className={p.availability === 'متاحة' ? 'text-success' : 'text-danger'}>{p.availability}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareView;