import React, { useState, useEffect, useRef } from 'react';
import ImageUploadCrop from './ImageUploadCrop';
import { GOOGLE_MAPS_API_KEY } from '../config';

function NewPropertyModal({
  propertyName, setPropertyName,
  propertyLocation, setPropertyLocation,
  propertyNeighborhood, setPropertyNeighborhood,
  propertyPrice, setPropertyPrice,
  propertyType, setPropertyType,
  propertyStatus, setPropertyStatus,
  propertyArea, setPropertyArea,
  propertyRooms, setPropertyRooms,
  propertyBathrooms, setPropertyBathrooms,
  propertyAvailability, setPropertyAvailability,
  propertyOwnerName, setPropertyOwnerName,
  propertyOwnerPhone, setPropertyOwnerPhone,
  propertyImageUrl, setPropertyImageUrl,
  propertyImages, setPropertyImages,
  handleAddProperty, handleUpdateProperty,
  editingProperty,
  propertyVideoUrl, setPropertyVideoUrl,
  propertyLat, propertyLng,
  setPropertyLat, setPropertyLng,
  propertyThreeSixtyUrl, setPropertyThreeSixtyUrl
}) {
  const [aiLoading, setAiLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [priceSuggestion, setPriceSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const locationInputRef = useRef(null);

  useEffect(() => {
    if (showPreview) return;
    
    const apiKey = typeof GOOGLE_MAPS_API_KEY !== 'undefined' ? GOOGLE_MAPS_API_KEY : '';
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') return;

    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places && locationInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['geocode'],
          fields: ['formatted_address', 'geometry', 'name'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) setPropertyLocation(place.formatted_address);
          else if (place.name) setPropertyLocation(place.name);

          if (place.geometry && place.geometry.location) {
            if (setPropertyLat) setPropertyLat(place.geometry.location.lat());
            if (setPropertyLng) setPropertyLng(place.geometry.location.lng());
          }
        });
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=ar`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, [setPropertyLocation, showPreview, setPropertyLat, setPropertyLng]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    if (!propertyName || !propertyLocation || !propertyPrice || !propertyType || !propertyStatus || !propertyOwnerName || !propertyOwnerPhone) {
      alert('الرجاء تعبئة جميع الحقول الإلزامية:\n- الوصف\n- الموقع\n- السعر\n- النوع\n- الحالة\n- اسم المالك\n- رقم المالك');
      return;
    }

    setIsSubmitting(true);

    if (editingProperty) {
      handleUpdateProperty();
    } else {
      handleAddProperty();
    }
    document.querySelector('#newPropertyModal .btn-close')?.click();
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleGenerateDescription = () => {
    setAiLoading(true);
    // Simulate AI call with smarter template
    setTimeout(() => {
      const type = propertyType || 'عقار';
      const status = propertyStatus || '';
      const loc = propertyLocation || 'موقع مميز';
      
      let features = [];
      if (propertyArea) features.push(`مساحة ${propertyArea} م²`);
      if (propertyRooms) features.push(`${propertyRooms} غرف`);
      if (propertyBathrooms) features.push(`${propertyBathrooms} حمام`);
      
      const specs = features.length > 0 
        ? `يتمتع هذا العقار بمواصفات ممتازة حيث يتكون من ${features.join(' و ')}.` 
        : 'يتميز العقار بتقسيم داخلي رائع ومساحات مستغلة بذكاء.';

      const priceText = propertyPrice ? `بسعر لقطة: ${Number(propertyPrice).toLocaleString()} جنيه` : 'بسعر تنافسي جداً';

      const desc = `✨ فرصة لا تعوض! ${type} ${status} في ${loc}\n\n` +
                   `🏢 تفاصيل العقار:\n` +
                   `${specs} تشطيب سوبر لوكس، واجهة مميزة، ومدخل شيك. ` +
                   `الموقع حيوي وقريب من جميع الخدمات الأساسية والترفيهية.\n\n` +
                   `💎 مميزات إضافية:\n` +
                   `- تهوية ممتازة ودخول جيد للشمس.\n` +
                   `- منطقة هادئة وراقية.\n` +
                   `- ${propertyAvailability === 'متاحة' ? 'جاهز للاستلام فوراً' : 'متاح لفترة محدودة'}.\n\n` +
                   `💰 ${priceText}\n\n` +
                   `📞 للتواصل والاستفسار:\n` +
                   `يرجى الاتصال بالمالك${propertyOwnerName ? ' أ/ ' + propertyOwnerName : ''} على: ${propertyOwnerPhone || '...'}\n` +
                   `تواصل معنا الآن لتحديد موعد للمعاينة!`;
                   
      setPropertyName(desc);
      setAiLoading(false);
    }, 1000);
  };

  const handleEstimatePrice = () => {
    if (!propertyArea || !propertyLocation) {
      alert('يرجى إدخال الموقع والمساحة أولاً لتقدير السعر.');
      return;
    }
    setAiLoading(true);
    
    // محاكاة خوارزمية تسعير ذكية
    setTimeout(() => {
      const basePricePerMeter = 
        propertyLocation.includes('التجمع') ? 15000 :
        propertyLocation.includes('الشيخ زايد') ? 18000 :
        propertyLocation.includes('العاصمة') ? 20000 :
        propertyLocation.includes('المعادي') ? 12000 :
        10000; // سعر افتراضي

      const estimated = basePricePerMeter * Number(propertyArea);
      const min = estimated * 0.9;
      const max = estimated * 1.1;
      
      setPriceSuggestion(`💡 بناءً على بيانات السوق في "${propertyLocation}"، السعر العادل يتراوح بين ${min.toLocaleString()} و ${max.toLocaleString()} جنيه.`);
      setPropertyPrice(estimated); // اقتراح السعر المتوسط
      setAiLoading(false);
    }, 1500);
  };

  const handleAddImage = () => {
    if (propertyImageUrl && !propertyImages.includes(propertyImageUrl)) {
      setPropertyImages([...propertyImages, propertyImageUrl]);
      setPropertyImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = propertyImages.filter((_, i) => i !== index);
    setPropertyImages(newImages);
  };

  const handleVideoUpload = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('حجم الفيديو كبير جداً. الحد الأقصى 50 ميجابايت.');
        return;
      }
      setVideoUploading(true);
      const fd = new FormData();
      fd.append('file', file);

      try {
        // In a real app, this would upload to a server.
        // For demo, we'll use a blob URL to simulate the upload.
        const res = await fetch('/api/uploads', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Upload failed');
        const json = await res.json();
        setPropertyVideoUrl(json.url);
      } catch (err) {
        console.warn('فشل رفع الفيديو للسيرفر، سيتم استخدام رابط محلي للعرض فقط.', err);
        const localUrl = URL.createObjectURL(file);
        setPropertyVideoUrl(localUrl);
      } finally {
        setVideoUploading(false);
      }
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('imageIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = Number(e.dataTransfer.getData('imageIndex'));
    if (isNaN(dragIndex) || dragIndex === dropIndex) return;
    const newImages = [...propertyImages];
    const [draggedItem] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    setPropertyImages(newImages);
  };

  const getDefaultImage = (type) => {
    switch (type) {
      case 'شقة': return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'فيلا': return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'مكتب': return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      case 'محل': return 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
      default: return 'https://cdn.pixabay.com/photo/2014/04/03/10/00/house-309579_640.png';
    }
  };

  return (
    <div className="modal fade" id="newPropertyModal" tabIndex="-1" aria-labelledby="newPropertyModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content zoom-in">
          <div className="modal-header">
            <h5 className="modal-title" id="newPropertyModalLabel">
              {editingProperty ? 'تعديل عقار' : 'إضافة عقار جديد'} {showPreview ? '- معاينة مباشرة' : ''}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {showPreview ? (
              <div className="card border-0 shadow-sm">
                <div className="position-relative">
                  <img 
                    src={(propertyImages.length > 0 ? propertyImages[0] : propertyImageUrl) || getDefaultImage(propertyType)} 
                    className="card-img-top rounded" 
                    alt="Preview" 
                    style={{height: '300px', objectFit: 'cover'}} 
                  />
                  <div className="position-absolute top-0 start-0 m-3">
                    <span className="badge bg-primary">{propertyType || 'النوع'}</span>
                    <span className="badge bg-secondary ms-1">{propertyStatus || 'الحالة'}</span>
                  </div>
                  <div className="position-absolute bottom-0 end-0 m-3">
                    <span className="badge bg-dark fs-5">{Number(propertyPrice).toLocaleString()} ج</span>
                  </div>
                </div>
                <div className="card-body">
                  <h5 style={{ whiteSpace: 'pre-line' }}>{propertyName || 'وصف العقار'}</h5>
                  <p className="text-muted">📍 {propertyLocation || 'الموقع'}</p>
                  <hr/>
                  <div className="row text-center">
                    <div className="col"><strong>المساحة:</strong> {propertyArea} م²</div>
                    <div className="col"><strong>الغرف:</strong> {propertyRooms}</div>
                    <div className="col"><strong>الحمامات:</strong> {propertyBathrooms}</div>
                  </div>
                  <hr/>
                  <div className="d-flex align-items-center">
                    <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" className="rounded-circle me-3 shadow-sm" style={{width: 50, height: 50, objectFit: 'cover'}} alt="Owner" />
                    <div>
                      <div className="fw-bold">{propertyOwnerName || 'اسم المالك'}</div>
                      <div className="small text-muted">📞 {propertyOwnerPhone || 'رقم الهاتف'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <form onSubmit={handleSubmit}>
              <h6 className="mb-3 text-primary fw-bold">📝 التفاصيل الأساسية</h6>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <label htmlFor="propertyName" className="form-label">اسم العقار/الوصف</label>
                  <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleGenerateDescription} disabled={aiLoading}>
                    {aiLoading ? '🧠 جاري التفكير...' : '✨ إنشاء بالذكاء الاصطناعي'}
                  </button>
                </div>
                <textarea className="form-control" id="propertyName" rows="5" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} required placeholder="اكتب نبذة عن العقار وحالته..."></textarea>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyType" className="form-label">النوع</label>
                  <select className="form-select" id="propertyType" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} required>
                    <option value="">اختر النوع</option>
                    <option value="شقة">شقة</option>
                    <option value="فيلا">فيلا</option>
                    <option value="مكتب">مكتب</option>
                    <option value="محل">محل</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyStatus" className="form-label">الحالة</label>
                  <select className="form-select" id="propertyStatus" value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)} required>
                    <option value="">اختر الحالة</option>
                    <option value="للبيع">للبيع</option>
                    <option value="للإيجار">للإيجار</option>
                  </select>
                </div>
              </div>

              <hr className="my-4" />
              <h6 className="mb-3 text-primary fw-bold">📍 الموقع والمواصفات</h6>

              <div className="mb-3">
                <label htmlFor="propertyLocation" className="form-label">الموقع (المدينة)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="propertyLocation" 
                  value={propertyLocation || ''} 
                  onChange={(e) => setPropertyLocation(e.target.value)} 
                  ref={locationInputRef}
                  placeholder="ابحث عن المنطقة (مثال: المعادي، القاهرة)..."
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="propertyNeighborhood" className="form-label">العنوان التفصيلي (المنطقة/الحي)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="propertyNeighborhood" 
                  value={propertyNeighborhood || ''} 
                  onChange={(e) => setPropertyNeighborhood(e.target.value)} 
                  placeholder="مثال: الحي الأول، شارع التسعين..."
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">إحداثيات GPS (خط العرض)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Latitude" 
                    value={propertyLat || ''} 
                    onChange={(e) => setPropertyLat(e.target.value)} 
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">إحداثيات GPS (خط الطول)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder="Longitude" 
                    value={propertyLng || ''} 
                    onChange={(e) => setPropertyLng(e.target.value)} 
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyPrice" className="form-label">السعر (ج)</label>
                  <div className="input-group">
                    <input type="number" className="form-control" id="propertyPrice" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} required />
                    <button type="button" className="btn btn-outline-success" onClick={handleEstimatePrice} disabled={aiLoading} title="تقدير السعر بناءً على السوق">
                      {aiLoading ? 'جاري الحساب...' : '🤖 تقدير السعر'}
                    </button>
                  </div>
                  {priceSuggestion && <div className="form-text text-success small fade-in">{priceSuggestion}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyAvailability" className="form-label">التوفر</label>
                  <select className="form-select" id="propertyAvailability" value={propertyAvailability} onChange={(e) => setPropertyAvailability(e.target.value)}>
                    <option value="متاحة">متاحة</option>
                    <option value="غير متاحة">غير متاحة</option>
                    <option value="مباعة">مباعة</option>
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="propertyArea" className="form-label">المساحة (م²)</label>
                  <input type="number" className="form-control" id="propertyArea" value={propertyArea} onChange={(e) => setPropertyArea(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="propertyRooms" className="form-label">عدد الغرف</label>
                  <input type="number" className="form-control" id="propertyRooms" value={propertyRooms} onChange={(e) => setPropertyRooms(e.target.value)} />
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="propertyBathrooms" className="form-label">عدد الحمامات</label>
                  <input type="number" className="form-control" id="propertyBathrooms" value={propertyBathrooms} onChange={(e) => setPropertyBathrooms(e.target.value)} />
                </div>
              </div>

              <hr className="my-4" />
              <h6 className="mb-3 text-primary fw-bold">👤 بيانات المالك</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyOwnerName" className="form-label">اسم المالك</label>
                  <input type="text" className="form-control" id="propertyOwnerName" value={propertyOwnerName} onChange={(e) => setPropertyOwnerName(e.target.value)} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="propertyOwnerPhone" className="form-label">رقم هاتف المالك</label>
                  <input type="text" className="form-control" id="propertyOwnerPhone" value={propertyOwnerPhone} onChange={(e) => setPropertyOwnerPhone(e.target.value)} required />
                </div>
              </div>

              <hr className="my-4" />
              <h6 className="mb-3 text-primary fw-bold">📷 الوسائط</h6>
              <div className="mb-3">
                <label htmlFor="propertyImageUrl" className="form-label">صور العقار (اسحب للترتيب)</label>
                <div className="input-group">
                  <input type="text" className="form-control" id="propertyImageUrl" placeholder="رابط الصورة" value={propertyImageUrl} onChange={(e) => setPropertyImageUrl(e.target.value)} />
                  <button type="button" className="btn btn-outline-primary" onClick={handleAddImage}>إضافة</button>
                  <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#imageUploadCropModal">رفع و اقتصاص</button>
                </div>
                <div className="d-flex flex-wrap mt-2 gap-2">
                  {propertyImages && propertyImages.map((img, index) => (
                    <div 
                      key={index} 
                      className="position-relative"
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, index)}
                      style={{ width: '80px', height: '80px', cursor: 'move' }}
                    >
                      <img src={img} alt={`img-${index}`} className="img-thumbnail w-100 h-100 object-fit-cover" />
                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0" 
                        style={{ width: '20px', height: '20px', lineHeight: '1', fontSize: '12px' }}
                        onClick={() => handleRemoveImage(index)}
                      >&times;</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="propertyThreeSixtyUrl" className="form-label">رابط جولة 360°</label>
                <input type="text" className="form-control" id="propertyThreeSixtyUrl" value={propertyThreeSixtyUrl} onChange={(e) => setPropertyThreeSixtyUrl(e.target.value)} placeholder="https://..." />
              </div>
              <ImageUploadCrop showId="imageUploadCropModal" onUploaded={(url) => {
                setPropertyImages(prev => [...prev, url]);
                try { const m = window.bootstrap && window.bootstrap.Modal && window.bootstrap.Modal.getInstance(document.getElementById('imageUploadCropModal')); if (m) m.hide(); }
                catch (e) { /* ignore */ }
              }} />
            </form>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline-info me-auto" onClick={() => setShowPreview(!showPreview)}>
              {showPreview ? '✏️ العودة للتحرير' : '👁️ معاينة مباشرة'}
            </button>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'جاري الحفظ...' : (editingProperty ? 'تحديث' : 'إضافة')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPropertyModal;
