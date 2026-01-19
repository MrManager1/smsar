import React from 'react';
import DashboardChart from './DashboardChart';

const SupervisorReports = ({ properties = [], clients = [], adminInfo, visits = [] }) => {
  // --- منطق لوحة التحكم (منقول من Dashboard.js) ---
  const totalProperties = properties.length;
  const totalClients = clients.length;
  const confirmedVisitsCount = visits.filter(v => v.status === 'confirmed').length;
  
  const totalValue = properties.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const avgPrice = totalProperties > 0 ? totalValue / totalProperties : 0;

  const availableCount = properties.filter(p => p.availability === 'متاحة').length;
  const unavailableCount = totalProperties - availableCount;

  const typeCounts = properties.reduce((acc, curr) => {
    const t = curr.type || 'غير محدد';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const typeChartData = Object.entries(typeCounts).map(([label, value]) => ({ label, value }));

  const statusCounts = properties.reduce((acc, curr) => {
    const s = curr.status || 'غير محدد';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const statusChartData = Object.entries(statusCounts).map(([label, value]) => ({ label, value }));

  const propertiesByCity = properties.reduce((acc, curr) => {
    const city = curr.location?.city || 'غير محدد';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(propertiesByCity).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 5);

  const clientLocationCounts = clients.reduce((acc, curr) => {
    const loc = curr.preferredLocation || 'غير محدد';
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});
  const clientLocationChartData = Object.entries(clientLocationCounts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const topAgents = properties.reduce((acc, p) => {
      acc[p.ownerName] = (acc[p.ownerName] || 0) + 1;
      return acc;
  }, {});
  const sortedAgents = Object.entries(topAgents).sort(([,a],[,b]) => b-a).slice(0, 3);

  // --- منطق التقارير (المبيعات) ---
  const soldProperties = properties.filter(p => {
    const isSold = p.availability === 'مباعة';
    if (adminInfo?.role === 'supervisor') {
      return isSold && p.addedBy === adminInfo.username;
    }
    return isSold;
  });
  
  const totalRevenue = soldProperties.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
  const totalSales = soldProperties.length;

  // تجهيز بيانات الرسم البياني: المبيعات حسب المدينة
  const salesByCity = soldProperties.reduce((acc, curr) => {
    const city = curr.location?.city || 'غير محدد';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});
  
  const salesChartData = Object.entries(salesByCity).map(([label, value]) => ({ label, value }));

  return (
    <div className="container fade-in">
      <h2 className="mb-4">📊 لوحة التحكم والتقارير - {adminInfo?.name || 'المسؤول'}</h2>
      
      {/* --- إحصائيات عامة --- */}
      <div className="row mb-4">
        {[
          { title: 'إجمالي العقارات', value: totalProperties, icon: '🏢', color: 'primary' },
          { title: 'إجمالي العملاء', value: totalClients, icon: '👥', color: 'info' },
          { title: 'المواعيد المؤكدة', value: confirmedVisitsCount, icon: '🗓️', color: 'success' },
          { title: 'إجمالي الإيرادات', value: `${totalRevenue.toLocaleString()} ج`, icon: '💰', color: 'warning' },
        ].map((stat, i) => (
          <div key={i} className="col-md-3 mb-3">
            <div className={`card bg-${stat.color} bg-opacity-10 border-${stat.color} border-2 shadow-sm h-100`}>
              <div className="card-body d-flex align-items-center">
                <div className={`fs-1 text-${stat.color} me-3`}>{stat.icon}</div>
                <div>
                  <h6 className="card-title text-muted">{stat.title}</h6>
                  <p className={`card-text h3 fw-bold text-${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- الرسوم البيانية --- */}
      <div className="row mb-4">
        <div className="col-md-4 mb-4">
            <DashboardChart data={typeChartData} title="توزيع أنواع العقارات" />
        </div>
        <div className="col-md-6 mb-4">
            <DashboardChart data={chartData} title="📊 العقارات حسب المنطقة" />
        </div>
        <div className="col-md-6 mb-4">
            <DashboardChart data={clientLocationChartData} title="📍 المناطق الأكثر طلباً" />
        </div>
        <div className="col-md-4 mb-4">
            <DashboardChart data={statusChartData} title="توزيع حالة العقارات" />
        </div>
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
           <div className="card shadow-sm h-100">
             <div className="card-header bg-light fw-bold">📋 سجل المبيعات الأخيرة</div>
             <div className="card-body p-0">
               <div className="table-responsive">
                 <table className="table table-hover mb-0 align-middle">
                   <thead className="table-light">
                     <tr>
                       <th>العقار</th>
                       <th>النوع</th>
                       <th>السعر</th>
                       <th>الحالة</th>
                       {adminInfo?.role === 'admin' && <th>تمت الإضافة بواسطة</th>}
                     </tr>
                   </thead>
                   <tbody>
                     {soldProperties.length > 0 ? soldProperties.map(p => (
                       <tr key={p.id}>
                         <td>{p.location?.neighborhood || p.description}</td>
                         <td>{p.type}</td>
                         <td className="text-success fw-bold">{p.price?.toLocaleString()} ج</td>
                         <td><span className="badge bg-success">تم البيع</span></td>
                         {adminInfo?.role === 'admin' && <td><span className="badge bg-secondary">{p.addedBy || 'غير معروف'}</span></td>}
                       </tr>
                     )) : (
                       <tr><td colSpan={adminInfo?.role === 'admin' ? "5" : "4"} className="text-center py-4 text-muted">لا توجد مبيعات مسجلة بعد</td></tr>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>
           </div>
        </div>
        
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm h-100">
                <div className="card-header bg-light fw-bold">🏆 أفضل الوكلاء</div>
                <ul className="list-group list-group-flush">
                    {sortedAgents.map(([name, count], index) => (
                        <li key={name} className="list-group-item d-flex align-items-center">
                            <span className="fs-4 me-3">{['🥇', '🥈', '🥉'][index]}</span>
                            <div>
                                <h6 className="mb-0">{name}</h6>
                                <small className="text-muted">أضاف {count} عقار</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisorReports;