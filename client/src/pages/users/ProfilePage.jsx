import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { CircleUser, ClipboardList, LockKeyhole, LogOut, Mail, Shield, Camera, Trash2, UserMinus, AlertTriangle } from 'lucide-react';
import { API_ENDPOINTS } from '../../config/api';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, deleteAccount, updateProfile, refreshUser, requestPasswordChangeOTP, verifyPasswordChangeOTP, resendPasswordChangeOTP } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation('auth');
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profile_image: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  
  // Password change OTP states
  const [passwordChangeStep, setPasswordChangeStep] = useState('form'); // 'form', 'otp'
  const [otp, setOtp] = useState('');
  const [isRequestingOTP, setIsRequestingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResendingOTP, setIsResendingOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize form data with user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      profile_image: user.profile_image || '',
    });
    setAvatarPreview(null);
    setAvatarFile(null);
  }, [user, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    return () => URL.revokeObjectURL(avatarPreview);
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('auth:profile.toastImageSize'));
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormData(prev => ({ ...prev, profile_image: '' }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    try {
      let finalProfileImageUrl = formData.profile_image;

      if (avatarFile) {
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append('file', avatarFile);
        uploadData.append('folder', '/user-profiles');

        const uploadRes = await fetch(API_ENDPOINTS.uploadFile, {
          method: 'POST',
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();
        
        if (uploadResult.status === 'success') {
          finalProfileImageUrl = uploadResult.data.url;
        } else {
          toast.error(uploadResult.message || t('auth:profile.toastUploadFailed'));
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }

      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profile_image: finalProfileImageUrl
      });

      if (result.success) {
        setIsEditing(false);
        setAvatarFile(null);
        setAvatarPreview(null);
        toast.success(t('auth:profile.toastProfileUpdated'));
        await refreshUser();
      } else {
        toast.error(result.message || t('auth:profile.toastUpdateFailed'));
      }
    } catch (error) {
      toast.error(t('auth:profile.toastErrorUpdating', { message: error.message }));
    }
  };

  const handleRequestPasswordChangeOTP = async () => {
    if (!passwordData.currentPassword) {
      toast.warning(t('auth:profile.toastEnterCurrent'));
      return;
    }

    if (!passwordData.newPassword) {
      toast.warning(t('auth:profile.toastEnterNew'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('auth:profile.toastNewMismatch'));
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.warning(t('auth:profile.toastMinLength'));
      return;
    }

    setIsRequestingOTP(true);
    try {
      const result = await requestPasswordChangeOTP(passwordData.currentPassword);

      if (result.success) {
        toast.success(t('auth:profile.toastOtpSent'));
        setPasswordChangeStep('otp');
        setResendCooldown(60);
      } else {
        toast.error(result.message || t('auth:profile.toastSendOtpFailed'));
      }
    } catch (error) {
      toast.error(t('auth:profile.toastErrorSending', { message: error.message }));
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handleVerifyOTPAndChangePassword = async () => {
    if (!otp || otp.length !== 6) {
      toast.warning(t('auth:profile.toastEnterOtp'));
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = await verifyPasswordChangeOTP(otp, passwordData.newPassword);

      if (result.success) {
        toast.success(t('auth:profile.toastPasswordChanged'));
        // Reset all states
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setOtp('');
        setPasswordChangeStep('form');
      } else {
        toast.error(result.message || t('auth:profile.toastChangeFailed'));
      }
    } catch (error) {
      toast.error(t('auth:profile.toastErrorChanging', { message: error.message }));
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    setIsResendingOTP(true);
    try {
      const result = await resendPasswordChangeOTP();

      if (result.success) {
        toast.success(t('auth:profile.toastNewOtpSent'));
        setResendCooldown(60);
      } else {
        toast.error(result.message || t('auth:profile.toastResendFailed'));
      }
    } catch (error) {
      toast.error(t('auth:profile.toastErrorResending', { message: error.message }));
    } finally {
      setIsResendingOTP(false);
    }
  };

  const handleCancelOTPStep = () => {
    setPasswordChangeStep('form');
    setOtp('');
  };

  const handleLogout = () => {
    if (confirm(t('auth:profile.confirmLogout'))) {
      logout();
      navigate('/login');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success(t('auth:profile.toastAccountDeleted'));
        navigate('/login');
      } else {
        toast.error(result.message || t('auth:profile.toastDeleteFailed'));
      }
    } catch (error) {
      toast.error(t('auth:profile.toastErrorDeleting', { message: error.message }));
    } finally {
      setIsDeletingAccount(false);
    }
  };

  if (!user) {
    return null;
  }

  const tabs = [
    {
      id: 'profile', label: t('auth:profile.tabProfile'), icon: (
        <CircleUser className="w-5 h-5" />
      )
    },
    {
      id: 'bookings', label: t('auth:profile.tabBookings'), icon: (
        <ClipboardList className="w-5 h-5" />
      )
    },
    {
      id: 'security', label: t('auth:profile.tabSecurity'), icon: (
        <LockKeyhole className="w-5 h-5" />
      )
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-2">
            {t('auth:profile.myAccountPre')} <span className='text-red-500'>{t('auth:profile.accountEm')}</span>
          </h1>
          <p className="text-lg text-neutral-600">
            {t('auth:profile.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Horizontal on mobile, vertical on desktop */}
          <div className="lg:col-span-1">
            {/* Mobile: Horizontal scroll tabs */}
            <div className="lg:hidden bg-white border-2 border-primary-200 rounded-2xl shadow-card p-4 mb-6 overflow-x-auto">
              <div className="flex space-x-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    data-testid={`tab-${tab.id}`}
                    className={`rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                        ? 'shrink-0 flex items-center space-x-2 px-4 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                        : 'p-3 text-neutral-700 bg-neutral-100'
                      }`}
                  >
                    {tab.icon}
                    <span className={`${activeTab === tab.id ? '' : 'hidden sm:block'}`}>{tab.label}</span>
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  data-testid="logout-btn-mobile"
                  className="shrink-0 flex items-center space-x-0 sm:space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm text-secondary-600 bg-secondary-50 transition-all duration-200 whitespace-nowrap"
                >
                  <LogOut className="w-5 h-5" />
                  <span className='hidden sm:block'>{t('common:auth.logout')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('delete-account')}
                  data-testid="delete-account-btn-mobile"
                  className={`shrink-0 flex items-center space-x-0 sm:space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === 'delete-account' 
                      ? 'bg-red-500 text-white shadow-glow' 
                      : 'text-red-500 bg-red-50 hover:bg-red-100'
                  }`}
                >
                  <UserMinus className="w-5 h-5" />
                  <span className='hidden sm:block'>{t('auth:profile.tabDeleteAccount')}</span>
                </button>
              </div>
            </div>

            {/* Desktop: Vertical sidebar */}
            <div className="hidden lg:block bg-white border-2 border-primary-200 rounded-2xl shadow-card p-6 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tab-${tab.id}-desktop`}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-linear-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                      : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                data-testid="logout-btn-desktop"
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-secondary-500 bg-secondary-50 hover:bg-secondary-100 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>{t('common:auth.logout')}</span>
              </button>
              <button
                onClick={() => setActiveTab('delete-account')}
                data-testid="delete-account-btn-desktop"
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'delete-account'
                    ? 'bg-red-500 text-white shadow-glow'
                    : 'text-red-500 bg-red-50 hover:bg-red-100'
                }`}
              >
                <UserMinus className="w-5 h-5" />
                <span>{t('auth:profile.tabDeleteAccount')}</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-8 space-y-6">
                {/* Profile Header */}
                <div className="pb-6 border-b border-neutral-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="relative">
                          {(avatarPreview || formData.profile_image) ? (
                            <img 
                              src={avatarPreview || formData.profile_image} 
                              alt="Profile" 
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border-2 border-primary-100"
                            />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold shrink-0">
                              {formData.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          
                          {isEditing && (
                            <div className="absolute -bottom-2 -right-2 flex space-x-1">
                              <label className="p-1.5 bg-white border border-neutral-200 rounded-full cursor-pointer hover:bg-neutral-50 shadow-sm transition-colors">
                                <Camera className="w-4 h-4 text-primary-600" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={handleAvatarChange}
                                />
                              </label>
                              {(avatarPreview || formData.profile_image) && (
                                <button 
                                  onClick={removeAvatar}
                                  className="p-1.5 bg-white border border-neutral-200 rounded-full hover:bg-red-50 text-red-500 shadow-sm transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 truncate">{formData.name}</h2>
                        <p className="text-sm sm:text-base text-neutral-600 truncate">{formData.email}</p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        data-testid="edit-profile-btn"
                        className="w-full sm:w-auto px-5 py-2.5 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-lg font-semibold hover:shadow-glow transition-all duration-200 text-sm sm:text-base"
                      >
                        {t('auth:profile.editProfile')}
                      </button>
                    )}
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t('auth:profile.labelFullName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      data-testid="profile-name-input"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t('auth:profile.labelEmail')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      data-testid="profile-email-input"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t('auth:profile.labelPhone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      data-testid="profile-phone-input"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      {t('auth:profile.labelAddress')}
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                      data-testid="profile-address-input"
                      className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 disabled:bg-neutral-50"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={handleSave}
                        disabled={isUploading}
                        data-testid="save-profile-btn"
                        className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-70 flex items-center"
                      >
                        {isUploading ? (
                          <>
                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t('auth:profile.saving')}
                          </>
                        ) : t('auth:profile.saveChanges')}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setAvatarPreview(null);
                          setAvatarFile(null);
                          setFormData(prev => ({ ...prev, profile_image: user.profile_image || '' }));
                        }}
                        data-testid="cancel-edit-btn"
                        className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200"
                      >
                         {t('common:actions.cancel')}
                       </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 sm:mb-6">
                  {t('auth:profile.bookingsTitle')} <span className='text-red-500'>:</span>
                </h2>

                <p className="text-neutral-600 text-sm sm:text-base mb-4">
                  {t('auth:profile.bookingsDesc')}
                </p>

                <button
                  onClick={() => navigate('/bookings')}
                  data-testid="go-to-bookings-btn"
                  className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 text-sm sm:text-base"
                >
                  {t('auth:profile.goToBookings')}
                </button>
              </div>

            )}

            {activeTab === 'security' && (
              <div className="bg-white border-2 border-primary-200 rounded-2xl shadow-card p-8 space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-7 h-7 text-primary-600" />
                  <h2 className="text-2xl font-bold text-neutral-900">{t('auth:profile.securityTitle')} <span className='text-red-500'>:</span></h2>
                </div>
                
                <p className="text-neutral-600 text-sm mb-6">
                  {t('auth:profile.securityDesc')}
                </p>

                {passwordChangeStep === 'form' ? (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                         {t('auth:profile.currentPassword')}
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                         placeholder={t('auth:profile.placeholderCurrent')}
                        data-testid="current-password-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                         {t('auth:profile.newPassword')}
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                         placeholder={t('auth:profile.placeholderNew')}
                        data-testid="new-password-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                         {t('auth:profile.confirmPassword')}
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                         placeholder={t('auth:profile.placeholderConfirm')}
                        data-testid="confirm-password-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200"
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                           <p className="text-sm font-medium text-amber-800">{t('auth:profile.emailVerificationRequired')}</p>
                           <p className="text-xs text-amber-700 mt-1">{t('auth:profile.emailVerificationDesc')}</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleRequestPasswordChangeOTP}
                      disabled={isRequestingOTP}
                      data-testid="request-otp-btn"
                      className="px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {isRequestingOTP ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                           <span>{t('auth:profile.sendingOtp')}</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5" />
                           <span>{t('auth:profile.sendVerificationOtp')}</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* OTP Verification Step */}
                    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
                      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-primary-600" />
                      </div>
                       <h3 className="text-lg font-bold text-neutral-900 mb-2">{t('auth:profile.verifyEmailTitle')}</h3>
                       <p className="text-sm text-neutral-600 mb-4">
                         {t('auth:profile.otpSentTo')} <span className="font-semibold">{user?.email}</span>
                       </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                         {t('auth:profile.enterOtpCode')}
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                     placeholder={t('auth:profile.otpPlaceholder')}
                        maxLength={6}
                        data-testid="otp-input"
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all duration-200 text-center text-2xl tracking-[0.5em] font-mono"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleVerifyOTPAndChangePassword}
                        disabled={isVerifyingOTP || otp.length !== 6}
                        data-testid="verify-otp-btn"
                        className="flex-1 px-6 py-3 bg-linear-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isVerifyingOTP ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>{t('auth:shared.verifying')}</span>
                          </>
                        ) : (
                          <>
                            <Shield className="w-5 h-5" />
                            <span>{t('auth:profile.verifyChangePassword')}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancelOTPStep}
                        data-testid="cancel-otp-btn"
                        className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200"
                      >
                         {t('common:actions.cancel')}
                       </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        onClick={handleResendOTP}
                        disabled={isResendingOTP || resendCooldown > 0}
                        data-testid="resend-otp-btn"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:text-neutral-400 disabled:cursor-not-allowed"
                      >
                         {isResendingOTP ? (
                          t('auth:shared.sending')
                        ) : resendCooldown > 0 ? (
                           `${t('auth:profile.resendInPrefix')} ${resendCooldown}s`
                        ) : (
                          t('auth:shared.resendOtp')
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'delete-account' && (
              <div className="bg-white border-2 border-red-200 rounded-2xl shadow-card p-8 space-y-6">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">{t('auth:profile.deleteTitle')} <span className='text-red-500'>!</span></h2>
                </div>
                
                <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                   <h3 className="text-lg font-bold text-red-800 mb-4">{t('auth:profile.deleteWhyTitle')}</h3>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start text-red-700 text-sm">
                      <span className="mr-2">•</span>
                       <span><strong>{t('auth:profile.deleteReason1Title')}</strong> {t('auth:profile.deleteReason1Body')}</span>
                    </li>
                    <li className="flex items-start text-red-700 text-sm">
                      <span className="mr-2">•</span>
                       <span><strong>{t('auth:profile.deleteReason2Title')}</strong> {t('auth:profile.deleteReason2Body')}</span>
                    </li>
                    <li className="flex items-start text-red-700 text-sm">
                      <span className="mr-2">•</span>
                       <span><strong>{t('auth:profile.deleteReason3Title')}</strong> {t('auth:profile.deleteReason3Body')}</span>
                    </li>
                    <li className="flex items-start text-red-700 text-sm">
                      <span className="mr-2">•</span>
                       <span><strong>{t('auth:profile.deleteReason4Title')}</strong> {t('auth:profile.deleteReason4Body')}</span>
                    </li>
                  </ul>
                  
                   <p className="text-sm font-semibold text-red-800 mb-6">{t('auth:profile.deleteConfirm')}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all duration-200 flex-1 text-center"
                    >
                       {t('auth:profile.cancelKeepAccount')}
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-sm transition-all duration-200 flex-1 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isDeletingAccount ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                           <span>{t('auth:profile.deleting')}</span>
                        </>
                      ) : (
                        <>
                          <UserMinus className="w-5 h-5" />
                           <span>{t('auth:profile.confirmDeletion')}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Background Decorative Elements */}
      <div className="hidden absolute inset-0 pointer-events-none sm:block">
        {/* Top-left cluster */}
        <div className="absolute -top-10 -left-6 w-32 h-32 bg-red-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-6 -left-12 w-20 h-20 bg-blue-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-20 left-4 w-14 h-14 bg-yellow-300 rounded-full opacity-50 blur-md" />

        {/* Center-right floating grouping */}
        <div className="absolute top-16 right-24 w-28 h-28 bg-pink-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-32 right-10 w-16 h-16 bg-purple-300 rounded-full opacity-50 blur-md" />
        <div className="absolute top-44 right-16 w-12 h-12 bg-green-300 rounded-full opacity-50 blur-md" />

        {/* Bottom-right anchor cluster */}
        <div className="absolute -bottom-10 right-8 w-24 h-24 bg-red-300 rounded-full opacity-50 blur-md" />
        <div className="absolute -bottom-4 right-24 w-16 h-16 bg-blue-300 rounded-full opacity-50 blur-md" />
        <div className="absolute -bottom-15 right-16 w-12 h-12 bg-yellow-300 rounded-full opacity-50 blur-md" />
      </div>
    </div>
  );
};

export default ProfilePage;
