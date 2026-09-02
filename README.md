# 🗺️ alrafgha-group - Vehicle Rental System Application 🎉

YatraMate is a comprehensive online vehicle rental system designed to provide a seamless experience for users to book cars and bikes, and for vendors to manage their fleet. The system supports various user roles including regular users, vendors, office staff, and administrators, each with tailored functionalities. Developed by Eng Rady

🌍 Languages & Localization

YatraMate is **fully localized** for Arabic (default) and English with RTL support for Arabic. The interface automatically detects the user's preferred language and displays content in the appropriate script.

🌍 Languages & Localization

YatraMate is **fully localized** for Arabic (default) and English with RTL support for Arabic. The interface automatically detects the user's preferred language and displays content in the appropriate script.

## 💱 Currency

All pricing has been converted to **Saudi Riyal (SAR)**. The system displays prices in SAR format (e.g., `1,200.00 ر.س`) and uses Saudi Arabia locale settings for dates and formatting.

## 🇸🇦 Saudi Market Localization

The entire platform has been localized for the Saudi Arabian market:

- **Cities**: الرياض (Riyadh), جدة (Jeddah), الدمام (Dammam), مكة (Mecca), المدينة (Medina)
- **Customers**: Names and phone numbers follow Saudi conventions (+966 prefix)
- **Vendors**: Local business data (معرض الراحة للتأجير)
- **Documents**: Arabic support for ID verification (Aadhaar/PAN/Passport/Driving License)

## 🎯 Quick Start (Arabic Default)

**Current Live Environment:** Both frontend and backend are running with Saudi localization:

- **Frontend**: http://localhost:5173 (Arabic by default, use "EN / ع" in navbar to switch)
- **Backend**: http://localhost:8000

### Test Credentials

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| **Customer** | `amit@yatramate.com` | `User@123` | Home page |
| **Vendor** | `vendor@yatramate.com` | `Vendor@123` | `/vendor-dashboard` |
| **Office Staff** | `staff@yatramate.com` | `Staff@123` | `/office-staff` |
| **Administrator** | `admin@yatramate.com` | `Admin@123` | `/admin` |

### To Test Registration Flow

For OTP verification testing (since pre-created accounts already verified):

```bash
cd server
node create-admin.js newuser@yatramate.com NewUser123 User user
```

## 🔄 System Workflow

1. **User Registration**: OTP sent via email, auto-verified for customers
2. **Vendor Registration**: Requires admin approval with document verification
3. **Vehicle Management**: Vendors submit vehicles for admin approval
4. **Complete Booking Flow**: Arabic/English support throughout
5. **Payment**: SAR currency with Razorpay integration

- **JWT Authentication** with HTTP-only cookies
- **6-digit OTP** verification (10-minute expiry)
- **Role-based access control** (admin, vendor, office staff, customer)
- **Arabic/English** interface with RTL support
- **SAR currency** for all pricing
- **Saudi city** locations and data
- **Responsive design** for all devices
- **Image upload** with ImageKit
- **Email notifications** in Arabic/English

## 🏗️ Technologies

### Frontend

| Technology | Purpose |
|------------|--------|
| React.js | UI Framework |
| Vite | Build Tool |
| React Router DOM | Routing |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| i18next | Localization |

### Backend

| Technology | Purpose |
|------------|--------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Razorpay | Payment (SAR) |
| ImageKit | Image Management |

## 📁 Project Structure

- `server/` - Backend API with Express.js
- `client/` - React/Vite frontend application
- `server/.env` - Environment variables
- `client/.env` - Frontend configuration

## 🚀 Features

### Arabic/English Support

- **Navbar**: Login/Sign Up/Logout in both languages
- **Footer**: Localized contact information for Saudi Arabia
- **Mobile Navigation**: Native Arabic/English with RTL
- **All Pages**: Home, Vehicles, Bookings, Auth, Documentation

### Saudi Market Features

- **Local Cities**: Riyadh, Jeddah, Dammam, Mecca, Medina
- **SAR Pricing**: All packages in Saudi Riyal
- **Local Names**: Saudi customer names and vendor data
- **RTL Layout**: Complete Arabic support with proper text direction

## 📚 Documentation

- **Contributing**: See CONTRIBUTING.md for contribution guidelines
- **API Reference**: Complete API documentation available
- **Deployment**: Instructions for production deployment
- **Testing**: Comprehensive test suite included

## ❤️ Acknowledgements

Made with ❤️ by the YatraMate Team

## 📞 Support

- Help Center: https://yatramate.vercel.app/help
- Email: support@yatramate.com
- FAQ: https://yatramate.vercel.app/faq

## 📋 Table of Contents

- [Features](#-features)
- [User Roles & Permissions](#-user-roles--permissions)
- [Complete System Workflow](#-complete-system-workflow)
- [Technologies Used](#-technologies-used)
- [Installation](#️-installation)
- [API Endpoints](#-api-endpoints)
- [Pricing Model](#-pricing-model)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### For Customers
- **User Registration & Authentication:** Secure registration with email OTP verification and JWT-based authentication
- **Vehicle Browsing & Search:** Browse available cars and bikes with filters for type, location, and pricing
- **Detailed Vehicle View:** High-quality images, specifications, pricing packages, and availability status
- **Easy Booking:** Simple booking process with pickup location and date/time selection
- **Booking Management:** View booking history, track active rentals, and cancel bookings
- **Profile Management:** Update personal information, change password with OTP verification
- **Password Recovery:** Forgot password with secure email reset link

### For Vendors
- **Vendor Registration:** Register as individual or organization with document verification
- **Vehicle Management:** Add, update, and manage vehicle fleet with images and documents
- **Vehicle Request System:** Submit new vehicles for admin approval
- **Earnings Dashboard:** Track earnings with daily, weekly, monthly, and yearly filters
- **Booking Overview:** View all bookings for your vehicles

### For Office Staff
- **Booking Management:** View and process all booking requests
- **Pickup Confirmation:** Verify customer ID, record odometer reading, generate bill
- **Return Processing:** Verify vehicle condition, calculate final cost, process payment
- **Booking Rejection:** Reject bookings with reason notification to customer
- **Refund Management:** Mark refunds as processed for cancelled bookings

### For Administrators
- **Full Dashboard:** Complete overview of system statistics
- **User Management:** View, create, update, and delete users
- **Vendor Management:** Approve/reject vendor registrations, manage vendor accounts
- **Vehicle Approval:** Review and approve/reject vehicle listing requests
- **Package Management:** Create and manage pricing packages
- **Office Staff Management:** Create and manage office staff accounts
- **System Reports:** Access to all bookings, payments, and analytics

### General Features
- **Responsive Design:** Fully responsive interface for desktop, tablet, and mobile
- **Image Uploads:** Efficient image management powered by ImageKit
- **Email Notifications:** Automated emails for booking confirmations, pickups, returns, and cancellations
- **Payment Integration:** Razorpay integration for online payments
- **Real-time Status:** Live booking status updates

---

## 👥 User Roles & Permissions

### Customer (User Role)
| Permission | Access |
|-----------|--------|
| Browse vehicles | ✅ |
| Create bookings | ✅ |
| View own bookings | ✅ |
| Cancel own bookings | ✅ |
| Update profile | ✅ |
| Access dashboards | ❌ |

### Vendor
| Permission | Access |
|-----------|--------|
| Manage own vehicles | ✅ |
| View vehicle bookings | ✅ |
| Track earnings | ✅ |
| Submit vehicle requests | ✅ |
| Process bookings | ❌ |
| Approve vendors | ❌ |

### Office Staff
| Permission | Access |
|-----------|--------|
| View all bookings | ✅ |
| Confirm pickups | ✅ |
| Process returns | ✅ |
| Reject bookings | ✅ |
| Mark refunds | ✅ |
| Manage users/vendors | ❌ |

### Administrator
| Permission | Access |
|-----------|--------|
| All permissions | ✅ |
| User management | ✅ |
| Vendor verification | ✅ |
| Vehicle approval | ✅ |
| Package management | ✅ |
| Staff management | ✅ |

---

## 🔄 Complete System Workflow

### 1. User Registration Flow
```
User enters details → Email OTP sent → User verifies OTP → Account created → User logged in
```

### 2. Vendor Registration Flow
```
Vendor enters details + documents → Email OTP sent → Vendor verifies OTP → 
Pending admin approval → Admin verifies documents → Vendor approved → Vendor can login
```

### 3. Vehicle Listing Flow (Vendor)
```
Vendor submits vehicle request → Admin reviews → Approved/Rejected → 
If approved: Vehicle listed and available for booking
```

### 4. Complete Booking Flow
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  BOOKING LIFECYCLE                                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  1. Customer Browse vehicles                                                │
│                                                                             │
│  2. Select vehicle                                                          │
│     & create booking                                                        │
│                                                                             │
│  3. Booking Status: "booking_requested"                                     │
│     Vehicle Status: "booked"                                                │
│                                                                             │
│  4. Customer arrives  ──►  Staff confirms pickup:                           │
│     at pickup location     - Verify ID (Aadhaar/PAN/Passport/DL)            │
│                            - Record odometer reading                        │
│                            - Verify vehicle plate number                    │
│                            - Generate Bill ID (BILL-YYYYMMDD-XXXXX)         │
│                                                                             │
│  5. Booking Status: "picked_up"                                             │
│     Email: Pickup confirmation sent to customer                             │
│                                                                             │
│  6. Customer uses vehicle                                                   │
│                                                                             │
│  7. Customer returns  ──►  Staff processes return:                          │
│     vehicle                - Record final odometer reading                  │
│                            - Verify engine/chassis numbers                  │
│                            - Assess vehicle condition                       │
│                            - Calculate: Distance × Price/KM                 │
│                                     OR  Hours × Price/Hour                  │
│                            - Add damage costs (if any)                      │
│                            - Final cost = MAX(distance_cost, time_cost)     │
│                                         + damage_cost                       │
│                                                                             │
│  8. Payment processed (Cash/Online)                                         │
│     Booking Status: "returned"                                              │
│     Payment Status: "paid"                                                  │
│     Vehicle Status: "available"                                             │
│     Email: Return confirmation with bill sent to customer                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5. Cancellation Flow
```
┌────────────────────────────────────────────────────────┐
│  CANCELLATION SCENARIOS                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  A. Customer Cancellation:                             │
│     - Must provide cancellation reason                 │
│     - Vehicle status returns to "available"            │
│     - If advance payment made: Refund marked pending   │
│                                                        │
│  B. Staff Rejection:                                   │
│     - Must provide rejection reason                    │
│     - Customer notified via email                      │
│     - Vehicle status returns to "available"            │
│     - If advance payment made: Refund marked pending   │
│                                                        │
│  C. Refund Processing:                                 │
│     - Staff marks refund as "completed"                │
│     - Refund processed within 7-10 business days       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🚀 Technologies Used

### Frontend
| Technology | Purpose |
|-----------|--------|
| React.js | UI Framework |
| Vite | Build Tool |
| React Router DOM | Client-side Routing |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| PostCSS | CSS Processing |
| ESLint | Code Quality |

### Backend
| Technology | Purpose |
|-----------|--------|
| Node.js | Runtime Environment |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Uploads |
| ImageKit | Image Management |
| Nodemailer | Email Service |
| Razorpay | Payment Gateway |

## ⚙️ Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)

### Environment Variables

#### Backend (.env in /server)
```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/yatramate
DATABASE_PASSWORD=your_database_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# ImageKit (for image uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id

# Email (for OTP and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=YatraMate <noreply@yatramate.com>

# Razorpay (for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env in /client)
```env
VITE_API_URL=http://localhost:8000/api/v1
```

### Quick Start

#### Option 1: Run Everything Together
```bash
# Clone the repository
git clone https://github.com/yourusername/YatraMate-VehicleRentalSystem.git
cd YatraMate-VehicleRentalSystem

# Install root dependencies
npm install

# Install all dependencies (client + server)
npm run download

# Create server/.env file with your credentials

# Start both frontend and backend
npm run app
```

#### Option 2: Run Separately

**Backend:**
```bash
cd server
npm install
# Create .env file
npm start      # Production
npm run dev    # Development with nodemon
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000

---

## 📡 API Endpoints

### Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/verify-otp` | Verify email OTP | ❌ |
| POST | `/resend-otp` | Resend OTP | ❌ |
| POST | `/register-vendor` | Register vendor | ❌ |
| POST | `/verify-vendor-otp` | Verify vendor OTP | ❌ |
| POST | `/login` | User/Vendor login | ❌ |
| GET | `/logout` | Logout | ❌ |
| POST | `/forgot-password` | Request password reset | ❌ |
| POST | `/reset-password` | Reset password | ❌ |
| GET | `/me` | Get current user | ✅ |
| PATCH | `/update-password` | Update password | ✅ |
| PATCH | `/update-profile` | Update profile | ✅ |
| POST | `/request-password-change-otp` | Request password change OTP | ✅ |
| POST | `/verify-password-change-otp` | Verify and change password | ✅ |

### Booking Routes (`/api/v1/bookings`)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/request` | Create booking | ✅ | User |
| GET | `/user/:userId` | Get user bookings | ✅ | Any |
| GET | `/office-staff/requests` | Get all requests | ✅ | Staff |
| PATCH | `/:bookingId/pickup` | Confirm pickup | ✅ | Staff |
| PATCH | `/:bookingId/return` | Confirm return | ✅ | Staff |
| PATCH | `/:bookingId/reject` | Reject booking | ✅ | Staff |
| PATCH | `/:bookingId/mark-refund-returned` | Mark refund | ✅ | Staff |
| GET | `/` | Get all bookings | ✅ | Admin |
| GET | `/:id` | Get booking details | ✅ | Any |
| DELETE | `/:id` | Cancel booking | ✅ | User |

### Vehicle Routes (`/api/v1/vehicles`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all vehicles | ❌ |
| GET | `/:id` | Get vehicle by ID | ❌ |
| POST | `/` | Create vehicle | ✅ |
| PATCH | `/:id` | Update vehicle | ✅ |
| DELETE | `/:id` | Delete vehicle | ✅ |

### Vendor Routes (`/api/v1/vendors`)
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/` | Get all vendors | ✅ | Admin |
| GET | `/:id` | Get vendor | ✅ | Any |
| PATCH | `/:id/verify` | Verify vendor | ✅ | Admin |
| GET | `/earnings` | Get vendor earnings | ✅ | Vendor |

### Package Routes (`/api/v1/packages`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all packages | ❌ |
| GET | `/for-vehicle` | Get package for CC | ❌ |
| POST | `/` | Create package | ✅ |
| PATCH | `/:id` | Update package | ✅ |
| DELETE | `/:id` | Delete package | ✅ |

### Upload Routes (`/api/v1/upload`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Upload file | ❌ |

---

## 💰 Pricing Model

### How Pricing Works

1. **Packages are defined by:**
   - Vehicle Type (Car/Bike)
   - Engine CC Range (e.g., 100-150 CC, 1000-1500 CC)
   - Price per Hour
   - Price per Kilometer

2. **Final Cost Calculation:**
   ```
   Distance Cost = (Odometer End - Odometer Start) × Price per KM
   Time Cost = Duration in Hours × Price per Hour
   
   Base Cost = MAX(Distance Cost, Time Cost)
   Final Cost = Base Cost + Damage Cost (if any)
   ```

3. **Example Packages:**
   | Package Name | Type | CC Range | ₹/Hour | ₹/KM |
   |-------------|------|----------|--------|------|
   | Economy Bike | Bike | 100-150 | 30 | 3 |
   | Standard Bike | Bike | 150-250 | 50 | 5 |
   | Premium Bike | Bike | 250-500 | 80 | 8 |
   | Economy Car | Car | 800-1200 | 100 | 10 |
   | Standard Car | Car | 1200-1600 | 150 | 15 |
   | Premium Car | Car | 1600-2500 | 200 | 20 |

---

## 🔐 Security Features

- **JWT Authentication:** Secure token-based authentication with HTTP-only cookies
- **Password Hashing:** bcrypt with 12 salt rounds
- **OTP Verification:** 6-digit OTP with 10-minute expiry for email verification
- **Password Reset:** Secure token-based password reset with expiry
- **Role-Based Access Control:** Middleware restricts access based on user roles
- **Input Validation:** Server-side validation for all inputs
- **CORS Protection:** Configured CORS for allowed origins
- **Secure Cookies:** SameSite and Secure flags in production

---

## 🤝 Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

We would like to express our sincere gratitude to our project guide, Professor Tanmoy Bera Sir, for his invaluable guidance and insightful ideas throughout the development of this MERN stack final year project.

---

## 📞 Support

For support, please:
- Visit our [Help Center](https://yatramate.vercel.app/help)
- Email us at support@yatramate.com
- Check our [FAQ page](https://yatramate.vercel.app/faq)

---

**Made with ❤️ by the YatraMate Team**
