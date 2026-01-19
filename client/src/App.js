import React, { useState, useEffect, useRef } from 'react';
import { signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import PropertyList from './components/PropertyList';
import ClientList from './components/ClientList';
import MatchingView from './components/MatchingView';
import NewPropertyModal from './components/NewPropertyModal';
import NewClientModal from './components/NewClientModal';
import ConfirmModal from './components/ConfirmModal';
import ChatWidget from './components/ChatWidget';
import AdminChat from './components/AdminChat';
import AdminLoginModal from './components/AdminLoginModal';
import ClientLoginModal from './components/ClientLoginModal';
import './components/MatchingView.css';
import BackgroundAnimation from './components/BackgroundAnimation';
import ContactWidget from './components/ContactWidget';
import Snowfall from './components/Snowfall';
import AmbientSound from './components/AmbientSound';
import Dashboard from './components/Dashboard';
import MortgageCalculator from './components/MortgageCalculator';
import SupervisorReports from './components/SupervisorReports';
import CompareView from './components/CompareView';
import ScheduleVisitModal from './components/ScheduleVisitModal';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import Newsletter from './components/Newsletter';
import ThreeSixtyViewer from './components/ThreeSixtyViewer'; // Ensure this import is correct
import QuickNotes from './components/QuickNotes';
import ScrollToTop from './components/ScrollToTop';
import CurrencyConverter from './components/CurrencyConverter';
import ROICalculator from './components/ROICalculator';
import { themes } from './components/ThemeSettingsModal';

const defaultProperties = [
  {
    id: 1,
    type: 'شقة',
    status: 'للبيع',
    location: { city: 'القاهرة الجديدة', neighborhood: 'التجمع الخامس', lat: 30.0055, lng: 31.4285 },
    area: 150,
    rooms: 3,
    bathrooms: 2,
    price: 2500000,
    availability: 'متاحة',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'شقة رائعة في موقع متميز بالتجمع الخامس، قريبة من الخدمات.',
    ownerName: 'محمد أحمد',
    ownerPhone: '01000000001',
    addedBy: 'admin'
  },
  {
    id: 2,
    type: 'فيلا',
    status: 'للبيع',
    location: { city: 'الشيخ زايد', neighborhood: 'بيفرلي هيلز', lat: 30.0566, lng: 30.9259 },
    area: 450,
    rooms: 5,
    bathrooms: 4,
    price: 8500000,
    availability: 'متاحة',
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'فيلا مستقلة بتشطيب سوبر لوكس وحديقة خاصة.',
    ownerName: 'سارة علي',
    ownerPhone: '01111111111',
    addedBy: 'admin'
  },
  {
    id: 3,
    type: 'شقة',
    status: 'للإيجار',
    location: { city: 'المعادي', neighborhood: 'دجلة', lat: 29.9602, lng: 31.2569 },
    area: 120,
    rooms: 2,
    bathrooms: 1,
    price: 15000,
    availability: 'متاحة',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'شقة مفروشة للإيجار في المعادي، فيو رائع.',
    ownerName: 'أحمد محمود',
    ownerPhone: '01222222222',
    addedBy: 'admin'
  },
  {
    id: 4,
    type: 'مكتب',
    status: 'للإيجار',
    location: { city: 'مدينة نصر', neighborhood: 'عباس العقاد', lat: 30.0609, lng: 31.3395 },
    area: 80,
    rooms: 2,
    bathrooms: 1,
    price: 8000,
    availability: 'متاحة',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    description: 'مكتب إداري مجهز بالكامل في موقع حيوي.',
    ownerName: 'شركة النور',
    ownerPhone: '01555555555',
    addedBy: 'admin'
  }
];

const getDefaultImage = (type) => {
  switch (type) {
    case 'شقة': return 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'فيلا': return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'مكتب': return 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    case 'محل': return 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    default: return 'https://cdn.pixabay.com/photo/2014/04/03/10/00/house-309579_640.png';
  }
};

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('properties');
    return saved ? JSON.parse(saved) : defaultProperties;
  });
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('clients');
    return saved ? JSON.parse(saved) : [];
  });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [navLoading, setNavLoading] = useState(false);
  const [darkMode] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [adminInfo, setAdminInfo] = useState(() => {
    const saved = localStorage.getItem('adminInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [clientUser, setClientUser] = useState(() => {
    const saved = localStorage.getItem('clientUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [showClientLogin, setShowClientLogin] = useState(false);

  // إظهار زر الأدمن فقط إذا كان الرابط يحتوي على ?admin=true أو إذا كان المستخدم مسجلاً للدخول
  const showAdminButton = true;

  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorPrice, setCalculatorPrice] = useState(0);
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  
  // Theme System
  const [themeColor] = useState('default');
  const [showUtils, setShowUtils] = useState(false);

  const currentThemeObj = themes[themeColor] || themes.default;

  // Comparison System
  const [compareList, setCompareList] = useState([]);
  // Schedule Visit System
  const [visitProperty, setVisitProperty] = useState(null);
  // Property Details Modal
  const [viewProperty, setViewProperty] = useState(null);
  // 360 Viewer
  const [threeSixtyUrl, setThreeSixtyUrl] = useState(null);

  // Ref for triggering admin modal programmatically
  const adminModalTrigger = useRef(null);
  const handleSwitchToAdmin = () => {
    setShowClientLogin(false);
    setTimeout(() => adminModalTrigger.current?.click(), 200);
  };

  const toggleCompare = (id) => setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  // Favorites System
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('recentlyViewed');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    if (adminToken) localStorage.setItem('adminToken', adminToken);
    else localStorage.removeItem('adminToken');
  }, [adminToken]);

  useEffect(() => {
    if (adminInfo) localStorage.setItem('adminInfo', JSON.stringify(adminInfo));
    else localStorage.removeItem('adminInfo');
  }, [adminInfo]);

  useEffect(() => {
    if (clientUser) localStorage.setItem('clientUser', JSON.stringify(clientUser));
    else localStorage.removeItem('clientUser');
  }, [clientUser]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  useEffect(() => {
    setLoading(true);
    // محاكاة وقت التحميل فقط، الاعتماد الكلي الآن على البيانات المحفوظة محلياً
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    // Apply dark mode on initial load
    if (darkMode) {
      document.body.classList.add('dark-mode');
    }
    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (property) => {
    setViewProperty(property);
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== property.id);
      return [property.id, ...filtered].slice(0, 5); // Keep last 5
    });
  };

  const handleClientLogin = (user) => {
    setClientUser(user);
    setShowClientLogin(false);
    alert(`مرحباً بك يا ${user.name}!`);
  };

  const handleClientLogout = async () => {
    try {
      await signOut(auth);
      setClientUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      setClientUser(null); // Fallback to clear UI state
    }
  };

  // Helper to get RGB for Bootstrap variables
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '13, 110, 253';
  };

  // Replace anchors used as buttons for accessibility
  // (the following nav renders use <button> instead of <a> to satisfy a11y rules)

  // Derived filtered properties using active filters
  const filteredProperties = properties.filter(p => {
    if (filters.q) {
      const q = filters.q.toString().toLowerCase();
      if (!(`${p.description} ${p.location.city} ${p.location.neighborhood} ${p.ownerName}`.toLowerCase().includes(q))) return false;
    }
    if (filters.type && filters.type !== '') {
      if (p.type !== filters.type) return false;
    }
    if (filters.status && filters.status !== '') {
      if (p.status !== filters.status) return false;
    }
    if (filters.minPrice !== undefined && filters.minPrice !== '' && filters.minPrice !== null) {
      if (p.price < filters.minPrice) return false;
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '' && filters.maxPrice !== null) {
      if (p.price > filters.maxPrice) return false;
    }
    if (filters.minRooms !== undefined && filters.minRooms !== '' && filters.minRooms !== null) {
      if (p.rooms < filters.minRooms) return false;
    }
    return true;
  });

  // State for New Property Form
  const [newPropertyName, setNewPropertyName] = useState('');
  const [newPropertyLocation, setNewPropertyLocation] = useState('');
  const [newPropertyNeighborhood, setNewPropertyNeighborhood] = useState('');
  const [newPropertyPrice, setNewPropertyPrice] = useState('');
  const [newPropertyType, setNewPropertyType] = useState('');
  const [newPropertyStatus, setNewPropertyStatus] = useState('');
  const [newPropertyArea, setNewPropertyArea] = useState('');
  const [newPropertyRooms, setNewPropertyRooms] = useState('');
  const [newPropertyBathrooms, setNewPropertyBathrooms] = useState('');
  const [newPropertyAvailability, setNewPropertyAvailability] = useState('متاحة');
  const [newPropertyOwnerName, setNewPropertyOwnerName] = useState('');
  const [newPropertyOwnerPhone, setNewPropertyOwnerPhone] = useState('');
  const [newPropertyImageUrl, setNewPropertyImageUrl] = useState('');
  const [newPropertyImages, setNewPropertyImages] = useState([]);
  const [newPropertyThreeSixtyUrl, setNewPropertyThreeSixtyUrl] = useState('');
  const [newPropertyLat, setNewPropertyLat] = useState(null);
  const [newPropertyLng, setNewPropertyLng] = useState(null);

  // State for New Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientDesiredType, setNewClientDesiredType] = useState('');
  const [newClientDesiredStatus, setNewClientDesiredStatus] = useState('');
  const [newClientPreferredLocation, setNewClientPreferredLocation] = useState('');
  const [newClientBudget, setNewClientBudget] = useState('');
  const [newClientMinArea, setNewClientMinArea] = useState('');
  const [newClientMinRooms, setNewClientMinRooms] = useState('');
  const [newClientNotes, setNewClientNotes] = useState('');

  const getAuthHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (adminToken) headers['x-admin-token'] = adminToken;
    return headers;
  };

  const handleAddProperty = () => {
    const defaultImg = getDefaultImage(newPropertyType);
    const newProperty = {
      id: Date.now(), // إنشاء معرف محلي فريد لضمان الحفظ
      type: newPropertyType,
      status: newPropertyStatus,
      location: { 
        governorate: 'غير محدد', 
        city: newPropertyLocation, 
        neighborhood: newPropertyNeighborhood || 'غير محدد',
        lat: newPropertyLat,
        lng: newPropertyLng
      },
      area: parseFloat(newPropertyArea),
      rooms: parseInt(newPropertyRooms),
      bathrooms: parseInt(newPropertyBathrooms),
      price: parseFloat(newPropertyPrice),
      availability: newPropertyAvailability,
      imageUrl: newPropertyImages.length > 0 ? newPropertyImages[0] : (newPropertyImageUrl || defaultImg),
      images: newPropertyImages.length > 0 ? newPropertyImages : (newPropertyImageUrl ? [newPropertyImageUrl] : [defaultImg]),
      description: newPropertyName,
      ownerName: newPropertyOwnerName,
      ownerPhone: newPropertyOwnerPhone,
      threeSixtyUrl: newPropertyThreeSixtyUrl,
      addedBy: adminInfo?.username || 'admin',
    };

    // تحديث الحالة محلياً فوراً (Local First)
    setProperties(prevProperties => [...prevProperties, newProperty]);
    
    // تصفير النموذج
    setNewPropertyName('');
    setNewPropertyLocation('');
    setNewPropertyNeighborhood('');
    setNewPropertyPrice('');
    setNewPropertyType('');
    setNewPropertyStatus('');
    setNewPropertyArea('');
    setNewPropertyRooms('');
    setNewPropertyBathrooms('');
    setNewPropertyAvailability('متاحة');
    setNewPropertyOwnerName('');
    setNewPropertyOwnerPhone('');
    setNewPropertyImageUrl('');
    setNewPropertyImages([]);
    setNewPropertyThreeSixtyUrl('');
    setNewPropertyLat(null);
    setNewPropertyLng(null);

    // إرسال نسخة للسيرفر (اختياري/للمزامنة فقط) دون انتظار الرد
    fetch('/api/properties', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProperty),
    }).catch(error => console.warn('Server sync skipped:', error));
  };

  const handleAddClient = () => {
    const newClient = {
      id: Date.now(), // معرف محلي
      name: newClientName,
      contact: newClientPhone,
      email: newClientEmail,
      desiredType: newClientDesiredType,
      desiredStatus: newClientDesiredStatus,
      preferredLocation: newClientPreferredLocation,
      budget: parseFloat(newClientBudget),
      minArea: parseFloat(newClientMinArea),
      minRooms: parseInt(newClientMinRooms),
      notes: newClientNotes,
    };

    // تحديث محلي فوري
    setClients(prevClients => [...prevClients, newClient]);
    
    setNewClientName('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientDesiredType('');
    setNewClientDesiredStatus('');
    setNewClientPreferredLocation('');
    setNewClientBudget('');
    setNewClientMinArea('');
    setNewClientMinRooms('');
    setNewClientNotes('');

    fetch('/api/clients', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newClient),
    }).catch(error => console.warn('Server sync skipped:', error));
  };

  const [confirmShow, setConfirmShow] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);

  const showDeleteConfirm = (type, id, label) => {
    // التحقق من الصلاحية: السماح فقط للمدير (admin) بالحذف
    if (!adminInfo || adminInfo.role !== 'admin') {
      alert('عذراً، هذه الصلاحية خاصة بالمدير العام فقط.');
      return;
    }
    setConfirmPayload({ type, id, label });
    setConfirmShow(true);
  };

  const handleConfirmDelete = () => {
    if (!confirmPayload) return;
    const { type, id } = confirmPayload;
    
    // الحذف المحلي فوراً
    if (type === 'properties') setProperties(prev => prev.filter(p => p.id !== id));
    if (type === 'clients') setClients(prev => prev.filter(c => c.id !== id));
    
    setConfirmShow(false); 
    setConfirmPayload(null);

    const url = `/api/${type}/${id}`;
    fetch(url, { method: 'DELETE', headers: getAuthHeaders() }).catch(() => {});
  };

  const handleCancelDelete = () => { setConfirmShow(false); setConfirmPayload(null); };

  // State for editing
  const [editingProperty, setEditingProperty] = useState(null); // Stores the property object being edited
  const [editingClient, setEditingClient] = useState(null); // Stores the client object being edited

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    // Pre-fill the form with existing property data
    setNewPropertyName(property.description || '');
    setNewPropertyLocation(property.location?.city || '');
    setNewPropertyNeighborhood(property.location?.neighborhood || '');
    setNewPropertyPrice(property.price || '');
    setNewPropertyType(property.type || '');
    setNewPropertyStatus(property.status || '');
    setNewPropertyArea(property.area || '');
    setNewPropertyRooms(property.rooms || '');
    setNewPropertyBathrooms(property.bathrooms || '');
    setNewPropertyAvailability(property.availability || 'متاحة');
    setNewPropertyOwnerName(property.ownerName || '');
    setNewPropertyOwnerPhone(property.ownerPhone || '');
    setNewPropertyImageUrl('');
    setNewPropertyImages(property.images || (property.imageUrl ? [property.imageUrl] : []));
    setNewPropertyThreeSixtyUrl(property.threeSixtyUrl || '');
    setNewPropertyLat(property.location?.lat || null);
    setNewPropertyLng(property.location?.lng || null);
    // Open the modal (Bootstrap handles this with data-bs-toggle, but we need to trigger it programmatically if not clicked)
    // For now, assume the modal will be opened by a button click that calls this function
  };

  const handleUpdateProperty = () => {
    const defaultImg = getDefaultImage(newPropertyType);
    const updatedProperty = {
      ...editingProperty,
      description: newPropertyName,
      location: { 
        ...editingProperty.location, 
        city: newPropertyLocation,
        neighborhood: newPropertyNeighborhood || 'غير محدد',
        lat: newPropertyLat,
        lng: newPropertyLng
      },
      price: parseFloat(newPropertyPrice),
      type: newPropertyType,
      status: newPropertyStatus,
      area: parseFloat(newPropertyArea),
      rooms: parseInt(newPropertyRooms),
      bathrooms: parseInt(newPropertyBathrooms),
      availability: newPropertyAvailability,
      ownerName: newPropertyOwnerName,
      ownerPhone: newPropertyOwnerPhone,
      imageUrl: newPropertyImages.length > 0 ? newPropertyImages[0] : (newPropertyImageUrl || defaultImg),
      images: newPropertyImages.length > 0 ? newPropertyImages : (newPropertyImageUrl ? [newPropertyImageUrl] : [defaultImg]),
      threeSixtyUrl: newPropertyThreeSixtyUrl,
    };

    // تحديث محلي فوري
    setProperties(prev => prev.map(prop => (prop.id === editingProperty.id ? updatedProperty : prop)));
    
    setEditingProperty(null);
    setNewPropertyName('');
    setNewPropertyLocation('');
    setNewPropertyNeighborhood('');
    setNewPropertyPrice('');
    setNewPropertyType('');
    setNewPropertyStatus('');
    setNewPropertyArea('');
    setNewPropertyRooms('');
    setNewPropertyBathrooms('');
    setNewPropertyAvailability('متاحة');
    setNewPropertyOwnerName('');
    setNewPropertyOwnerPhone('');
    setNewPropertyImageUrl('');
    setNewPropertyImages([]);
    setNewPropertyThreeSixtyUrl('');
    setNewPropertyLat(null);
    setNewPropertyLng(null);

    fetch(`/api/properties/${editingProperty.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedProperty),
    }).catch(error => console.warn('Server sync skipped:', error));
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    // Pre-fill the form with existing client data
    setNewClientName(client.name || '');
    setNewClientPhone(client.contact || '');
    setNewClientEmail(client.email || '');
    setNewClientDesiredType(client.desiredType || '');
    setNewClientDesiredStatus(client.desiredStatus || '');
    setNewClientPreferredLocation(client.preferredLocation || '');
    setNewClientBudget(client.budget || '');
    setNewClientMinArea(client.minArea || '');
    setNewClientMinRooms(client.minRooms || '');
    setNewClientNotes(client.notes || '');
    // Open the modal
  };

  const handleUpdateClient = () => {
    const updatedClient = {
      ...editingClient,
      name: newClientName,
      contact: newClientPhone,
      email: newClientEmail,
      desiredType: newClientDesiredType,
      desiredStatus: newClientDesiredStatus,
      preferredLocation: newClientPreferredLocation,
      budget: parseFloat(newClientBudget),
      minArea: parseFloat(newClientMinArea),
      minRooms: parseInt(newClientMinRooms),
      notes: newClientNotes,
    };

    // تحديث محلي فوري
    setClients(prev => prev.map(client => (client.id === editingClient.id ? updatedClient : client)));
    
    setEditingClient(null);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientEmail('');
    setNewClientDesiredType('');
    setNewClientDesiredStatus('');
    setNewClientPreferredLocation('');
    setNewClientBudget('');
    setNewClientMinArea('');
    setNewClientMinRooms('');
    setNewClientNotes('');

    fetch(`/api/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedClient),
    }).catch(error => console.warn('Server sync skipped:', error));
  };

  const handleViewSwitch = (view) => {
    if (view === activeView) return;
    setNavLoading(true);
    setActiveView(view);
    setTimeout(() => setNavLoading(false), 600);
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard properties={properties} clients={clients} onViewChange={handleViewSwitch} loading={loading} recentlyViewedIds={recentlyViewed} />;
      case 'favorites':
        const favProps = properties.filter(p => favorites.includes(p.id));
        return <PropertyList properties={favProps} loading={loading} isCompact={isCompact} handleDeleteProperty={(id,label)=>showDeleteConfirm('properties', id, label)} handleEditProperty={handleEditProperty} onOpenCalculator={(price) => { setCalculatorPrice(price); setShowCalculator(true); }} favorites={favorites} toggleFavorite={toggleFavorite} isFavoritesView={true} compareList={compareList} toggleCompare={toggleCompare} onScheduleVisit={setVisitProperty} onViewDetails={handleViewDetails} onShow360={setThreeSixtyUrl} adminInfo={adminInfo} />;
      case 'clients':
        return <ClientList clients={clients} loading={loading} handleDeleteClient={(id,label)=>showDeleteConfirm('clients', id, label)} handleEditClient={handleEditClient} adminInfo={adminInfo} />;
      case 'chat':
        return <AdminChat adminToken={adminToken} adminInfo={adminInfo} />;
      case 'compare':
        return <CompareView properties={properties.filter(p => compareList.includes(p.id))} onRemove={toggleCompare} />;
      case 'matching':
        return <MatchingView clients={clients} properties={filteredProperties} loading={loading} />;
      case 'reports':
        return <SupervisorReports properties={properties} clients={clients} adminInfo={adminInfo} />;
      case 'properties':
      default:
        return <PropertyList properties={filteredProperties} loading={loading} isCompact={isCompact} handleDeleteProperty={(id,label)=>showDeleteConfirm('properties', id, label)} handleEditProperty={handleEditProperty} onOpenCalculator={(price) => { setCalculatorPrice(price); setShowCalculator(true); }} favorites={favorites} toggleFavorite={toggleFavorite} compareList={compareList} toggleCompare={toggleCompare} onScheduleVisit={setVisitProperty} onViewDetails={handleViewDetails} onShow360={setThreeSixtyUrl} adminInfo={adminInfo} filters={filters} onFilterChange={setFilters} />;
    }
  };

  return (
    <div>
      <style>{`
        :root {
          --primary-gradient: ${currentThemeObj.gradient};
          --bs-primary: ${currentThemeObj.color};
          --bs-primary-rgb: ${hexToRgb(currentThemeObj.color)};
          --glass-bg: rgba(255, 255, 255, 0.95);
          --glass-border: 1px solid rgba(255, 255, 255, 0.4);
          --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
          --card-radius: 20px;
          --btn-radius: 12px;
          --text-main: #212529;
          --text-muted: #6c757d;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: transparent; /* السماح للخلفية المتحركة بالظهور */
          overflow-x: hidden;
          color: var(--text-main);
        }

        /* Dark Mode Overrides */
        body.dark-mode {
          background-color: #121212;
          --glass-bg: rgba(33, 37, 41, 0.95);
          --glass-border: 1px solid rgba(255, 255, 255, 0.1);
          --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
          --text-main: #f8f9fa;
          --text-muted: #adb5bd;
          color: var(--text-main);
        }

        /* Font Clarity on Dark Backgrounds */
        .navbar, .hero-banner, .btn-primary, .btn-success, .btn-danger, .btn-info, .bg-primary, .bg-success, .bg-dark {
          text-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }

        .dark-mode .card, .dark-mode .modal-content {
          background: var(--glass-bg);
          color: var(--text-main);
        }
        .dark-mode .text-muted {
          color: var(--text-muted) !important;
        }
        
        /* Bootstrap Dark Mode Fixes */
        .dark-mode .text-dark { color: #f8f9fa !important; }
        .dark-mode .bg-light { background-color: #2c3034 !important; color: #f8f9fa !important; }
        .dark-mode .bg-white { background-color: #212529 !important; color: #f8f9fa !important; }
        .dark-mode .border { border-color: #495057 !important; }
        .dark-mode .form-control, .dark-mode .form-select {
            background-color: #2c3034;
            border-color: #495057;
            color: #f8f9fa;
        }
        .dark-mode .form-control::placeholder { color: #adb5bd; }
        .dark-mode .list-group-item { background-color: transparent; color: var(--text-main); border-color: #495057; }
        .dark-mode .dropdown-menu { background-color: #343a40; border-color: #495057; }
        .dark-mode .dropdown-item { color: #f8f9fa; }
        .dark-mode .dropdown-item:hover { background-color: #495057; }
        .dark-mode .table { color: #f8f9fa; border-color: #495057; }
        .dark-mode .table-light { background-color: #343a40; color: #f8f9fa; }

        /* 3D Card Effect */
        .card {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: var(--glass-border);
          border-radius: var(--card-radius);
          box-shadow: var(--glass-shadow);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          perspective: 1000px;
          margin-bottom: 20px;
        }

        .card:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          z-index: 10;
        }

        /* Navbar Styling */
        .navbar {
          background: rgba(33, 37, 41, 0.85) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          padding: 1rem 0;
        }

        .nav-link {
          border-radius: 30px;
          padding: 8px 20px !important;
          margin: 0 4px;
          transition: all 0.3s ease;
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .nav-link:hover, .nav-link.active {
          background: rgba(255, 255, 255, 0.15);
          color: #fff !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        /* Buttons 3D */
        .btn {
          border-radius: var(--btn-radius);
          transition: all 0.3s ease;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 14px rgba(0,0,0,0.18);
        }
        .btn:active {
          transform: translateY(-1px);
        }
        .btn-primary {
          background-image: var(--primary-gradient);
          border: none;
          background-color: ${currentThemeObj.color};
        }
        
        .bg-primary {
          background-color: ${currentThemeObj.color} !important;
          background-image: var(--primary-gradient);
        }
        
        .text-primary {
          color: ${currentThemeObj.color} !important;
        }
        .border-primary {
          border-color: ${currentThemeObj.color} !important;
        }

        /* Hero Section */
        .hero-banner {
          background: linear-gradient(135deg, rgba(33, 37, 41, 0.95), rgba(52, 58, 64, 0.8));
          color: white;
          padding: 50px;
          border-radius: 25px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.1);
          transform: translateZ(0);
          transition: transform 0.5s;
          margin-bottom: 40px !important;
        }
        .hero-banner:hover {
          transform: scale(1.01);
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out both;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .zoom-in {
          animation: zoomIn 0.3s ease-out forwards;
        }

        /* Progress Bar */
        .top-loader {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          width: 100%;
          z-index: 10000;
          overflow: hidden;
        }
        .top-loader .bar {
          width: 100%;
          height: 100%;
          background: var(--primary-gradient);
          animation: indeterminate 1.5s infinite linear;
          transform-origin: 0% 50%;
        }
        @keyframes indeterminate {
          0% { transform: translateX(0) scaleX(0); }
          40% { transform: translateX(0) scaleX(0.4); }
          100% { transform: translateX(100%) scaleX(0.5); }
        }

        /* Mobile Responsiveness for Floating Widgets */
        @media (max-width: 576px) {
          .floating-widget {
            transform: scale(0.85);
            transform-origin: bottom center;
          }
          .widget-pomodoro { left: 10px !important; bottom: 10px !important; }
          .widget-notes { left: 10px !important; bottom: 60px !important; }
          .widget-sound { left: 10px !important; bottom: 110px !important; }
          .widget-chat { right: 10px !important; bottom: 10px !important; }
          .widget-scroll { right: 10px !important; bottom: 70px !important; }
          .modal-dialog { margin: 0.5rem; }
          .contact-fab { bottom: 80px !important; right: 10px !important; }
        }
      `}</style>
      {(loading || navLoading) && (
        <div className="top-loader"><div className="bar"></div></div>
      )}
      <BackgroundAnimation />
      <Snowfall />
      <AmbientSound />
      <ContactWidget />
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top mb-5">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold fs-3" href="#" onClick={() => handleViewSwitch('dashboard')}>
            🏠 <span style={{background: 'linear-gradient(to right, #fff, #a29bfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              سمسار برو
            </span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
              <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button type="button" className={`nav-link btn btn-link ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => handleViewSwitch('dashboard')}>
                  📊 الرئيسية
                </button>
              </li>
              <li className="nav-item">
                <button type="button" title="العقارات" className={`nav-link btn btn-link ${activeView === 'properties' ? 'active' : ''}`} onClick={() => handleViewSwitch('properties')}>
                  🏢 العقارات
                </button>
              </li>
              <li className="nav-item">
                <button type="button" className={`nav-link btn btn-link ${activeView === 'favorites' ? 'active' : ''}`} onClick={() => handleViewSwitch('favorites')}>
                  ❤️ المفضلة {favorites.length > 0 && <span className="badge bg-danger rounded-pill ms-1">{favorites.length}</span>}
                </button>
              </li>
              <li className="nav-item">
                <button type="button" className={`nav-link btn btn-link ${activeView === 'compare' ? 'active' : ''}`} onClick={() => handleViewSwitch('compare')}>
                  ⚖️ مقارنة {compareList.length > 0 && <span className="badge bg-warning text-dark rounded-pill ms-1">{compareList.length}</span>}
                </button>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              
              {adminInfo && (
                <div className={`d-flex align-items-center transition-all me-2 ${showUtils ? 'bg-white bg-opacity-10 rounded-pill p-1 ps-2' : ''}`}>
                   {showUtils && (
                     <div className="d-flex align-items-center gap-2 me-2 fade-in">
                        <button className="btn btn-sm btn-outline-light" onClick={() => { setCalculatorPrice(0); setShowCalculator(true); }} title="حاسبة">🧮</button>
                        <button className="btn btn-sm btn-outline-light" onClick={() => setShowCurrencyConverter(true)} title="تحويل">💱</button>
                        <button className="btn btn-sm btn-outline-light" onClick={() => { setCalculatorPrice(0); setShowROICalculator(true); }} title="العائد">📈</button>
                        
                        <div className="vr bg-white mx-1" style={{opacity: 0.5, height: '20px'}}></div>
                        
                        <button className={`btn btn-sm ${activeView === 'clients' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => handleViewSwitch('clients')} title="العملاء">👥</button>
                        <button className={`btn btn-sm ${activeView === 'matching' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => handleViewSwitch('matching')} title="المطابقة">🎯</button>
                        <button className={`btn btn-sm ${activeView === 'chat' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => handleViewSwitch('chat')} title="الرسائل">💬</button>
                        {(adminInfo.role === 'supervisor' || adminInfo.role === 'admin') && (
                           <button className={`btn btn-sm ${activeView === 'reports' ? 'btn-light text-primary' : 'btn-outline-light'}`} onClick={() => handleViewSwitch('reports')} title="لوحة التحكم والتقارير">📊</button>
                        )}
                     </div>
                   )}
                   <button 
                     className={`btn btn-sm rounded-circle ${showUtils ? 'btn-light' : 'btn-outline-light'}`} 
                     onClick={() => setShowUtils(!showUtils)}
                     style={{width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                     title="أدوات الأدمن"
                   >
                     🛠️
                   </button>
                </div>
              )}

              {adminInfo ? (
                <button className="btn btn-sm btn-outline-warning me-2" data-bs-toggle="modal" data-bs-target="#adminLoginModal">
                  👤 {adminInfo.name} (أدمن)
                </button>
              ) : clientUser ? (
                <div className="dropdown d-inline-block me-2">
                  <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    👤 {clientUser.name?.split(' ')[0]}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item" onClick={handleClientLogout}>تسجيل الخروج</button></li>
                  </ul>
                </div>
              ) : (
                <button id="client-login-button" className="btn btn-sm btn-light me-2 text-primary fw-bold px-3" onClick={() => setShowClientLogin(true)}>
                  👋 تسجيل الدخول
                </button>
              )}

              {/* Hidden trigger for Admin Modal */}
              <button ref={adminModalTrigger} className="d-none" data-bs-toggle="modal" data-bs-target="#adminLoginModal"></button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container slide-up" style={{ marginTop: '100px' }}>

        {adminInfo && (
          <div className="mb-4">
            <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#newPropertyModal" onClick={() => { setEditingProperty(null); setNewPropertyName(''); setNewPropertyLocation(''); setNewPropertyPrice(''); setNewPropertyType(''); setNewPropertyStatus(''); setNewPropertyArea(''); setNewPropertyRooms(''); setNewPropertyBathrooms(''); setNewPropertyAvailability('متاحة'); setNewPropertyOwnerName(''); setNewPropertyOwnerPhone(''); setNewPropertyImageUrl(''); setNewPropertyImages([]); setNewPropertyThreeSixtyUrl(''); }}>
              إضافة عقار جديد
            </button>
            <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#newClientModal" onClick={() => { setEditingClient(null); setNewClientName(''); setNewClientPhone(''); setNewClientEmail(''); setNewClientDesiredType(''); setNewClientDesiredStatus(''); setNewClientPreferredLocation(''); setNewClientBudget(''); setNewClientMinArea(''); setNewClientMinRooms(''); setNewClientNotes(''); }}>
              إضافة عميل جديد
            </button>
          </div>
        )}
        {renderView()}
      </main>

      {/* Inspiring Sections */}
      <Newsletter darkMode={darkMode} />

      <NewPropertyModal
        propertyName={newPropertyName}
        setPropertyName={setNewPropertyName}
        propertyLocation={newPropertyLocation}
        setPropertyLocation={setNewPropertyLocation}
        propertyNeighborhood={newPropertyNeighborhood}
        setPropertyNeighborhood={setNewPropertyNeighborhood}
        propertyPrice={newPropertyPrice}
        setPropertyPrice={setNewPropertyPrice}
        propertyType={newPropertyType}
        setPropertyType={setNewPropertyType}
        propertyStatus={newPropertyStatus}
        setPropertyStatus={setNewPropertyStatus}
        propertyArea={newPropertyArea}
        setPropertyArea={setNewPropertyArea}
        propertyRooms={newPropertyRooms}
        setPropertyRooms={setNewPropertyRooms}
        propertyBathrooms={newPropertyBathrooms}
        setPropertyBathrooms={setNewPropertyBathrooms}
        propertyAvailability={newPropertyAvailability}
        setPropertyAvailability={setNewPropertyAvailability}
        propertyOwnerName={newPropertyOwnerName}
        setPropertyOwnerName={setNewPropertyOwnerName}
        propertyOwnerPhone={newPropertyOwnerPhone}
        setPropertyOwnerPhone={setNewPropertyOwnerPhone}
        propertyImageUrl={newPropertyImageUrl}
        setPropertyImageUrl={setNewPropertyImageUrl}
        propertyImages={newPropertyImages}
        setPropertyImages={setNewPropertyImages}
        propertyThreeSixtyUrl={newPropertyThreeSixtyUrl}
        setPropertyThreeSixtyUrl={setNewPropertyThreeSixtyUrl}
        propertyLat={newPropertyLat}
        setPropertyLat={setNewPropertyLat}
        propertyLng={newPropertyLng}
        setPropertyLng={setNewPropertyLng}
        handleAddProperty={handleAddProperty}
        handleUpdateProperty={handleUpdateProperty}
        editingProperty={editingProperty}
      />

      <NewClientModal
        clientName={newClientName}
        setClientName={setNewClientName}
        clientPhone={newClientPhone}
        setClientPhone={setNewClientPhone}
        clientEmail={newClientEmail}
        setClientEmail={setNewClientEmail}
        clientDesiredType={newClientDesiredType}
        setClientDesiredType={setNewClientDesiredType}
        clientDesiredStatus={newClientDesiredStatus}
        setClientDesiredStatus={setNewClientDesiredStatus}
        clientPreferredLocation={newClientPreferredLocation}
        setClientPreferredLocation={setNewClientPreferredLocation}
        clientBudget={newClientBudget}
        setClientBudget={setNewClientBudget}
        clientMinArea={newClientMinArea}
        setClientMinArea={setNewClientMinArea}
        clientMinRooms={newClientMinRooms}
        setClientMinRooms={setNewClientMinRooms}
        clientNotes={newClientNotes}
        setClientNotes={setNewClientNotes}
        handleAddClient={handleAddClient}
        handleUpdateClient={handleUpdateClient}
        editingClient={editingClient}
      />

      <ConfirmModal show={confirmShow} title="تأكيد الحذف" body={`هل متأكد أنك تريد حذف ${confirmPayload?.label || ''}?`} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />

      <ChatWidget />
      <QuickNotes />
      <ScrollToTop />

      <AdminLoginModal 
        adminToken={adminToken} 
        setAdminToken={setAdminToken} 
        adminInfo={adminInfo}
        setAdminInfo={setAdminInfo}
      />

      <ClientLoginModal 
        show={showClientLogin} 
        onClose={() => setShowClientLogin(false)} 
        onLogin={handleClientLogin} 
        onSwitchToAdmin={handleSwitchToAdmin}
      />

      <MortgageCalculator show={showCalculator} onClose={() => setShowCalculator(false)} defaultPrice={calculatorPrice} />
      <CurrencyConverter show={showCurrencyConverter} onClose={() => setShowCurrencyConverter(false)} />
      <ROICalculator show={showROICalculator} onClose={() => setShowROICalculator(false)} defaultPrice={calculatorPrice} />
      
      <ScheduleVisitModal property={visitProperty} onClose={() => setVisitProperty(null)} />

      <PropertyDetailsModal show={!!viewProperty} onClose={() => setViewProperty(null)} property={viewProperty} onScheduleVisit={(p) => { setViewProperty(null); setVisitProperty(p); }} />

      <ThreeSixtyViewer url={threeSixtyUrl} onClose={() => setThreeSixtyUrl(null)} />
    </div>
  );
}

export default App;