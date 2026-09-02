const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const API_ENDPOINTS = {
    // Auth endpoints
    login: `${API_BASE_URL}/auth/login`,
    googleLogin: `${API_BASE_URL}/auth/google`,
    register: `${API_BASE_URL}/auth/register`,
    verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
    resendOtp: `${API_BASE_URL}/auth/resend-otp`,
    registerVendor: `${API_BASE_URL}/auth/register-vendor`,
    verifyVendorOtp: `${API_BASE_URL}/auth/verify-vendor-otp`,
    resendVendorOtp: `${API_BASE_URL}/auth/resend-vendor-otp`,
    logout: `${API_BASE_URL}/auth/logout`,
    currentUser: `${API_BASE_URL}/auth/me`,
    updatePassword: `${API_BASE_URL}/auth/update-password`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,
    deleteAccount: `${API_BASE_URL}/auth/delete-me`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    requestPasswordChangeOTP: `${API_BASE_URL}/auth/request-password-change-otp`,
    verifyPasswordChangeOTP: `${API_BASE_URL}/auth/verify-password-change-otp`,
    resendPasswordChangeOTP: `${API_BASE_URL}/auth/resend-password-change-otp`,

    // User endpoints
    users: `${API_BASE_URL}/users`,

    // Vehicle endpoints
    vehicles: `${API_BASE_URL}/vehicles`,
    vehiclesGrouped: `${API_BASE_URL}/vehicles/grouped`,
    vehiclesFeatured: `${API_BASE_URL}/vehicles/featured`,
    vehicleById: (id) => `${API_BASE_URL}/vehicles/${id}`,
    vehiclesByVendor: (vendorId) => `${API_BASE_URL}/vehicles/vendor/${vendorId}`,
    toggleFeatureVehicle: (id) => `${API_BASE_URL}/vehicles/${id}/toggle-feature`,

    // Booking endpoints
    bookings: `${API_BASE_URL}/bookings`,
    bookingById: (id) => `${API_BASE_URL}/bookings/${id}`,
    bookingRequest: `${API_BASE_URL}/bookings/request`,
    userBookings: (userId) => `${API_BASE_URL}/bookings/user/${userId}`,
    officeStaffRequests: `${API_BASE_URL}/bookings/office-staff/requests`,
    confirmPickup: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/pickup`,
    confirmReturn: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/return`,
    rejectBooking: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/reject`,
    markRefundReturned: (bookingId) => `${API_BASE_URL}/bookings/${bookingId}/mark-refund-returned`,

    // Package endpoints
    packages: `${API_BASE_URL}/packages`,
    packageById: (id) => `${API_BASE_URL}/packages/${id}`,
    packageForVehicle: `${API_BASE_URL}/packages/for-vehicle`,

    // Vendor endpoints
    vendors: `${API_BASE_URL}/vendors`,
    vendorById: (id) => `${API_BASE_URL}/vendors/${id}`,
    vendorByEmail: (email) => `${API_BASE_URL}/vendors/email/${email}`,
    vendorEarnings: `${API_BASE_URL}/vendors/earnings`,

    // Payment endpoints
    payments: `${API_BASE_URL}/payments`,
    paymentById: (id) => `${API_BASE_URL}/payments/${id}`,

    // Razorpay endpoints
    razorpayKey: `${API_BASE_URL}/razorpay/key`,
    createAdvanceOrder: `${API_BASE_URL}/razorpay/create-advance-order`,
    verifyAdvancePayment: `${API_BASE_URL}/razorpay/verify-advance-payment`,
    createFinalOrder: `${API_BASE_URL}/razorpay/create-final-order`,
    verifyFinalPayment: `${API_BASE_URL}/razorpay/verify-final-payment`,

    // Upload endpoints
    uploadAuth: `${API_BASE_URL}/upload/auth`,
    uploadFile: `${API_BASE_URL}/upload/file`,
    uploadFiles: `${API_BASE_URL}/upload/files`,

    // Vehicle Request endpoints
    vehicleRequests: `${API_BASE_URL}/vehicle-requests`,
    vehicleRequestById: (id) => `${API_BASE_URL}/vehicle-requests/${id}`,
    approveVehicleRequest: (id) => `${API_BASE_URL}/vehicle-requests/${id}/approve`,
    rejectVehicleRequest: (id) => `${API_BASE_URL}/vehicle-requests/${id}/reject`,
    vehicleRequestsByVendor: (vendorId) => `${API_BASE_URL}/vehicle-requests/vendor/${vendorId}`,
    verifyVendor: (id) => `${API_BASE_URL}/vendors/${id}/verify`,

    // Offer endpoints
    offers: `${API_BASE_URL}/offers`,
    offerById: (id) => `${API_BASE_URL}/offers/${id}`,
    activeOffers: `${API_BASE_URL}/offers/active`,
    toggleOffer: (id) => `${API_BASE_URL}/offers/${id}/toggle`,

    // Coupon endpoints
    coupons: `${API_BASE_URL}/coupons`,
    couponById: (id) => `${API_BASE_URL}/coupons/${id}`,
    validateCoupon: `${API_BASE_URL}/coupons/validate`,

    // Blog endpoints
    blog: `${API_BASE_URL}/blog`,
    blogBySlug: (slug) => `${API_BASE_URL}/blog/slug/${slug}`,
    publishedPosts: `${API_BASE_URL}/blog/published`,
    togglePublishPost: (id) => `${API_BASE_URL}/blog/${id}/publish`,

    // Loyalty endpoints
    loyaltyMyPoints: `${API_BASE_URL}/loyalty/my-points`,
    loyaltyMyTier: `${API_BASE_URL}/loyalty/my-tier`,
    loyaltyReferralCode: `${API_BASE_URL}/loyalty/referral-code`,
    loyaltyRedeem: `${API_BASE_URL}/loyalty/redeem`,
    loyaltyUsers: `${API_BASE_URL}/loyalty/admin/users`,
    loyaltyTiers: `${API_BASE_URL}/loyalty/admin/tiers`,
    loyaltyAdjustPoints: `${API_BASE_URL}/loyalty/admin/adjust-points`,

    // Settings endpoints
    settings: `${API_BASE_URL}/settings`,
    settingByKey: (key) => `${API_BASE_URL}/settings/${key}`,
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('jwt');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default API_BASE_URL;
