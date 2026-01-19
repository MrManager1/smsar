import React from 'react';

function ClientList({ clients, handleDeleteClient, handleEditClient, adminInfo }) {
  const phoneForWhatsApp = (raw) => {
    if (!raw) return '';
    let filtered = raw.replace(/[^0-9+]/g, '');
    if (filtered.startsWith('+')) filtered = filtered.slice(1);
    if (filtered.startsWith('0')) filtered = '20' + filtered.slice(1);
    return filtered;
  };

  return (
    <div>
      <h2 className="mb-4">📝 طلبات العملاء</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>العميل</th>
                  <th>نوع العقار</th>
                  <th>المنطقة المفضلة</th>
                  <th>الميزانية (جنيه)</th>
                  <th>ملاحظات</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td className="d-flex align-items-center border-0">
                      {client.photo ? (
                        <img src={client.photo} alt={client.name} className="rounded-circle me-2" style={{width: 40, height: 40, objectFit: 'cover'}} />
                      ) : (
                        <div className="rounded-circle me-2 bg-light d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>👤</div>
                      )}
                      <div>{client.name}</div>
                      <div className="d-flex align-items-center">
                        <small className="text-muted me-2">{client.contact}</small>
                        {client.contact && (
                          <a href={`https://wa.me/${phoneForWhatsApp(client.contact)}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-success py-0 px-1" style={{fontSize: '0.7rem'}}>
                            واتساب
                          </a>
                        )}
                      </div>
                      <small className="text-muted d-block">{client.email}</small>
                    </td>
                    <td>{client.desiredType} ({client.desiredStatus})</td>
                    <td>{client.preferredLocation}</td>
                    <td>{client.budget.toLocaleString()}</td>
                    <td>{client.notes}</td>
                    <td>
                      {adminInfo && (
                        <button type="button" className="btn btn-sm btn-info me-2" data-bs-toggle="modal" data-bs-target="#newClientModal" onClick={() => { handleEditClient(client) }}>تعديل</button>
                      )}
                      {adminInfo && adminInfo.role === 'admin' && (
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDeleteClient(client.id, client.name)}>حذف</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientList;
