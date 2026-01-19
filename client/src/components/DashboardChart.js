import React from 'react';

const DashboardChart = ({ data = [], title }) => {
  // Calculate max value for scaling the bars
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const colors = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header bg-white fw-bold py-3 border-bottom-0">
        {title}
      </div>
      <div className="card-body pt-0">
        {data.length === 0 ? (
          <div className="text-center text-muted py-4">لا توجد بيانات للعرض</div>
        ) : (
          <div className="d-flex flex-column justify-content-center h-100 gap-3">
            {data.map((item, index) => (
              <div key={index}>
                <div className="d-flex justify-content-between mb-1 small">
                  <span className="fw-bold text-dark">{item.label}</span>
                  <span className="text-muted fw-bold">{item.value}</span>
                </div>
                <div className="progress" style={{height: '8px', borderRadius: '4px'}}>
                  <div 
                    className={`progress-bar bg-${colors[index % colors.length]}`} 
                    role="progressbar" 
                    style={{width: `${(item.value / maxVal) * 100}%`, transition: 'width 1s ease-in-out'}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChart;