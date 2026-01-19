import React from 'react';

const SkeletonCard = ({ isListView }) => {
  if (isListView) {
    return (
      <div className="col-12 mb-3">
        <div className="card h-100 shadow-sm d-flex flex-row placeholder-glow">
          <div className="col-4 placeholder" style={{ background: '#e9ecef', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}></div>
          <div className="col-8 p-3">
            <span className="placeholder col-8 mb-2"></span>
            <span className="placeholder col-5"></span>
            <span className="placeholder col-10 mt-3"></span>
            <span className="placeholder col-7"></span>
            <div className="d-flex justify-content-end mt-3">
              <span className="placeholder col-3" style={{height: '30px'}}></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm" aria-hidden="true">
        <div className="card-img-top placeholder" style={{ height: '220px', background: '#e9ecef' }}></div>
        <div className="card-body placeholder-glow">
          <span className="placeholder col-8"></span>
          <span className="placeholder col-5"></span>
          <span className="placeholder col-10 mt-3"></span>
        </div>
        <div className="card-footer placeholder-glow d-flex justify-content-between">
            <span className="placeholder col-3"></span>
            <span className="placeholder col-4"></span>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;