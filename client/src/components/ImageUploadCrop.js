import React, { useState, useRef } from 'react';

const ImageUploadCrop = ({ showId, onUploaded }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (preview && onUploaded) {
      onUploaded(preview);
      handleClose();
    }
  };

  const handleClose = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="modal fade" id={showId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">📸 رفع صورة</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
          </div>
          <div className="modal-body text-center">
            {!preview ? (
              <div className="p-5 border-2 border-dashed rounded bg-light" onClick={() => fileInputRef.current?.click()} style={{cursor: 'pointer'}}>
                <div className="display-4 text-muted mb-3">☁️</div>
                <p className="mb-0">اضغط لاختيار صورة أو اسحبها هنا</p>
                <input type="file" className="d-none" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            ) : (
              <div>
                <img src={preview} alt="Preview" className="img-fluid rounded mb-3" style={{maxHeight: '300px'}} />
                <div className="d-flex justify-content-center">
                    <button className="btn btn-sm btn-outline-danger" onClick={handleClose}>❌ إلغاء / تغيير</button>
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>إغلاق</button>
            <button type="button" className="btn btn-primary" onClick={handleUpload} disabled={!preview} data-bs-dismiss="modal">تأكيد الصورة</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadCrop;