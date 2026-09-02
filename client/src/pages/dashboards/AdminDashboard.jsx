import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { API_ENDPOINTS, getAuthHeader } from '../../config/api';
import CustomDropdown from '../../components/common/CustomDropdown';
import { MapPinned, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice, formatDate, formatDateTime, formatTime, formatNumber } from '../../i18n/format';

const AdminDashboard = () => {
    const { t } = useTranslation('dashboards');
    const navigate = useNavigate();
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('customers');
    const [users, setUsers] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [packages, setPackages] = useState([]);
    const [vehicleRequests, setVehicleRequests] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');       // 'user', 'vendor', 'package'
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showRequestDetailsModal, setShowRequestDetailsModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showVerifyVendorConfirm, setShowVerifyVendorConfirm] = useState(false);
    const [vendorToVerify, setVendorToVerify] = useState(null);

    // New state variables for functional sections
    const [offers, setOffers] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [blogPosts, setBlogPosts] = useState([]);
    const [loyaltyUsers, setLoyaltyUsers] = useState([]);
    const [tiers, setTiers] = useState([]);
    const [settings, setSettings] = useState([]);
    const [sectionLoading, setSectionLoading] = useState(false);

    // Form toggle states
    const [showOfferForm, setShowOfferForm] = useState(false);
    const [showCouponForm, setShowCouponForm] = useState(false);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [showTierForm, setShowTierForm] = useState(false);

    // Form data states
    const [offerForm, setOfferForm] = useState({ title: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', applicable_all_vehicles: true });
    const [couponForm, setCouponForm] = useState({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', max_uses: '', valid_until: '' });
    const [blogForm, setBlogForm] = useState({ title: '', content: '', category: '', is_published: false });
    const [tierForm, setTierForm] = useState({ name: '', level: '', min_spending: '', discount_percent: '', color: '#CD7F32' });

    // Vehicle form states
    const [showVehicleForm, setShowVehicleForm] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState(null);
const [vehicleForm, setVehicleForm] = useState({
    name: '', model_name: '', type: 'car', brand: '', registration_number: '',
    engine_number: '', chassis_number: '', cc_engine: '', location: '',
    description: '', availability_status: 'available', is_featured: false, images: '',
    rc_document: '', insurance_document: ''
});

    // File upload states (matching vendor form)
    const [files, setFiles] = useState({ rc_document: null, insurance_document: null, vehicle_images: [] });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (authLoading) {
            return;
        }
        // Check if user is authenticated and is admin
        if (!isAuthenticated || !user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab, navigate, isAuthenticated, user, authLoading]);

    const fetchData = async () => {
        try {
            setLoading(true);

            if (activeTab === 'customers' || activeTab === 'office-staff') {
                const response = await fetch(API_ENDPOINTS.users, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setUsers(data.data.users);
                }
            } else if (activeTab === 'vendors') {
                const response = await fetch(API_ENDPOINTS.vendors, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setVendors(data.data.vendors);
                }
            } else if (activeTab === 'packages') {
                const response = await fetch(API_ENDPOINTS.packages, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setPackages(data.data.packages);
                }
            } else if (activeTab === 'vehicle-requests') {
                // Fetch both vehicle requests and all vehicles for feature management
                const requestsResponse = await fetch(API_ENDPOINTS.vehicleRequests, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const requestsData = await requestsResponse.json();
                if (requestsData.status === 'success') {
                    setVehicleRequests(requestsData.data.requests);
                }

                const vehiclesResponse = await fetch(API_ENDPOINTS.vehicles, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const vehiclesData = await vehiclesResponse.json();
                if (vehiclesData.status === 'success') {
                    setVehicles(vehiclesData.data.vehicles);
                }
            } else if (activeTab === 'bookings-payments') {
                const response = await fetch(API_ENDPOINTS.bookings, {
                    credentials: 'include',
                    headers: { ...getAuthHeader() }
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setBookings(data.data.bookings);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // Fetch data for vehicles tab
    const fetchVehicles = async () => {
        try {
            setSectionLoading(true);
            const response = await fetch(API_ENDPOINTS.vehicles, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setVehicles(data.data.vehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles');
        } finally {
            setSectionLoading(false);
        }
    };

    // Fetch data for offers tab
    const fetchOffers = async () => {
        try {
            setSectionLoading(true);
            const response = await fetch(API_ENDPOINTS.offers, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setOffers(data.data.offers);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            toast.error('Failed to fetch offers');
        } finally {
            setSectionLoading(false);
        }
    };

    // Fetch data for coupons tab
    const fetchCoupons = async () => {
        try {
            setSectionLoading(true);
            const response = await fetch(API_ENDPOINTS.coupons, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setCoupons(data.data.coupons);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to fetch coupons');
        } finally {
            setSectionLoading(false);
        }
    };

    // Fetch data for blog tab
    const fetchBlogPosts = async () => {
        try {
            setSectionLoading(true);
            const response = await fetch(API_ENDPOINTS.blog, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setBlogPosts(data.data.posts);
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            toast.error('Failed to fetch blog posts');
        } finally {
            setSectionLoading(false);
        }
    };

    // Fetch data for loyalty tab
    const fetchLoyaltyData = async () => {
        try {
            setSectionLoading(true);
            const [usersRes, tiersRes] = await Promise.all([
                fetch(API_ENDPOINTS.loyaltyUsers, { credentials: 'include', headers: { ...getAuthHeader() } }),
                fetch(API_ENDPOINTS.loyaltyTiers, { credentials: 'include', headers: { ...getAuthHeader() } })
            ]);
            const usersData = await usersRes.json();
            const tiersData = await tiersRes.json();
            if (usersData.status === 'success') setLoyaltyUsers(usersData.data.users);
            if (tiersData.status === 'success') setTiers(tiersData.data.tiers);
        } catch (error) {
            console.error('Error fetching loyalty data:', error);
            toast.error('Failed to fetch loyalty data');
        } finally {
            setSectionLoading(false);
        }
    };

    // Fetch data for settings tab
    const fetchSettings = async () => {
        try {
            setSectionLoading(true);
            const response = await fetch(API_ENDPOINTS.settings, {
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (data.status === 'success') {
                const settingsObj = data.data.settings || {};
                const settingsArray = Object.entries(settingsObj).map(([key, value]) => ({
                    key,
                    value,
                    label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                    label_ar: key.replace(/_/g, ' ')
                }));
                setSettings(settingsArray);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to fetch settings');
        } finally {
            setSectionLoading(false);
        }
    };

    // useEffect to fetch data when tab changes
    useEffect(() => {
        if (activeTab === 'vehicles') fetchVehicles();
        else if (activeTab === 'offers') fetchOffers();
        else if (activeTab === 'coupons') fetchCoupons();
        else if (activeTab === 'blog') fetchBlogPosts();
        else if (activeTab === 'loyalty') fetchLoyaltyData();
        else if (activeTab === 'settings') fetchSettings();
    }, [activeTab]);

    // Delete handlers
    const handleDeleteVehicle = async (vehicleId) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            const response = await fetch(API_ENDPOINTS.vehicleById(vehicleId), {
                method: 'DELETE',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            if (response.ok) {
                toast.success('Vehicle deleted successfully');
                fetchVehicles();
            } else {
                toast.error('Failed to delete vehicle');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            toast.error('Failed to delete vehicle');
        }
    };

    const handleDeleteOffer = async (offerId) => {
        if (!confirm('Are you sure you want to delete this offer?')) return;
        try {
            const response = await fetch(API_ENDPOINTS.offerById(offerId), {
                method: 'DELETE',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            if (response.ok) {
                toast.success('Offer deleted successfully');
                fetchOffers();
            } else {
                toast.error('Failed to delete offer');
            }
        } catch (error) {
            console.error('Error deleting offer:', error);
            toast.error('Failed to delete offer');
        }
    };

    const handleToggleOffer = async (offerId) => {
        try {
            const response = await fetch(API_ENDPOINTS.toggleOffer(offerId), {
                method: 'PATCH',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Offer status updated');
                fetchOffers();
            } else {
                toast.error(data.message || 'Failed to toggle offer');
            }
        } catch (error) {
            console.error('Error toggling offer:', error);
            toast.error('Failed to toggle offer');
        }
    };

    const handleCreateOffer = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.offers, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(offerForm)
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Offer created successfully');
                setShowOfferForm(false);
                setOfferForm({ title: '', discount_type: 'percentage', discount_value: '', start_date: '', end_date: '', applicable_all_vehicles: true });
                fetchOffers();
            } else {
                toast.error(data.message || 'Failed to create offer');
            }
        } catch (error) {
            console.error('Error creating offer:', error);
            toast.error('Failed to create offer');
        }
    };

    const resetVehicleForm = () => {
        setVehicleForm({
            name: '', model_name: '', type: 'car', brand: '', registration_number: '',
            engine_number: '', chassis_number: '', cc_engine: '', location: '',
            description: '', availability_status: 'available', is_featured: false, images: ''
        });
        setShowVehicleForm(false);
        setEditingVehicle(null);
        setFiles({ rc_document: null, insurance_document: null, vehicle_images: [] });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (name === 'vehicle_images') {
            if (selectedFiles.length > 5) {
                toast.warning('Maximum 5 images allowed');
                return;
            }
            const valid = Array.from(selectedFiles).filter(f => f.size <= 10 * 1024 * 1024);
            setFiles(prev => ({ ...prev, vehicle_images: valid }));
        } else {
            const file = selectedFiles[0];
            if (file && file.size > 10 * 1024 * 1024) {
                toast.warning('File size must be less than 1MB');
                return;
            }
            setFiles(prev => ({ ...prev, [name]: file || null }));
        }
    };

    const handleEditVehicle = (vehicle) => {
        setVehicleForm({
            name: vehicle.name || '',
            model_name: vehicle.model_name || '',
            type: vehicle.type || 'car',
            brand: vehicle.brand || '',
            registration_number: vehicle.registration_number || '',
            engine_number: vehicle.engine_number || '',
            chassis_number: vehicle.chassis_number || '',
            cc_engine: vehicle.cc_engine || '',
            location: vehicle.location || '',
            description: vehicle.description || '',
            availability_status: vehicle.availability_status || 'available',
            is_featured: vehicle.is_featured || false,
            images: vehicle.images ? vehicle.images.join(', ') : ''
        });
        setEditingVehicle(vehicle._id);
        setShowVehicleForm(true);
        setFiles({ rc_document: null, insurance_document: null, vehicle_images: [] });
    };

    const handleSaveVehicle = async () => {
        try {
            setUploading(true);
            const uploaded = {};

            // Upload RC document
            if (files.rc_document) {
                const rcFormData = new FormData();
                rcFormData.append('file', files.rc_document);
                const rcRes = await fetch(API_ENDPOINTS.uploadFile, { method: 'POST', body: rcFormData });
                const rcData = await rcRes.json();
                if (rcData.status === 'success') uploaded.rc_document = rcData.data.url;
            }

            // Upload insurance document
            if (files.insurance_document) {
                const insFormData = new FormData();
                insFormData.append('file', files.insurance_document);
                const insRes = await fetch(API_ENDPOINTS.uploadFile, { method: 'POST', body: insFormData });
                const insData = await insRes.json();
                if (insData.status === 'success') uploaded.insurance_document = insData.data.url;
            }

            // Upload images
            if (files.vehicle_images.length > 0) {
                const imgFormData = new FormData();
                files.vehicle_images.forEach(f => imgFormData.append('files', f));
                const imgRes = await fetch(API_ENDPOINTS.uploadFiles, { method: 'POST', body: imgFormData });
                const imgData = await imgRes.json();
                if (imgData.status === 'success') uploaded.vehicle_images = imgData.data.files.map(f => f.url);
            }

            const payload = {
                ...vehicleForm,
                cc_engine: vehicleForm.cc_engine ? Number(vehicleForm.cc_engine) : undefined,
                images: uploaded.vehicle_images || (vehicleForm.images ? vehicleForm.images.split(',').map(s => s.trim()).filter(Boolean) : []),
                is_featured: Boolean(vehicleForm.is_featured),
                ...(uploaded.rc_document && { rc_document: uploaded.rc_document }),
                ...(uploaded.insurance_document && { insurance_document: uploaded.insurance_document })
            };

            const url = editingVehicle ? API_ENDPOINTS.vehicleById(editingVehicle) : API_ENDPOINTS.vehicles;
            const method = editingVehicle ? 'PATCH' : 'POST';
            const response = await fetch(url, {
                method,
                credentials: 'include',
                headers: { ...getAuthHeader() },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok && (data.status === 'success' || data.status === undefined)) {
                toast.success(editingVehicle ? 'Vehicle updated successfully' : 'Vehicle created successfully');
                resetVehicleForm();
                fetchVehicles();
            } else {
                toast.error(data.message || 'Failed to save vehicle');
            }
        } catch (error) {
            console.error('Error saving vehicle:', error);
            toast.error('Failed to save vehicle');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const response = await fetch(API_ENDPOINTS.couponById(couponId), {
                method: 'DELETE',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            if (response.ok) {
                toast.success('Coupon deleted successfully');
                fetchCoupons();
            } else {
                toast.error('Failed to delete coupon');
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            toast.error('Failed to delete coupon');
        }
    };

    const handleCreateCoupon = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.coupons, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(couponForm)
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Coupon created successfully');
                setShowCouponForm(false);
                setCouponForm({ code: '', discount_type: 'percentage', discount_value: '', min_order_value: '', max_uses: '', valid_until: '' });
                fetchCoupons();
            } else {
                toast.error(data.message || 'Failed to create coupon');
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            toast.error('Failed to create coupon');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const response = await fetch(API_ENDPOINTS.blogById(postId), {
                method: 'DELETE',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            if (response.ok) {
                toast.success('Post deleted successfully');
                fetchBlogPosts();
            } else {
                toast.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Failed to delete post');
        }
    };

    const handleTogglePublish = async (postId) => {
        try {
            const response = await fetch(API_ENDPOINTS.togglePublishPost(postId), {
                method: 'PATCH',
                credentials: 'include',
                headers: { ...getAuthHeader() }
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Post status updated');
                fetchBlogPosts();
            } else {
                toast.error(data.message || 'Failed to toggle publish status');
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
            toast.error('Failed to toggle publish status');
        }
    };

    const handleCreatePost = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.blog, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(blogForm)
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Post created successfully');
                setShowBlogForm(false);
                setBlogForm({ title: '', content: '', category: '', is_published: false });
                fetchBlogPosts();
            } else {
                toast.error(data.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post');
        }
    };

    const handleCreateTier = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.loyaltyTiers, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify(tierForm)
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Tier created successfully');
                setShowTierForm(false);
                setTierForm({ name: '', level: '', min_spending: '', discount_percent: '', color: '#CD7F32' });
                fetchLoyaltyData();
            } else {
                toast.error(data.message || 'Failed to create tier');
            }
        } catch (error) {
            console.error('Error creating tier:', error);
            toast.error('Failed to create tier');
        }
    };

    const handleSaveSetting = async (key, value) => {
        try {
            const response = await fetch(API_ENDPOINTS.settingByKey(key), {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
                body: JSON.stringify({ value })
            });
            const data = await response.json();
            if (response.ok && data.status === 'success') {
                toast.success('Setting updated successfully');
                fetchSettings();
            } else {
                toast.error(data.message || 'Failed to update setting');
            }
        } catch (error) {
            console.error('Error updating setting:', error);
            toast.error('Failed to update setting');
        }
    };

    const getFilteredUsers = () => {
        if (activeTab === 'customers') {
            return users.filter(user => user.role === 'user');
        } else if (activeTab === 'office-staff') {
            return users.filter(user => user.role === 'office_staff');
        } else if (activeTab === 'vendors') {
            return users.filter(user => user.role === 'vendor');
        }
        return [];
    };

    const handleCreate = () => {
        setEditingItem(null);
        if (activeTab === 'packages') {
            setModalType('package');
        } else {
            setModalType('user');
        }
        setShowModal(true);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        if (activeTab === 'packages') {
            setModalType('package');
        } else if (activeTab === 'vendors') {
            // Find the vendor details
            const vendorDetails = vendors.find(v => v.user_id === item._id);
            setEditingItem({ ...item, vendorDetails });
            setModalType('vendor');
        } else {
            setModalType('user');
        }
        setShowModal(true);
    };

    const handleDelete = (item) => {
        setDeleteTarget(item);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            let endpoint;
            if (activeTab === 'packages') {
                endpoint = `${API_ENDPOINTS.packageById(deleteTarget._id)}`;
            } else if (activeTab === 'vendors') {
                // Delete vendor directly
                endpoint = `${API_ENDPOINTS.vendorById(deleteTarget._id)}`;
            } else {
                endpoint = `${API_ENDPOINTS.users}/${deleteTarget._id}`;
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setShowDeleteConfirm(false);
                setDeleteTarget(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete. Please try again.');
        }
    };

    const handleVerifyVendor = (vendor) => {
        setVendorToVerify(vendor);
        setShowVerifyVendorConfirm(true);
    };

    const confirmVerifyVendor = async () => {
        if (!vendorToVerify) return;
        
        try {
            const response = await fetch(API_ENDPOINTS.verifyVendor(vendorToVerify._id), {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader()
                },
                credentials: 'include'
            });

            if (response.ok) {
                toast.success('Vendor verified successfully!');
                setShowVerifyVendorConfirm(false);
                setVendorToVerify(null);
                fetchData();
            }
        } catch (error) {
            console.error('Error verifying vendor:', error);
            toast.error('Failed to verify vendor. Please try again.');
        }
    };

    const handleViewVendorDetails = (vendor) => {
        setSelectedVendor(vendor);
        setShowVendorDetailsModal(true);
    };

    const handleViewRequestDetails = (request) => {
        setSelectedRequest(request);
        setShowRequestDetailsModal(true);
    };

    const handleApproveRequest = async (requestId) => {
        try {
            const response = await fetch(API_ENDPOINTS.approveVehicleRequest(requestId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                credentials: 'include',
                body: JSON.stringify({})
            });

            if (response.ok) {
                toast.success('Vehicle request approved successfully!');
                setShowRequestDetailsModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error approving request:', error);
            toast.error('Failed to approve request. Please try again.');
        }
    };

    const handleRejectRequest = async (requestId) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        try {
            const response = await fetch(API_ENDPOINTS.rejectVehicleRequest(requestId), {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                credentials: 'include',
                body: JSON.stringify({ rejection_reason: reason })
            });

            if (response.ok) {
                toast.success('Vehicle request rejected.');
                setShowRequestDetailsModal(false);
                fetchData();
            }
        } catch (error) {
            console.error('Error rejecting request:', error);
            toast.error('Failed to reject request. Please try again.');
        }
    };

    const handleToggleFeature = async (vehicleId) => {
        try {
            const response = await fetch(API_ENDPOINTS.toggleFeatureVehicle(vehicleId), {
                method: 'PATCH',
                headers: {
                    ...getAuthHeader()
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.status === 'success') {
                toast.success('Vehicle feature status updated successfully!');
                fetchData();
            } else {
                toast.error(data.message || 'Failed to toggle feature status. Please try again.');
            }
        } catch (error) {
            console.error('Error toggling feature:', error);
            toast.error('Failed to toggle feature status. Please try again.');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-600 text-lg font-medium">{t('loading.dashboard')}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    {/* Mobile and Desktop Layout */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                        <div className="flex items-center justify-between md:justify-start mb-6">
                            <div className="flex items-center space-x-2 group">
                                <div className="bg-linear-to-r from-primary-500 to-secondary-600 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
                                    <MapPinned className='w-6 h-6 text-white' />
                                </div>
                                <div className='flex flex-col'>
                                    <span className="text-xl md:text-2xl font-display font-bold bg-linear-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                        Alrafgha Group
                                    </span>
                                    <p className='text-xs text-gray-500 font-medium -mt-1'>
                                        {t('common:brandTagline')} <span className='text-red-500 font-bold'>~</span>
                                    </p>
                                </div>

                            </div>
                            {/* Logout button - visible on mobile only */}
                            <button
                                onClick={handleLogout}
                                className="md:hidden px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-sm font-medium flex items-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>

                        {/* Title - Center */}
                        <div className='text-center md:flex-1'>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{t('title.admin')} <span className='text-red-600'>{t('title.dashboard')}</span></h1>
                            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-600">{t('subtitle.admin')}</p>
                        </div>

                        {/* Logout button - visible on desktop only */}
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-secondary-500 transition-colors text-sm font-medium items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {t('common:auth.logout')}
                        </button>
                    </div>
                </div>

                {/* Tabs - Horizontal on Mobile, Vertical on Desktop */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Mobile Horizontal Tabs */}
                    <div className="md:hidden bg-white border border-primary-200 rounded-lg shadow-sm overflow-x-auto">
                        <nav className="flex -mb-px min-w-max">
                            <button
                                onClick={() => setActiveTab('customers')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'customers'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-customers"
                            >
                                {t('tabs.customers')}
                            </button>
                            <button
                                onClick={() => setActiveTab('office-staff')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'office-staff'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-office-staff"
                            >
                                {t('tabs.officeStaff')}
                            </button>
                            <button
                                onClick={() => setActiveTab('vendors')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vendors'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-vendors"
                            >
                                {t('tabs.vendors')}
                            </button>
                            <button
                                onClick={() => setActiveTab('packages')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'packages'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-packages"
                            >
                                {t('tabs.packages')}
                            </button>
                            <button
                                onClick={() => setActiveTab('vehicle-requests')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vehicle-requests'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-vehicle-requests"
                            >
                                {t('tabs.vehicleRequests')}
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings-payments')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'bookings-payments'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-bookings-payments"
                            >
                                {t('tabs.bookingsPayments')}
                            </button>
                            <button
                                onClick={() => setActiveTab('vehicles')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vehicles'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-vehicles"
                            >
                                {t('tabs.vehicles')}
                            </button>
                            <button
                                onClick={() => setActiveTab('offers')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'offers'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-offers"
                            >
                                {t('tabs.offers')}
                            </button>
                            <button
                                onClick={() => setActiveTab('coupons')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'coupons'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-coupons"
                            >
                                {t('tabs.coupons')}
                            </button>
                            <button
                                onClick={() => setActiveTab('blog')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'blog'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-blog"
                            >
                                {t('tabs.blog')}
                            </button>
                            <button
                                onClick={() => setActiveTab('loyalty')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'loyalty'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-loyalty"
                            >
                                {t('tabs.loyalty')}
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'settings'
                                    ? 'border-red-500 text-red-600 bg-red-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                data-testid="tab-settings"
                            >
                                {t('tabs.settings')}
                            </button>
                        </nav>
                    </div>

                    {/* Desktop Vertical Sidebar */}
                    <aside className="hidden md:block md:w-60 shrink-0">
                        <div className="bg-white border border-primary-200 rounded-lg shadow-sm overflow-hidden sticky top-4">
                            <nav className="flex flex-col">
                                <button
                                    onClick={() => setActiveTab('customers')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'customers'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-customers"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {t('tabs.customers')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('office-staff')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'office-staff'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-office-staff"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t('tabs.officeStaff')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('vendors')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'vendors'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-vendors"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    {t('tabs.vendors')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('packages')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'packages'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-packages"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    {t('tabs.packages')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('vehicle-requests')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'vehicle-requests'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-vehicle-requests"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    {t('tabs.vehicleRequests')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookings-payments')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'bookings-payments'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-bookings-payments"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                    </svg>
                                    {t('tabs.bookingsPayments')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('vehicles')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'vehicles'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-vehicles"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4.5h11.2a2 2 0 011.9 1.5L21 11M3 11v6a1 1 0 001 1h1a1 1 0 001-1v-1h12v1a1 1 0 001 1h1a1 1 0 001-1v-6M3 11h18" />
                                    </svg>
                                    {t('tabs.vehicles')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('offers')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'offers'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-offers"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {t('tabs.offers')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('coupons')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'coupons'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-coupons"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                    </svg>
                                    {t('tabs.coupons')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('blog')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'blog'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-blog"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                    {t('tabs.blog')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('loyalty')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'loyalty'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-loyalty"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                    {t('tabs.loyalty')}
                                </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`px-6 py-4 text-sm font-medium border-l-4 transition-all text-left ${activeTab === 'settings'
                                        ? 'border-red-500 text-red-600 bg-red-50'
                                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    data-testid="tab-settings"
                                >
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {t('tabs.settings')}
                                </div>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        {/* Action Button */}
                        {(activeTab === 'office-staff' || activeTab === 'packages') && (
                            <div className="mb-6">
                                <button
                                    onClick={handleCreate}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                                    data-testid="add-button"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {activeTab === 'office-staff' ? t('actions.addOfficeStaff') : t('actions.createPackage')}
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                            </div>
                        ) : (
                            <>
                                {/* Users Table (Customers, Office Staff) */}
                                {(activeTab === 'customers' || activeTab === 'office-staff') && (
                                    <UsersTable
                                        users={getFilteredUsers()}
                                        vendors={[]}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        type={activeTab}
                                        onViewVendorDetails={handleViewVendorDetails}
                                        onVerifyVendor={handleVerifyVendor}
                                    />
                                )}

                                {/* Vendors Table */}
                                {activeTab === 'vendors' && (
                                    <VendorsTable
                                        vendors={vendors}
                                        onViewVendorDetails={handleViewVendorDetails}
                                        onVerifyVendor={handleVerifyVendor}
                                        onDelete={handleDelete}
                                    />
                                )}

                                {/* Packages Table */}
                                {activeTab === 'packages' && (
                                    <PackagesTable
                                        packages={packages}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                )}

                                {/* Vehicle Requests Table */}
                                {activeTab === 'vehicle-requests' && (
                                    <VehicleRequestsTable
                                        requests={vehicleRequests}
                                        vehicles={vehicles}
                                        onViewDetails={handleViewRequestDetails}
                                        onToggleFeature={handleToggleFeature}
                                    />
                                )}

                                {/* Bookings & Payments Table */}
                                {activeTab === 'bookings-payments' && (
                                    <BookingsPaymentsTable
                                        bookings={bookings}
                                    />
                                )}

                                {/* Vehicles Tab */}
                                {activeTab === 'vehicles' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Vehicle Management</h2>
                                            <button
                                                onClick={() => { resetVehicleForm(); setShowVehicleForm(!showVehicleForm); }}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                            >
                                                {showVehicleForm ? 'Cancel' : 'Add Vehicle'}
                                            </button>
                                        </div>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {(showVehicleForm || editingVehicle) && (
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.name}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Vehicle name"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Model Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.model_name}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, model_name: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Model name"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                                                <select
                                                                    value={vehicleForm.type}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                >
                                                                    <option value="car">Car</option>
                                                                    <option value="bike">Bike</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.brand}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, brand: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Brand"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.registration_number}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, registration_number: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Registration number"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.engine_number}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, engine_number: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Engine number"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.chassis_number}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, chassis_number: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Chassis number"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">CC Engine</label>
                                                                <input
                                                                    type="number"
                                                                    value={vehicleForm.cc_engine}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, cc_engine: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 150"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                                <input
                                                                    type="text"
                                                                    value={vehicleForm.location}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, location: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Location"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                                                <select
                                                                    value={vehicleForm.availability_status}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, availability_status: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                >
                                                                    <option value="available">Available</option>
                                                                    <option value="booked">Booked</option>
                                                                    <option value="maintenance">Maintenance</option>
                                                                </select>
                                                            </div>
                                                            <div className="flex items-center pt-6">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={vehicleForm.is_featured}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, is_featured: e.target.checked })}
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                                />
                                                                <label className="ml-2 text-sm text-gray-700">Featured</label>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">RC Document <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="file"
                                                                    name="rc_document"
                                                                    accept="image/*,application/pdf"
                                                                    onChange={handleFileChange}
                                                                    required
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />

                                                                     <div className="mt-1">
<img src={files.rc_document ? URL.createObjectURL(files.rc_document) : ''} className="h-16 w-20 object-cover rounded border" alt="rc preview" />
                                                                          <p className="text-xs text-gray-500 mt-1">{files.rc_document ? files.rc_document.name : ''}</p>
                                                                     </div>
                                                                 )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Document <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="file"
                                                                    name="insurance_document"
                                                                    accept="image/*,application/pdf"
                                                                    onChange={handleFileChange}
                                                                    required
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />

                                                                     <div className="mt-1">
<img src={files.insurance_document ? URL.createObjectURL(files.insurance_document) : ''} className="h-16 w-20 object-cover rounded border" alt="insurance preview" />
                                                                          <p className="text-xs text-gray-500 mt-1">{files.insurance_document ? files.insurance_document.name : ''}</p>
                                                                     </div>
                                                                 )}
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Images <span className="text-red-500">*</span> <span className="text-xs text-gray-500">max 5</span></label>
                                                                <input
                                                                    type="file"
                                                                    name="vehicle_images"
                                                                    accept="image/*"
                                                                    multiple
                                                                    onChange={handleFileChange}
                                                                    required
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />

                                                                     <div className="flex gap-2 mt-2 flex-wrap">
                                                                         {files.vehicle_images.map((f, i) => (
                                                                             <div key={i} className="relative">
                                                                                 <img src={f ? URL.createObjectURL(f) : ''} className="h-16 w-20 object-cover rounded border" alt={`preview ${i}`} />
                                                                             </div>
                                                                         ))}
                                                                     </div>
                                                                 )}
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                                <textarea
                                                                    value={vehicleForm.description}
                                                                    onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Vehicle description"
                                                                    rows="2"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-end gap-3">
                                                            <button
                                                                onClick={resetVehicleForm}
                                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleSaveVehicle}
                                                                disabled={uploading}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {uploading ? 'Uploading...' : (editingVehicle ? 'Update Vehicle' : 'Create Vehicle')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Total Vehicles</p>
                                                        <p className="text-2xl font-bold text-gray-900">{vehicles.length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Available</p>
                                                        <p className="text-2xl font-bold text-green-600">{vehicles.filter(v => v.availability_status === 'available').length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">On Rent</p>
                                                        <p className="text-2xl font-bold text-blue-600">{vehicles.filter(v => v.availability_status === 'booked').length}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                                    <div className="overflow-x-auto custom-scrollbar">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {vehicles.map((vehicle) => (
                                                                    <tr key={vehicle._id} className="hover:bg-gray-50">
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm font-medium text-gray-900">{vehicle.name}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{vehicle.brand || vehicle.brand_name || '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{vehicle.type || vehicle.vehicle_type || '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{vehicle.location || vehicle.city || '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.availability_status === 'available' ? 'bg-green-100 text-green-800' : vehicle.availability_status === 'booked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                                {vehicle.availability_status || 'unknown'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{vehicle.is_featured ? '⭐' : '—'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                                            <button
                                                                                onClick={() => handleEditVehicle(vehicle)}
                                                                                className="text-blue-600 hover:text-blue-900"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeleteVehicle(vehicle._id)}
                                                                                className="text-red-600 hover:text-red-900"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                            <button
                                                                                onClick={async () => {
                                                                                    try {
                                                                                        const res = await fetch(API_ENDPOINTS.toggleFeatureVehicle(vehicle._id), {
                                                                                            method: 'PATCH',
                                                                                            credentials: 'include',
                                                                                            headers: { ...getAuthHeader() }
                                                                                        });
                                                                                        if (res.ok) {
                                                                                            toast.success('Feature status toggled');
                                                                                            fetchVehicles();
                                                                                        } else {
                                                                                            toast.error('Failed to toggle feature');
                                                                                        }
                                                                                    } catch (err) {
                                                                                        console.error('Error toggling feature:', err);
                                                                                        toast.error('Failed to toggle feature');
                                                                                    }
                                                                                }}
                                                                                className="text-yellow-600 hover:text-yellow-900"
                                                                            >
                                                                                Toggle Feature
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {vehicles.length === 0 && (
                                                        <div className="p-8 text-center">
                                                            <p className="text-gray-500">No vehicles found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Offers Tab */}
                                {activeTab === 'offers' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Offers Management</h2>
                                            <button
                                                onClick={() => setShowOfferForm(!showOfferForm)}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                            >
                                                {showOfferForm ? 'Cancel' : 'Add Offer'}
                                            </button>
                                        </div>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {showOfferForm && (
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Create New Offer</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={offerForm.title}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Offer title"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                                                <select
                                                                    value={offerForm.discount_type}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, discount_type: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                >
                                                                    <option value="percentage">Percentage</option>
                                                                    <option value="fixed">Fixed Amount</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                                                                <input
                                                                    type="number"
                                                                    value={offerForm.discount_value}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, discount_value: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 10"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={offerForm.start_date}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, start_date: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                                                <input
                                                                    type="date"
                                                                    value={offerForm.end_date}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, end_date: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={offerForm.applicable_all_vehicles}
                                                                    onChange={(e) => setOfferForm({ ...offerForm, applicable_all_vehicles: e.target.checked })}
                                                                    className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                                />
                                                                <label className="ml-2 text-sm text-gray-700">Applicable to all vehicles</label>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={handleCreateOffer}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                            >
                                                                Create Offer
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Active Offers</p>
                                                        <p className="text-2xl font-bold text-gray-900">{offers.filter(o => { const now = new Date(); const start = new Date(o.start_date); const end = new Date(o.end_date); return o.is_active && now >= start && now <= end; }).length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Upcoming</p>
                                                        <p className="text-2xl font-bold text-yellow-600">{offers.filter(o => { const now = new Date(); const start = new Date(o.start_date); return now < start; }).length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Expired</p>
                                                        <p className="text-2xl font-bold text-red-600">{offers.filter(o => { const now = new Date(); const end = new Date(o.end_date); return now > end; }).length}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                                    <div className="overflow-x-auto custom-scrollbar">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {offers.map((offer) => {
                                                                    const now = new Date();
                                                                    const start = new Date(offer.start_date);
                                                                    const end = new Date(offer.end_date);
                                                                    const status = now < start ? 'upcoming' : now > end ? 'expired' : 'active';
                                                                    return (
                                                                        <tr key={offer._id} className="hover:bg-gray-50">
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm text-gray-600">{offer.discount_value}{offer.discount_type === 'percentage' ? '%' : ''}</div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm text-gray-600 capitalize">{offer.discount_type}</div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <div className="text-sm text-gray-600">{formatDate(offer.start_date)} - {formatDate(offer.end_date)}</div>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : status === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                                                    {status}
                                                                                </span>
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                                                <button
                                                                                    onClick={() => handleToggleOffer(offer._id)}
                                                                                    className="text-blue-600 hover:text-blue-900"
                                                                                >
                                                                                    {offer.is_active ? 'Deactivate' : 'Activate'}
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleDeleteOffer(offer._id)}
                                                                                    className="text-red-600 hover:text-red-900"
                                                                                >
                                                                                    Delete
                                                                 </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {offers.length === 0 && (
                                                        <div className="p-8 text-center">
                                                            <p className="text-gray-500">No offers found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Coupons Tab */}
                                {activeTab === 'coupons' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Coupons Management</h2>
                                            <button
                                                onClick={() => setShowCouponForm(!showCouponForm)}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                            >
                                                {showCouponForm ? 'Cancel' : 'Add Coupon'}
                                            </button>
                                        </div>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {showCouponForm && (
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                                                                <input
                                                                    type="text"
                                                                    value={couponForm.code}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., SAVE10"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                                                                <select
                                                                    value={couponForm.discount_type}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                >
                                                                    <option value="percentage">Percentage</option>
                                                                    <option value="fixed">Fixed Amount</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value</label>
                                                                <input
                                                                    type="number"
                                                                    value={couponForm.discount_value}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, discount_value: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 10"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Value</label>
                                                                <input
                                                                    type="number"
                                                                    value={couponForm.min_order_value}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, min_order_value: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 100"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Uses</label>
                                                                <input
                                                                    type="number"
                                                                    value={couponForm.max_uses}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 100"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                                                                <input
                                                                    type="date"
                                                                    value={couponForm.valid_until}
                                                                    onChange={(e) => setCouponForm({ ...couponForm, valid_until: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={handleCreateCoupon}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                            >
                                                                Create Coupon
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Total Coupons</p>
                                                        <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Active</p>
                                                        <p className="text-2xl font-bold text-green-600">{coupons.filter(c => c.is_active !== false).length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Redeemed</p>
                                                        <p className="text-2xl font-bold text-purple-600">{coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                                    <div className="overflow-x-auto custom-scrollbar">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Order</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {coupons.map((coupon) => (
                                                                    <tr key={coupon._id} className="hover:bg-gray-50">
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm font-medium text-gray-900 font-mono">{coupon.code}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{coupon.discount_value}{coupon.discount_type === 'percentage' ? '%' : ''}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{coupon.min_order_value ? formatPrice(coupon.min_order_value) : '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{coupon.used_count || 0} / {coupon.max_uses || '∞'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{coupon.valid_until ? formatDate(coupon.valid_until) : '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                            <button
                                                                                onClick={() => handleDeleteCoupon(coupon._id)}
                                                                                className="text-red-600 hover:text-red-900"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {coupons.length === 0 && (
                                                        <div className="p-8 text-center">
                                                            <p className="text-gray-500">No coupons found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Blog Tab */}
                                {activeTab === 'blog' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Blog Management</h2>
                                            <button
                                                onClick={() => setShowBlogForm(!showBlogForm)}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                            >
                                                {showBlogForm ? 'Cancel' : 'Add Post'}
                                            </button>
                                        </div>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {showBlogForm && (
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={blogForm.title}
                                                                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Post title"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                                                <textarea
                                                                    value={blogForm.content}
                                                                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                                                    rows={4}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="Write your post content..."
                                                                />
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                                                    <input
                                                                        type="text"
                                                                        value={blogForm.category}
                                                                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                        placeholder="e.g., News, Tips"
                                                                    />
                                                                </div>
                                                                <div className="flex items-center pt-6">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={blogForm.is_published}
                                                                        onChange={(e) => setBlogForm({ ...blogForm, is_published: e.target.checked })}
                                                                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                                                                    />
                                                                    <label className="ml-2 text-sm text-gray-700">Publish immediately</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={handleCreatePost}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                            >
                                                                Create Post
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Total Posts</p>
                                                        <p className="text-2xl font-bold text-gray-900">{blogPosts.length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Published</p>
                                                        <p className="text-2xl font-bold text-green-600">{blogPosts.filter(p => p.is_published).length}</p>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <p className="text-sm text-gray-500">Drafts</p>
                                                        <p className="text-2xl font-bold text-orange-600">{blogPosts.filter(p => !p.is_published).length}</p>
                                                    </div>
                                                </div>
                                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                                    <div className="overflow-x-auto custom-scrollbar">
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="bg-white divide-y divide-gray-200">
                                                                {blogPosts.map((post) => (
                                                                    <tr key={post._id} className="hover:bg-gray-50">
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{post.category || '-'}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                                {post.is_published ? 'Published' : 'Draft'}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="text-sm text-gray-600">{formatDate(post.createdAt)}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                                            <button
                                                                                onClick={() => handleTogglePublish(post._id)}
                                                                                className="text-blue-600 hover:text-blue-900"
                                                                            >
                                                                                {post.is_published ? 'Unpublish' : 'Publish'}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleDeletePost(post._id)}
                                                                                className="text-red-600 hover:text-red-900"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    {blogPosts.length === 0 && (
                                                        <div className="p-8 text-center">
                                                            <p className="text-gray-500">No blog posts found</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Loyalty Tab */}
                                {activeTab === 'loyalty' && (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold">Loyalty Program</h2>
                                            <button
                                                onClick={() => setShowTierForm(!showTierForm)}
                                                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                            >
                                                {showTierForm ? 'Cancel' : 'Add Tier'}
                                            </button>
                                        </div>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {showTierForm && (
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Create New Tier</h3>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Tier Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={tierForm.name}
                                                                    onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., Gold"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                                                                <input
                                                                    type="number"
                                                                    value={tierForm.level}
                                                                    onChange={(e) => setTierForm({ ...tierForm, level: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 3"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Spending</label>
                                                                <input
                                                                    type="number"
                                                                    value={tierForm.min_spending}
                                                                    onChange={(e) => setTierForm({ ...tierForm, min_spending: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 5000"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percent</label>
                                                                <input
                                                                    type="number"
                                                                    value={tierForm.discount_percent}
                                                                    onChange={(e) => setTierForm({ ...tierForm, discount_percent: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                                    placeholder="e.g., 15"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                                                <input
                                                                    type="color"
                                                                    value={tierForm.color}
                                                                    onChange={(e) => setTierForm({ ...tierForm, color: e.target.value })}
                                                                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 flex justify-end">
                                                            <button
                                                                onClick={handleCreateTier}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                                            >
                                                                Create Tier
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Tiers</h3>
                                                        <div className="space-y-3">
                                                            {tiers.map((tier) => (
                                                                <div key={tier._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tier.color || '#CD7F32' }}></div>
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{tier.name}</p>
                                                                            <p className="text-xs text-gray-500">Level {tier.level} | Min: {formatPrice(tier.min_spending)}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-sm font-medium text-gray-600">{tier.discount_percent}%</span>
                                                                </div>
                                                            ))}
                                                            {tiers.length === 0 && (
                                                                <p className="text-gray-500 text-sm">No tiers configured</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-lg shadow p-6">
                                                        <h3 className="text-lg font-semibold mb-4">Top Members</h3>
                                                        <div className="space-y-3">
                                                            {loyaltyUsers.slice(0, 10).map((userEntry) => (
                                                                <div key={userEntry._id || userEntry.user_id?._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                    <div>
                                                                        <p className="font-medium text-gray-900">{userEntry.user_id?.name || userEntry.name || 'Unknown'}</p>
                                                                        <p className="text-xs text-gray-500">{userEntry.user_id?.email || userEntry.email || '-'}</p>
                                                                    </div>
                                                                    <span className="text-sm font-bold text-primary-600">{userEntry.points || 0} pts</span>
                                                                </div>
                                                            ))}
                                                            {loyaltyUsers.length === 0 && (
                                                                <p className="text-gray-500 text-sm">No loyalty members yet</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Settings Tab */}
                                {activeTab === 'settings' && (
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold">Site Settings</h2>
                                        {sectionLoading ? (
                                            <div className="flex justify-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-lg shadow p-6">
                                                <div className="space-y-4">
                                                    {settings.map((setting) => (
                                                        <SettingRow
                                                            key={setting._id || setting.key}
                                                            setting={setting}
                                                            onSave={handleSaveSetting}
                                                        />
                                                    ))}
                                                    {settings.length === 0 && (
                                                        <p className="text-gray-500 text-sm">No settings found</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <Modal
                    type={modalType}
                    item={editingItem}
                    onClose={() => {
                        setShowModal(false);
                        setEditingItem(null);
                    }}
                    onSuccess={() => {
                        setShowModal(false);
                        setEditingItem(null);
                        fetchData();
                    }}
                    userRole={activeTab === 'office-staff' ? 'office_staff' : activeTab === 'vendors' ? 'vendor' : 'user'}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <DeleteConfirmModal
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteConfirm(false);
                        setDeleteTarget(null);
                    }}
                />
            )}

            {/* Vendor Details Modal */}
            {showVendorDetailsModal && selectedVendor && (
                <VendorDetailsModal
                    vendor={selectedVendor}
                    onClose={() => setShowVendorDetailsModal(false)}
                />
            )}

            {/* Vehicle Request Details Modal */}
            {showRequestDetailsModal && selectedRequest && (
                <VehicleRequestDetailsModal
                    request={selectedRequest}
                    onClose={() => setShowRequestDetailsModal(false)}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                />
            )}

            {/* Vendor Verification Confirmation Modal */}
            {showVerifyVendorConfirm && vendorToVerify && (
                <VendorVerifyConfirmModal
                    vendor={vendorToVerify}
                    onConfirm={confirmVerifyVendor}
                    onCancel={() => {
                        setShowVerifyVendorConfirm(false);
                        setVendorToVerify(null);
                    }}
                />
            )}
        </div>
    );
};

// Users Table Component
const UsersTable = ({ users, vendors, onEdit, onDelete, type, onViewVendorDetails, onVerifyVendor }) => {
    const { t } = useTranslation('dashboards');
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">{type === 'customers' ? t('empty.customers') : type === 'office-staff' ? t('empty.officeStaff') : t('empty.vendors')}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.email')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.phone')}</th>
                                {type === 'vendors' && (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.company')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.status')}</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.joined')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => {
                            const vendorDetails = type === 'vendors' ? vendors.find(v => v.email === user.email) : null;
                            return (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{user.phone || t('na')}</div>
                                    </td>
                                    {type === 'vendors' && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">{vendorDetails?.company_name || t('na')}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendorDetails?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                            {vendorDetails?.is_verified ? t('status.verified') : t('status.pending')}
                        </span>
                                            </td>
                                        </>
                                    )}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {formatDate(user.date_joined)}
            </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        {type === 'vendors' && vendorDetails && (
                                            <>
                        <button
                            onClick={() => onViewVendorDetails(vendorDetails)}
                            className="text-indigo-600 hover:text-indigo-900"
                        >
                            {t('actions.view')}
                        </button>
                                                {!vendorDetails.is_verified && (
                                <button
                                    onClick={() => onVerifyVendor(vendorDetails)}
                                    className="text-green-600 hover:text-green-900"
                                    data-testid="verify-vendor-btn"
                                >
                                    {t('actions.verify')}
                                </button>
                                                )}
                                            </>
                                        )}
                        <button
                            onClick={() => onEdit(user)}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            {t('actions.edit')}
                        </button>
                        <button
                            onClick={() => onDelete(user)}
                            className="text-red-600 hover:text-red-900"
                        >
                            {t('actions.delete')}
                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {users.map((user) => {
                    const vendorDetails = type === 'vendors' ? vendors.find(v => v.email === user.email) : null;
                    return (
                        <div key={user._id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                {type === 'vendors' && vendorDetails && (
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendorDetails.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {vendorDetails.is_verified ? t('status.verified') : t('status.pending')}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Phone:</span>
                                    <span className="text-gray-900">{user.phone || t('na')}</span>
                                </div>
                                {type === 'vendors' && vendorDetails && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Company:</span>
                                        <span className="text-gray-900">{vendorDetails.company_name || t('na')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Joined:</span>
                                    <span className="text-gray-900">{formatDate(user.date_joined)}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                                {type === 'vendors' && vendorDetails && (
                                    <>
                                        <button
                                            onClick={() => onViewVendorDetails(vendorDetails)}
                                            className="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                        >
                                            {t('actions.view')}
                                        </button>
                                        {!vendorDetails.is_verified && (
                                                <button
                                                    onClick={() => onVerifyVendor(vendorDetails)}
                                                    className="px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                                                    data-testid="verify-vendor-btn-mobile"
                                                >
                                                    {t('actions.verify')}
                                                </button>
                                        )}
                                    </>
                                )}
                                <button
                                    onClick={() => onEdit(user)}
                                    className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                >
                                    {t('actions.edit')}
                                </button>
                                <button
                                    onClick={() => onDelete(user)}
                                    className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                    {t('actions.delete')}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

// Vendors Table Component
const VendorsTable = ({ vendors, onViewVendorDetails, onVerifyVendor, onDelete }) => {
    const { t } = useTranslation('dashboards');
    if (vendors.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">{t('empty.vendors')}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white border border-primary-200 rounded-lg shadow-sm overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.contact')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.idType')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.joined')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vendors.map((vendor) => (
                            <tr key={vendor._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                                    <div className="text-sm text-gray-600">{vendor.company_name || t('vendor.individual')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{vendor.contact_number}</div>
                                    <div className="text-sm text-gray-600">{vendor.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 capitalize">{vendor.id_type?.replace('_', ' ')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {vendor.is_verified ? 'Verified' : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDate(vendor.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onViewVendorDetails(vendor)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        {t('actions.view')}
                                    </button>
                                    {!vendor.is_verified && (
                                        <button
                                            onClick={() => onVerifyVendor(vendor)}
                                            className="text-green-600 hover:text-green-900"
                                            data-testid="verify-vendor-table-btn"
                                        >
                                            {t('actions.verify')}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onDelete(vendor)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {t('actions.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {vendors.map((vendor) => (
                    <div key={vendor._id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                                <p className="text-sm text-gray-600">{vendor.company_name || t('na')}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {vendor.is_verified ? t('status.verified') : t('status.pending')}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('table.email')}:</span>
                                <span className="text-gray-900 truncate ml-2">{vendor.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('table.contact')}:</span>
                                <span className="text-gray-900">{vendor.contact_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{t('table.idType')}:</span>
                                <span className="text-gray-900 capitalize">{vendor.id_type?.replace('_', ' ')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Joined:</span>
                                <span className="text-gray-900">{formatDate(vendor.createdAt)}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
                                <button
                                    onClick={() => onViewVendorDetails(vendor)}
                                    className="px-3 py-1.5 text-sm text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100"
                                >
                                    {t('actions.view')}
                                </button>
                            {!vendor.is_verified && (
                                    <button
                                        onClick={() => onVerifyVendor(vendor)}
                                        className="px-3 py-1.5 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                                        data-testid="verify-vendor-card-btn"
                                    >
                                        {t('actions.verify')}
                                    </button>
                            )}
                                <button
                                    onClick={() => onDelete(vendor)}
                                    className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                >
                                    {t('actions.delete')}
                                </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};


// Packages Table Component
const PackagesTable = ({ packages, onEdit, onDelete }) => {
    const { t } = useTranslation('dashboards');
    if (packages.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">{t('empty.packages')}</p>
            </div>
        );
    }

    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.name')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.vehicleType')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.ccRange')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.pricePerHour')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.pricePerKm')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {packages.map((pkg) => (
                            <tr key={pkg._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{pkg.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 capitalize">{pkg.vehicle_type}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{pkg.cc_range_min} - {pkg.cc_range_max} {t('table.cc')}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{formatPrice(pkg.price_per_hour)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{formatPrice(pkg.price_per_km)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {pkg.is_active ? t('status.active') : t('status.inactive')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onEdit(pkg)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        {t('actions.edit')}
                                    </button>
                                    <button
                                        onClick={() => onDelete(pkg)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {t('actions.delete')}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {packages.map((pkg) => (
                    <div key={pkg._id} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{pkg.vehicle_type}</p>
                            </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {pkg.is_active ? t('status.active') : t('status.inactive')}
                                    </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">CC Range:</span>
                                <span className="text-gray-900">{pkg.cc_range_min} - {pkg.cc_range_max} cc</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price/Hour:</span>
                                <span className="text-gray-900 font-semibold">{formatPrice(pkg.price_per_hour)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price/KM:</span>
                                <span className="text-gray-900 font-semibold">{formatPrice(pkg.price_per_km)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-3 border-t">
                                    <button
                                        onClick={() => onEdit(pkg)}
                                        className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                    >
                                        {t('actions.edit')}
                                    </button>
                                    <button
                                        onClick={() => onDelete(pkg)}
                                        className="flex-1 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                                    >
                                        {t('actions.delete')}
                                    </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// Modal Component
const Modal = ({ type, item, onClose, onSuccess, userRole }) => {
    const { t } = useTranslation('dashboards');
    const { toast } = useToast();
    const [formData, setFormData] = useState(
        type === 'package' && item
            ? {
                name: item.name,
                cc_range_min: item.cc_range_min,
                cc_range_max: item.cc_range_max,
                price_per_hour: item.price_per_hour,
                price_per_km: item.price_per_km,
                vehicle_type: item.vehicle_type,
                description: item.description || '',
                is_active: item.is_active
            }
            : type === 'vendor' && item
                ? {
                    name: item.name,
                    email: item.email,
                    password_hash: item.password_hash,
                    phone: item.phone || '',
                    address: item.address || '',
                    role: 'vendor',
                    company_name: item.vendorDetails?.company_name || '',
                    vendor_name: item.vendorDetails?.vendor_name || item.name,
                    contact_number: item.vendorDetails?.contact_number || item.phone || '',
                    vendor_email: item.vendorDetails?.email || item.email,
                    vendor_address: item.vendorDetails?.address || item.address || '',
                    is_verified: item.vendorDetails?.is_verified || false
                }
                : item
                    ? {
                        name: item.name,
                        email: item.email,
                        password_hash: item.password_hash,
                        phone: item.phone || '',
                        address: item.address || '',
                        role: item.role,
                        is_active: item.is_active
                    }
                    : {
                        name: '',
                        email: '',
                        password_hash: '',
                        phone: '',
                        address: '',
                        role: userRole,
                        is_active: true,
                        ...(type === 'package' && {
                            cc_range_min: 0,
                            cc_range_max: 0,
                            price_per_hour: 0,
                            price_per_km: 0,
                            vehicle_type: 'bike',
                            description: ''
                        })
                    }
    );

    const handlePhoneChange = (e, fieldName) => {
        const value = e.target.value;
        // Remove any non-digit characters
        const digitsOnly = value.replace(/[^\d]/g, '');
        // Ensure +966 prefix is always present and limit to 10 digits
        if (digitsOnly.length <= 10) {
            setFormData({ ...formData, [fieldName]: digitsOnly ? `+966${digitsOnly}` : '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let endpoint, method, body;

            if (type === 'package') {
                endpoint = item ? `${API_ENDPOINTS.packageById(item._id)}` : API_ENDPOINTS.packages;
                method = item ? 'PATCH' : 'POST';
                body = {
                    name: formData.name,
                    cc_range_min: parseInt(formData.cc_range_min),
                    cc_range_max: parseInt(formData.cc_range_max),
                    price_per_hour: parseFloat(formData.price_per_hour),
                    price_per_km: parseFloat(formData.price_per_km),
                    vehicle_type: formData.vehicle_type,
                    description: formData.description,
                    is_active: formData.is_active
                };
            } else {
                endpoint = item ? `${API_ENDPOINTS.users}/${item._id}` : API_ENDPOINTS.users;
                method = item ? 'PATCH' : 'POST';
                body = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role,
                    is_active: formData.is_active
                };

                // Only include password if it's provided (for create or update)
                if (formData.password_hash) {
                    body.password = formData.password_hash;
                }
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.status === 'success') {
                // If creating/updating vendor, also handle vendor details
                if (type === 'vendor') {
                    const userId = item ? item._id : data.data.user._id;
                    const vendorBody = {
                        user_id: userId,
                        company_name: formData.company_name,
                        vendor_name: formData.vendor_name,
                        contact_number: formData.contact_number,
                        email: formData.vendor_email,
                        address: formData.vendor_address,
                        is_verified: formData.is_verified
                    };

                    if (item?.vendorDetails) {
                        // Update existing vendor
                        await fetch(`${API_ENDPOINTS.vendorById(item.vendorDetails._id)}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                                ...getAuthHeader()
                            },
                            credentials: 'include',
                            body: JSON.stringify(vendorBody),
                        });
                    } else {
                        // Create new vendor
                        await fetch(API_ENDPOINTS.vendors, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                ...getAuthHeader()
                            },
                            credentials: 'include',
                            body: JSON.stringify(vendorBody),
                        });
                    }
                }
                onSuccess();
            } else {
                toast.error('Error: ' + (data.message || 'Failed to save'));
            }
        } catch (error) {
            console.error('Error saving:', error);
            toast.error('Failed to save. Please try again.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-2 md:p-4">
            <div className="bg-white border-2 border-primary-200 rounded-xl max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4 md:mb-6">
                        {item ? t('actions.edit') : t('actions.create')} {type === 'package' ? t('modal.package') : type === 'vendor' ? t('modal.vendorType') : t('modal.officeStaffType')}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {type === 'package' ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.packageName')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <CustomDropdown
                                        label={<span>{t('table.vehicle')} <span className='text-red-500'>*</span></span>}
                                        options={[
                                            { value: 'bike', label: t('vehicleType.bike') },
                                            { value: 'car', label: t('vehicleType.car') }
                                        ]}
                                        value={formData.vehicle_type}
                                        onChange={(val) => setFormData({ ...formData, vehicle_type: val })}
                                    />

                                    <CustomDropdown
                                        label={                                        <span>{t('table.status')} <span className='text-red-500'>*</span></span>}
                                        options={[
                                            { value: 'true', label: t('status.active') },
                                            { value: 'false', label: t('status.inactive') }
                                        ]}
                                        value={String(formData.is_active)}
                                        onChange={(val) => setFormData({ ...formData, is_active: val === 'true' })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.minCC')}</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_min}
                                            onChange={(e) => setFormData({ ...formData, cc_range_min: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.maxCC')}</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.cc_range_max}
                                            onChange={(e) => setFormData({ ...formData, cc_range_max: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.pricePerHour')}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price_per_hour}
                                            onChange={(e) => setFormData({ ...formData, price_per_hour: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.pricePerKm')}</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={formData.price_per_km}
                                            onChange={(e) => setFormData({ ...formData, price_per_km: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.description')}</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.name')}</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.email')}</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.password')}</label>
                                        <input
                                            type="text"
                                            required={!item}
                                            value={formData.password_hash}
                                            onChange={(e) => setFormData({ ...formData, password_hash: e.target.value })}
                                                placeholder={item ? t('form.leaveBlank') : ""}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.phone')}</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-gray-700 font-medium">+966</span>
                                            </div>
                                            <input
                                                type="tel"
                                                value={formData.phone.replace('+966', '')}
                                                onChange={(e) => handlePhoneChange(e, 'phone')}
                                                className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                placeholder="0000000000"
                                                maxLength="10"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <CustomDropdown
                                            options={[
                                                { value: 'true', label: 'Active' },
                                                { value: 'false', label: 'Inactive' }
                                            ]}
                                            value={String(formData.is_active)}
                                            onChange={(val) => setFormData({ ...formData, is_active: val === 'true' })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.address')}</label>
                                    <textarea
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                {type === 'vendor' && (
                                    <>
                                        <div className="border-t pt-4 mt-4">
                                            <h3 className="text-lg font-semibold text-red-600 mb-4">{t('section.vendorDetails')}</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.companyName')}</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.company_name}
                                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.vendorName')}</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.vendor_name}
                                                        onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.contactNumber')}</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <span className="text-gray-700 font-medium">+966</span>
                                                        </div>
                                                        <input
                                                            type="tel"
                                                            required
                                                            value={formData.contact_number.replace('+966', '')}
                                                            onChange={(e) => handlePhoneChange(e, 'contact_number')}
                                                            className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                            placeholder="9876543210"
                                                            maxLength="10"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.verificationStatus')}</label>
                                                    <CustomDropdown
                                                        options={[
                                                            { value: 'true', label: t('status.verified') },
                                                            { value: 'false', label: t('status.notVerified') }
                                                        ]}
                                                        value={String(formData.is_verified)}
                                                        onChange={(val) => setFormData({ ...formData, is_verified: val === 'true' })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                {t('common:actions.cancel')}
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                {item ? t('actions.update') : t('actions.create')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
    const { t } = useTranslation('dashboards');
    return (
        <div className="fixed inset-0 backdrop-blur-md border-2 border-primary-200 bg-opacity-50 flex items-center justify-center z-150 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-4">{t('modal.confirmDelete')}</h3>
                    <p className="text-gray-600 mb-6">{t('modal.deleteConfirmMessage')}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        {t('common:actions.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {t('actions.delete')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Vehicle Requests Table Component
const VehicleRequestsTable = ({ requests, vehicles, onViewDetails, onToggleFeature }) => {
    const { t } = useTranslation('dashboards');
    // Calculate featured count
    const featuredCount = vehicles.filter(v => v.is_featured).length;
    const maxFeatured = 3;
    const canAddMore = featuredCount < maxFeatured;

    // Helper function to get vehicle info for approved request
    const getVehicleForRequest = (request) => {
        if (request.status !== 'approved') return null;
        return vehicles.find(v => v.registration_number === request.registration_number);
    };

    if (requests.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">No vehicle requests found.</p>
            </div>
        );
    }

    return (
        <>
            {/* Featured Count Badge */}
            <div className="mb-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-blue-900">{t('featured.vehicles', { count: featuredCount, max: maxFeatured })}</span>
                </div>
                {!canAddMore && (
                    <span className="text-sm text-blue-700">Maximum featured vehicles reached</span>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.vehicle')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.vendor')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.registration')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.status')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.submitted')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('table.actions')}</th>
                            </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request) => {
                            const vehicle = getVehicleForRequest(request);
                            const isFeatured = vehicle?.is_featured || false;
                            const canToggle = request.status === 'approved' && vehicle && (isFeatured || canAddMore);

                            return (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                                        <div className="text-sm text-gray-500">{request.model_name}, {request.type}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{request.vendor_id?.name || t('na')}</div>
                                        <div className="text-sm text-gray-500">{request.vendor_id?.email || ''}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-600">{request.registration_number}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            t('status.request_' + request.status)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {formatDate(request.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onViewDetails(request)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        {t('actions.view')}
                                    </button>
                                        {request.status === 'approved' && vehicle && (
                                            <button
                                                onClick={() => onToggleFeature(vehicle._id)}
                                                disabled={!canToggle}
                                                className={`${canToggle
                                                    ? isFeatured
                                                        ? 'text-orange-600 hover:text-orange-900'
                                                        : 'text-green-600 hover:text-green-900'
                                                    : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                title={!canToggle && !isFeatured ? t('featured.maxReached') : ''}
                                            >
                                                {isFeatured ? t('actions.unfeature') : t('actions.feature')}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {requests.map((request) => {
                    const vehicle = getVehicleForRequest(request);
                    const isFeatured = vehicle?.is_featured || false;
                    const canToggle = request.status === 'approved' && vehicle && (isFeatured || canAddMore);

                    return (
                        <div key={request._id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{request.name}</h3>
                                    <p className="text-sm text-gray-600">{request.model_name}</p>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        t('status.request_' + request.status)
                                    </span>
                                    {request.status === 'approved' && vehicle && isFeatured && (
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                {t('featured.featured')}
                                            </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Vendor:</span>
                                    <span className="text-gray-900">{request.vendor_id?.name || t('na')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Type:</span>
                                    <span className="text-gray-900 capitalize">{request.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Registration:</span>
                                    <span className="text-gray-900">{request.registration_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Submitted:</span>
                                    <span className="text-gray-900">{formatDate(request.createdAt)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t">
                                    <button
                                        onClick={() => onViewDetails(request)}
                                        className="px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                    >
                                        {t('actions.viewDetails')}
                                    </button>
                                {request.status === 'approved' && vehicle && (
                                    <button
                                        onClick={() => onToggleFeature(vehicle._id)}
                                        disabled={!canToggle}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg ${canToggle
                                            ? isFeatured
                                                ? 'text-orange-600 bg-orange-50 hover:bg-orange-100'
                                                : 'text-green-600 bg-green-50 hover:bg-green-100'
                                            : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                            }`}
                                    >
                                        {isFeatured ? t('actions.unfeature') : t('actions.feature')}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

// Vendor Details Modal
const VendorDetailsModal = ({ vendor, onClose }) => {
    const { t } = useTranslation('dashboards');
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-600">{t('modal.vendorDetails')}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.name')}</label>
                                <p className="mt-1 text-gray-900">{vendor.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.email')}</label>
                                <p className="mt-1 text-gray-900">{vendor.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.companyName')}</label>
                                <p className="mt-1 text-gray-900">{vendor.company_name || t('na')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.contactNumber')}</label>
                                <p className="mt-1 text-gray-900">{vendor.contact_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.idType')}</label>
                                <p className="mt-1 text-gray-900 capitalize">{vendor.id_type?.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.verificationStatus')}</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vendor.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {vendor.is_verified ? t('status.verified') : t('status.pending')}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500">{t('details.address')}</label>
                            <p className="mt-1 text-gray-900">{vendor.address}</p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-500 mb-2 block">{t('details.uploadedDocument')}</label>
                            {vendor.document_url ? (
                                <a
                                    href={vendor.document_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    View Document
                                 </a>
                            ) : (
                                <p className="text-gray-500">{t('details.noDocument')}</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            {t('common:actions.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vehicle Request Details Modal
const VehicleRequestDetailsModal = ({ request, onClose, onApprove, onReject }) => {
    const { t } = useTranslation('dashboards');
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-600">{t('modal.vehicleRequestDetails')}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Vendor Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">{t('section.vendorInformation')}</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><span className="font-medium">{t('details.name')}:</span> {request.vendor_id?.name || t('na')}</p>
                            <p><span className="font-medium">{t('details.email')}:</span> {request.vendor_id?.email || t('na')}</p>
                            <p><span className="font-medium">{t('details.companyName')}:</span> {request.vendor_id?.company_name || t('na')}</p>
                            <p><span className="font-medium">{t('details.contactNumber')}:</span> {request.vendor_id?.contact_number || t('na')}</p>
                        </div>
                    </div>

                    {/* Vehicle Details */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">{t('section.vehicleDetails')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.vehicleName')}</label>
                                <p className="mt-1 text-gray-900">{request.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.modelName')}</label>
                                <p className="mt-1 text-gray-900">{request.model_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.type')}</label>
                                <p className="mt-1 text-gray-900 capitalize">{request.type}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.brand')}</label>
                                <p className="mt-1 text-gray-900">{request.brand}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.registrationNumber')}</label>
                                <p className="mt-1 text-gray-900">{request.registration_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.engineNumber')}</label>
                                <p className="mt-1 text-gray-900">{request.engine_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.chassisNumber')}</label>
                                <p className="mt-1 text-gray-900">{request.chassis_number}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.engineCC')}</label>
                                <p className="mt-1 text-gray-900">{request.cc_engine}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.location')}</label>
                                <p className="mt-1 text-gray-900">{request.location}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">{t('details.status')}</label>
                                <p className="mt-1">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        t('status.request_' + request.status)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">{t('section.documents')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-2">{t('details.rcDocument')}</label>
                                <a
                                    href={request.rc_document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                >
                                    View RC Document
                                 </a>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500 block mb-2">{t('details.insuranceDocument')}</label>
                                <a
                                    href={request.insurance_document}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                                >
                                    View Insurance Document
                                 </a>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Images */}
                    <div className="space-y-4 mb-6">
                        <h3 className="font-semibold text-gray-900 text-lg">{t('section.vehicleImages')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {request.vehicle_images?.map((image, index) => (
                                <a
                                    key={index}
                                    href={image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <img
                                        src={image}
                                        alt={t('details.vehicleImageAlt', { n: index + 1 })}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-300 hover:border-red-500 transition-colors"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {t('common:actions.close')}
                        </button>
                        {request.status === 'pending' && (
                            <>
                                <button
                                    onClick={() => onReject(request._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {t('actions.reject')}
                                </button>
                                <button
                                    onClick={() => onApprove(request._id)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {t('actions.approve')}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vendor Verification Confirmation Modal
const VendorVerifyConfirmModal = ({ vendor, onConfirm, onCancel }) => {
    const { t } = useTranslation('dashboards');
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-150 p-4">
            <div className="bg-white border-2 border-primary-200 rounded-xl max-w-md w-full shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{t('modal.verifyVendor')}</h2>
                        <p className="text-gray-600 mb-6 text-center">
                            {t('modal.verifyVendorConfirm')}
                        </p>
                    {vendor && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">{t('modal.vendorLabel')}</p>
                            <p className="font-semibold text-gray-900">{vendor.name || vendor.vendor_name}</p>
                            {vendor.company_name && (
                                <p className="text-sm text-gray-600 mt-1">{vendor.company_name}</p>
                            )}
                        </div>
                    )}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            data-testid="cancel-verify-vendor-btn"
                        >
                            {t('common:actions.cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            data-testid="confirm-verify-vendor-btn"
                        >
                            {t('actions.verify')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Bookings & Payments Table Component
const BookingsPaymentsTable = ({ bookings }) => {
    const { t } = useTranslation('dashboards');
    const [statusFilter, setStatusFilter] = useState('all');
    const [expandedCards, setExpandedCards] = useState({});

    const toggleCardExpansion = (bookingId) => {
        setExpandedCards(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
    };

    const filteredBookings = statusFilter === 'all' 
        ? bookings 
        : bookings.filter(booking => booking.status === statusFilter);

    const bookingStatusLabel = (status) => {
        const map = {
            booking_requested: t('status.booking_requested'),
            picked_up: t('status.picked_up'),
            returned: t('status.returned'),
            cancelled: t('status.cancelled')
        };
        return map[status] || status;
    };

    if (bookings.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
                <p className="text-red-500">{t('empty.bookings')}</p>
            </div>
        );
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'booking_requested':
                return 'bg-yellow-100 text-yellow-800';
            case 'picked_up':
                return 'bg-blue-100 text-blue-800';
            case 'returned':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">{t('filter.byStatus')}</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                        data-testid="status-filter"
                    >
                        <option value="all">{t('filter.allBookings')}</option>
                        <option value="booking_requested">{t('status.booking_requested')}</option>
                        <option value="picked_up">{t('status.picked_up')}</option>
                        <option value="returned">{t('status.returned')}</option>
                        <option value="cancelled">{t('status.cancelled')}</option>
                    </select>
                    <span className="text-sm text-gray-500">
                        {t('filter.showing', { shown: filteredBookings.length, total: bookings.length })}
                    </span>
                </div>
            </div>

            {/* Collapsible Cards */}
            <div className="space-y-4">
                {filteredBookings.map((booking) => (
                    <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6" data-testid="booking-card">
                        {/* Card Header - Always Visible */}
                        <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleCardExpansion(booking._id)}
                            data-testid={`toggle-card-${booking._id}`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 flex-1">
                                <h4 className="text-base md:text-lg font-semibold text-gray-900">
                                    {booking.user_id?.name || t('na')} - <span className='font-light'>{booking.user_id?.email || t('na')}</span>
                                </h4>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}>
                                    {bookingStatusLabel(booking.status)}
                                </span>
                            </div>
                            <button 
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
                                aria-label={expandedCards[booking._id] ? "Collapse details" : "Expand details"}
                            >
                                {expandedCards[booking._id] ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* Collapsed Summary - Visible when not expanded */}
                        {!expandedCards[booking._id] && (
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                <span className="font-medium text-gray-900">{booking.vehicle_id?.name || t('na')} - {booking.vehicle_id?.model_name || t('na')}</span>
                                <span>•</span>
                                <span>{t('details.vendor')}: <span className="font-medium text-gray-900">{booking.vendor_id?.name || t('na')}</span></span>
                                {booking.bill_id && (
                                    <>
                                        <span>•</span>
                                        <span>{t('details.bill')}: <span className="font-medium text-blue-600">{booking.bill_id}</span></span>
                                    </>
                                )}
                                {booking.final_cost && (
                                    <>
                                        <span>•</span>
                                        <span>{t('details.total')}: <span className="font-medium text-green-600">{formatPrice(booking.final_cost)}</span></span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Expandable Content - Full Details */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCards[booking._id] ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    {/* Booking Reference */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.bookingReference')}</p>
                                        <p className="font-bold text-blue-600 text-lg">{booking.bill_id || t('status.pending')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{t('details.id')}: {booking._id?.slice(-12)}</p>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.customerInformation')}</p>
                                        <p className="font-semibold text-gray-900">{booking.user_id?.name || t('na')}</p>
                                        <p className="text-gray-600 text-xs mt-1">{booking.user_id?.email || t('na')}</p>
                                        <p className="text-gray-600 text-xs">{booking.user_id?.phone || t('na')}</p>
                                    </div>

                                    {/* Vendor Information */}
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.vendorInformation')}</p>
                                        <p className="font-semibold text-gray-900">{booking.vendor_id?.name || t('na')}</p>
                                        <p className="text-gray-600 text-xs mt-1">{booking.vendor_id?.email || t('na')}</p>
                                        <p className="text-gray-600 text-xs">{booking.vendor_id?.contact_number || t('na')}</p>
                                    </div>

                                    {/* Vehicle Details */}
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.vehicleDetails')}</p>
                                        <p className="font-semibold text-gray-900">{booking.vehicle_id?.name || t('na')}</p>
                                        <p className="text-gray-600 text-xs mt-1">{t('details.model')}: {booking.vehicle_id?.model_name || t('na')}</p>
                                        <p className="text-gray-600 text-xs">{t('details.reg')}: {booking.vehicle_id?.registration_number || t('na')}</p>
                                        <p className="text-gray-600 text-xs">{t('details.type')}: {booking.vehicle_id?.type || t('na')} - {booking.vehicle_id?.cc_engine || t('na')}cc</p>
                                    </div>

                                    {/* Advance Payment */}
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.advancePayment')} <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${getPaymentStatusBadge(booking.advance_payment?.status)}`}>
                                            {t('status.payment_' + (booking.advance_payment?.status || 'pending'))}
                                        </span></p>
                                        <p className="font-bold text-green-700 text-lg">{formatPrice(booking.advance_payment?.amount || 0)}</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            {t('details.transactionId')} <span className="font-mono">{booking.advance_payment?.stripe_payment_id || booking.advance_payment?.razorpay_payment_id || t('na')}</span>
                                        </p>
                                        {booking.advance_payment?.paid_at && (
                                            <p className="text-gray-600 text-xs mt-1">{t('details.paid')} {formatDateTime(booking.advance_payment.paid_at)}</p>
                                        )}
                                    </div>

                                    {/* Final Payment */}
                                    <div className="bg-orange-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.finalPayment')} <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium mt-1 ${getPaymentStatusBadge(booking.final_payment?.status)}`}>
                                            {t('status.payment_' + (booking.final_payment?.status || 'pending'))}
                                        </span></p>
                                        <p className="font-bold text-orange-700 text-lg">{formatPrice(booking.final_payment?.amount || 0)}</p>
                                        <p className="text-gray-600 text-xs mt-1">
                                            {t('details.transactionId')} <span className="font-mono">{booking.final_payment?.stripe_payment_id || booking.final_payment?.razorpay_payment_id || (booking.final_payment?.method === 'cash' ? t('payment.cashPayment') : t('na'))}</span>
                                        </p>
                                        <p className="text-gray-600 text-xs">
                                            Mode: <span className="font-semibold uppercase">{booking.final_payment?.method ? t('payment.' + booking.final_payment.method) : t('na')}</span>
                                        </p>
                                        {booking.final_payment?.paid_at && (
                                            <p className="text-gray-600 text-xs mt-1">{t('details.paid')} {formatDateTime(booking.final_payment.paid_at)}</p>
                                        )}
                                    </div>

                                    {/* Total Amount */}
                                    <div className="bg-indigo-50 p-3 rounded-lg border-2 border-indigo-200">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.totalAmount')}</p>
                                        <p className="font-bold text-indigo-700 text-2xl">{formatPrice(booking.final_cost || booking.estimated_cost || 0)}</p>
                                        {booking.estimated_cost && !booking.final_cost && (
                                            <p className="text-xs text-gray-600 mt-1">{t('details.estimated')}</p>
                                        )}
                                    </div>

                                    {/* Dates - Booking Created */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.bookingCreated')}</p>
                                        <p className="font-medium text-gray-900">{formatDate(booking.createdAt)}</p>
                                        <p className="text-gray-600 text-xs">{formatTime(booking.createdAt)}</p>
                                    </div>

                                    {/* Pickup Date */}
                                    {booking.pickup_details?.actual_pickup_date && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.pickupDate')}</p>
                                            <p className="font-medium text-gray-900">{formatDate(booking.pickup_details.actual_pickup_date)}, {booking.pickup_details.actual_pickup_time || t('na')}</p>
                                            {booking.pickup_details.staff_id && (
                                                <p className="text-gray-600 text-xs mt-1">{t('details.staff')} {booking.pickup_details.staff_id.name}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Return Date */}
                                    {booking.return_details?.actual_return_date && (
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.returnDate')}</p>
                                            <p className="font-medium text-gray-900">{formatDate(booking.return_details.actual_return_date)}, {booking.return_details.actual_return_time || t('na')}</p>
                                            {booking.return_details.staff_id && (
                                                <p className="text-gray-600 text-xs mt-1">{t('details.staff')} {booking.return_details.staff_id.name}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Additional Info */}
                                    {booking.distance_traveled_km && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.tripDetails')}</p>
                                            <p className="text-gray-900">{t('details.distance')}: <span className="font-semibold">{booking.distance_traveled_km} km</span></p>
                                            <p className="text-gray-900">{t('details.duration')}: <span className="font-semibold">{booking.duration_hours} hours</span></p>
                                        </div>
                                    )}

                                    {/* Package Info */}
                                    {booking.package_id && (
                                        <div className="bg-yellow-50 p-3 rounded-lg">
                                            <p className="text-gray-500 text-xs font-medium uppercase mb-1">{t('details.package')}</p>
                                            <p className="font-semibold text-gray-900">{booking.package_id.name}</p>
                                            <p className="text-gray-600 text-xs">{formatPrice(booking.package_id.price_per_hour)}/hr | {formatPrice(booking.package_id.price_per_km)}/km</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <p className="text-gray-500">{t('empty.noBookingsFilter')}</p>
                </div>
            )}
        </div>
    );
};

// Setting Row Component
const SettingRow = ({ setting, onSave }) => {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(setting.value || '');

    const handleSave = () => {
        onSave(setting.key, value);
        setEditing(false);
    };

    return (
        <div className="flex justify-between items-center pb-4 border-b">
            <div className="flex-1">
                <p className="font-medium text-gray-900 capitalize">{setting.key?.replace(/_/g, ' ') || 'Setting'}</p>
                {editing ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="mt-1 w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                ) : (
                    <p className="text-sm text-gray-500">{setting.value || 'Not configured'}</p>
                )}
            </div>
            <div className="ml-4">
                {editing ? (
                    <div className="space-x-2">
                        <button
                            onClick={handleSave}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => { setEditing(false); setValue(setting.value || ''); }}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                        Edit
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
