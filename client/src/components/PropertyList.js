import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import SkeletonCard from './SkeletonCard';
import SearchFilter from './SearchFilter';

// Helper functions moved outside component for performance
const shareProperty = (prop) => {
    const text = `فرصة عقارية مميزة! 🏠\n*${prop.location?.neighborhood}*\n📏 المساحة: ${prop.area} م²\n🛏️ الغرف: ${prop.rooms}\n💰 السعر: ${prop.price?.toLocaleString()} جنيه\n\nللتواصل: ${prop.ownerPhone}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
};

const copyDetails = (prop) => {
    const text = `النوع: ${prop.type}\nالغرف: ${prop.rooms}\nالمساحة: ${prop.area} م²\nالسعر: ${prop.price?.toLocaleString()} جنيه\nالتفاصيل: ${prop.description}\nرقم التواصل: ${prop.ownerPhone}`;
    navigator.clipboard.writeText(text);
    alert('تم نسخ تفاصيل العقار للحافظة! 📋');
};

const handlePrint = (prop) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html dir="rtl">
        <head>
          <title>طباعة - ${prop.description}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 3px solid #0d6efd; padding-bottom: 20px; margin-bottom: 30px; }
            .img-box { width: 100%; height: 400px; background-image: url('${prop.imageUrl}'); background-size: cover; background-position: center; border-radius: 15px; margin-bottom: 30px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 18px; }
            .price-tag { background: #198754; color: white; padding: 10px 20px; border-radius: 10px; font-size: 24px; font-weight: bold; display: inline-block; margin-top: 20px; }
            .footer { margin-top: 50px; text-align: center; font-size: 14px; color: #777; border-top: 1px solid #ddd; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${prop.location?.neighborhood}</h1>
            <p>${prop.description}</p>
          </div>
          <div class="img-box"></div>
          <div class="details">
            <p><strong>📍 المحافظة:</strong> ${prop.location?.city}</p>
            <p><strong>📏 المساحة:</strong> ${prop.area} م²</p>
            <p><strong>🛏️ الغرف:</strong> ${prop.rooms}</p>
            <p><strong>🛁 الحمامات:</strong> ${prop.bathrooms}</p>
            <p><strong>📞 للتواصل:</strong> ${prop.ownerPhone}</p>
            <p><strong>👤 المالك:</strong> ${prop.ownerName}</p>
          </div>
          <div style="text-align:center"><div class="price-tag">${prop.price?.toLocaleString()} جنيه مصري</div></div>
          <div class="footer">تم استخراج هذا المستند من منصة سمسار</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
};

// Helper to calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

function PropertyList({ properties, handleDeleteProperty, handleEditProperty, onOpenCalculator, favorites = [], toggleFavorite, isFavoritesView = false, compareList = [], toggleCompare, onScheduleVisit, onViewDetails, onShow360, loading, adminInfo, filters, onFilterChange, onPurchase }) {
    const [sortOption, setSortOption] = useState('newest');
    const [visibleItems, setVisibleItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const timeoutRef = useRef(null);

    const filtered = useMemo(() => {
        let result = properties;
        if (filters) {
            if (filters.q) { // بحث نصي عام
                const lowerQ = filters.q.toLowerCase();
                result = result.filter(p => 
                    (p.description && p.description.toLowerCase().includes(lowerQ)) ||
                    (p.location?.neighborhood && p.location.neighborhood.toLowerCase().includes(lowerQ)) ||
                    (p.location?.city && p.location.city.toLowerCase().includes(lowerQ))
                );
            }
            // فلاتر مخصصة
            if (filters.type) {
                result = result.filter(p => p.type === filters.type);
            }
            if (filters.status) {
                result = result.filter(p => p.status === filters.status);
            }
            if (filters.minPrice) {
                result = result.filter(p => (p.price || 0) >= Number(filters.minPrice));
            }
            if (filters.maxPrice) {
                result = result.filter(p => (p.price || 0) <= Number(filters.maxPrice));
            }
            if (filters.has360) {
                result = result.filter(p => p.threeSixtyUrl && p.threeSixtyUrl.trim() !== '');
            }
        }
        return result;
    }, [properties, filters]);

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
        
        if (value === 'nearest') {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        alert('تعذر تحديد موقعك. يرجى التأكد من تفعيل خدمة الموقع في المتصفح.');
                        setSortOption('newest');
                    }
                );
            } else {
                alert('عذراً، متصفحك لا يدعم تحديد الموقع الجغرافي.');
                setSortOption('newest');
            }
        }
    };

    const sorted = useMemo(() => {
        const copy = [...filtered];
        copy.sort((a,b) => {
            switch (sortOption) {
                case 'price_high': return (b.price || 0) - (a.price || 0);
                case 'price_low': return (a.price || 0) - (b.price || 0);
                case 'area_high': return (b.area || 0) - (a.area || 0);
                case 'newest': return (b.id || 0) - (a.id || 0);
                case 'oldest': return (a.id || 0) - (b.id || 0);
                case 'nearest':
                    if (!userLocation) return 0;
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location?.lat, a.location?.lng);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location?.lat, b.location?.lng);
                    return distA - distB;
                default: return 0;
            }
        });
        return copy;
    }, [filtered, sortOption, userLocation]);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsFetching(false);

        const initialBatchSize = viewMode === 'grid' ? 9 : 5;
        setVisibleItems(sorted.slice(0, initialBatchSize));
        setHasMore(sorted.length > initialBatchSize);
    }, [sorted, viewMode]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const fetchMoreData = () => {
        if (visibleItems.length >= sorted.length) {
            setHasMore(false);
            return;
        }
        if (isFetching) return;

        setIsFetching(true);
        // Simulate network delay for smoother loading feel
        timeoutRef.current = setTimeout(() => {
            const nextBatchSize = viewMode === 'grid' ? 6 : 3;
            const nextItems = sorted.slice(visibleItems.length, visibleItems.length + nextBatchSize);
            setVisibleItems(prevItems => [...prevItems, ...nextItems]);
            setIsFetching(false);
        }, 800);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                if (hasMore && !isFetching) fetchMoreData();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isFetching, visibleItems, sorted]);

    const getPageTitle = () => {
        if (isFavoritesView) return '❤️ العقارات المفضلة';
        if (filters?.type) {
            switch(filters.type) {
                case 'شقة': return '🏢 شقق سكنية';
                case 'فيلا': return '🏡 فيلات وقصور';
                case 'مكتب': return '💼 مقار إدارية';
                case 'محل': return '🏪 محلات تجارية';
                default: return `📂 ${filters.type}`;
            }
        }
        if (filters?.has360) return '🔄 جولات افتراضية 360°';
        if (filters?.q) return `🔍 نتائج البحث: "${filters.q}"`;
        return '🏢 أحدث العقارات';
    };

    const hasActiveFilters = filters && (filters.type || filters.q || filters.status || filters.minPrice || filters.maxPrice || filters.has360);

    return (
        <div>
            {/* Professional Header */}
            <div className="card bg-light border-0 shadow-sm p-3 mb-4 fade-in">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="mb-3 mb-md-0">
                        <h2 className="fw-bold m-0 text-primary">{getPageTitle()}</h2>
                        <p className="text-muted m-0">{sorted.length} عقار مطابق</p>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <div className="me-2">
                            <label className="form-label me-2 small visually-hidden">ترتيب حسب:</label>
                            <select className="form-select form-select-sm" style={{width:180}} value={sortOption} onChange={handleSortChange}>
                                <option value="newest">الأحدث</option>
                                <option value="price_high">الأعلى سعراً</option>
                                <option value="price_low">الأقل سعراً</option>
                                <option value="area_high">المساحة (الأكبر)</option>
                                <option value="nearest">📍 الأقرب إلي</option>
                            </select>
                        </div>
                        <div className="btn-group btn-group-sm">
                            <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('grid')} title="عرض شبكي">
                                ⣿
                            </button>
                            <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setViewMode('list')} title="عرض قائمة">
                                ☰
                            </button>
                        </div>
                         {hasActiveFilters && !isFavoritesView && (
                            <button 
                                className="btn btn-outline-danger btn-sm" 
                                onClick={() => onFilterChange && onFilterChange({ q: '', type: '', status: '', minPrice: '', maxPrice: '', has360: false })}
                                title="إلغاء الفلاتر"
                            >
                                ❌
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {onFilterChange && (
                <SearchFilter 
                    onApply={(newFilters) => onFilterChange({...filters, ...newFilters})} 
                    onClear={() => onFilterChange({ q: '', type: '', status: '', minPrice: '', maxPrice: '', has360: false })}
                    initial={filters}
                />
            )}
            
            {onFilterChange && (
                <div className="card mb-4 p-3 border-0 shadow-sm bg-white">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 بحث (المنطقة، النوع، السعر...)"
                                value={filters?.q || ''}
                                onChange={e => onFilterChange({...filters, q: e.target.value})}
                            />
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters?.type || ''}
                                onChange={e => onFilterChange({...filters, type: e.target.value})}
                            >
                                <option value="">🏠 كل الأنواع</option>
                                <option value="شقة">شقة</option>
                                <option value="فيلا">فيلا</option>
                                <option value="مكتب">مكتب</option>
                                <option value="محل">محل</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select
                                className="form-select"
                                value={filters?.status || ''}
                                onChange={e => onFilterChange({...filters, status: e.target.value})}
                            >
                                <option value="">🔖 الحالة</option>
                                <option value="للبيع">للبيع</option>
                                <option value="للإيجار">للإيجار</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="أقل سعر"
                                value={filters?.minPrice || ''}
                                onChange={e => onFilterChange({...filters, minPrice: e.target.value ? Number(e.target.value) : ''})}
                            />
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="أعلى سعر"
                                value={filters?.maxPrice || ''}
                                onChange={e => onFilterChange({...filters, maxPrice: e.target.value ? Number(e.target.value) : ''})}
                            />
                        </div>
                        <div className="col-md-1">
                            <button 
                                className="btn btn-outline-secondary w-100" 
                                onClick={() => onFilterChange({ q: '', type: '', status: '', minPrice: '', maxPrice: '', has360: false })}
                                title="إعادة تعيين الفلاتر">
                                🔄
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="row">
                    {Array.from({ length: viewMode === 'grid' ? 9 : 4 }).map((_, i) => <SkeletonCard key={i} isListView={viewMode === 'list'} />)}
                </div>
            ) : sorted.length > 0 ? (
                <>
                    <div className="row">
                        {visibleItems.map((prop, index) => (
                            <div key={`${prop.id}-${index}`} className={`${viewMode === 'grid' ? 'col-md-6 col-lg-4' : 'col-12'} mb-4 fade-in`} style={{ animationDelay: `${(index % 12) * 0.05}s` }}>
                                <PropertyCard 
                                    prop={prop}
                                    isFav={favorites.includes(prop.id)}
                                    isListView={viewMode === 'list'}
                                    isComparing={compareList.includes(prop.id)}
                                    adminInfo={adminInfo}
                                    {...{onViewDetails, onShow360, toggleFavorite, toggleCompare, onScheduleVisit, handlePrint, shareProperty, copyDetails, onOpenCalculator, handleEditProperty, handleDeleteProperty, onPurchase}}
                                />
                            </div>
                        ))}
                    </div>
                    
                    {isFetching && hasMore && (
                        <div className="row mt-4">
                            {Array.from({ length: viewMode === 'grid' ? 3 : 2 }).map((_, i) => <SkeletonCard key={`loader-${i}`} isListView={viewMode === 'list'} />)}
                        </div>
                    )}

                    {!hasMore && (
                        <p style={{ textAlign: 'center' }} className="mt-5 text-muted">
                            <b>🏁 لقد وصلت إلى نهاية القائمة!</b>
                        </p>
                    )}
                </>
            ) : (
                <div className="col-12 text-center py-5">
                    <div className="card p-5 border-dashed bg-light">
                        <div className="fs-1 mb-3">🤷‍♂️</div>
                        <h4 className="text-muted">لا توجد عقارات للعرض</h4>
                        <p className="text-muted">حاول تغيير فلاتر البحث أو قم بعرض الكل.</p>
                        <button className="btn btn-primary mt-2" onClick={() => onFilterChange && onFilterChange({ q: '', type: '', status: '', minPrice: '', maxPrice: '', has360: false })}>عرض كل العقارات</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PropertyList;