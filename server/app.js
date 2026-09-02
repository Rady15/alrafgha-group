const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/authRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const stripeRouter = require('./routes/stripeRoutes');
const userRouter = require('./routes/userRoutes');
const vehicleRouter = require('./routes/vehicleRoutes');
const vendorRouter = require('./routes/vendorRoutes');
const packageRouter = require('./routes/packageRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const vehicleRequestRouter = require('./routes/vehicleRequestRoutes');
const offerRouter = require('./routes/offerRoutes');
const couponRouter = require('./routes/couponRoutes');
const blogRouter = require('./routes/blogRoutes');
const loyaltyRouter = require('./routes/loyaltyRoutes');
const siteSettingsRouter = require('./routes/siteSettingsRoutes');

const app = express();

// Trust only one proxy hop (localhost dev / simple reverse proxy)
app.set('trust proxy', 1);

// SECURITY HEADERS — P0-003 FIX
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://js.stripe.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.stripe.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'", "https://js.stripe.com"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// RATE LIMITING — P0-002 FIX
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
        status: 'fail',
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // 1000 requests per 15 minutes for general API
    message: {
        status: 'fail',
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/v1/auth/login', loginLimiter);
app.use('/api/v1/', apiLimiter);

app.use(cors({
    origin: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ["https://alrafgha-group.vercel.app", "http://localhost:5173", "https://alrafgha-group.onrender.com"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    optionsSuccessStatus: 200
}));

// Stripe webhook must receive the RAW body (BEFORE express.json transforms it) so
// signature verification works. Must be mounted before app.use(express.json).
app.use('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }));
app.use('/api/v1/stripe/webhook', (req, res, next) => {
    if (req.body !== undefined && Buffer.isBuffer(req.body)) {
        try {
            JSON.parse(req.body.toString('utf8'));
        } catch {
            return res.status(400).json({ error: 'Malformed webhook payload' });
        }
    }
    next();
});

app.use(express.json({ limit: '10mb' }));
// Normalize req.body so routes never crash with "cannot read property of undefined"
// when a request arrives without a JSON body (e.g. empty DELETE/PATCH).
app.use((req, res, next) => {
    if (req.body === undefined) req.body = {};
    next();
});
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/payments', paymentRouter);
app.use('/api/v1/stripe', stripeRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/vehicles', vehicleRouter);
app.use('/api/v1/vendors', vendorRouter);
app.use('/api/v1/packages', packageRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/vehicle-requests', vehicleRequestRouter);
app.use('/api/v1/offers', offerRouter);
app.use('/api/v1/coupons', couponRouter);
app.use('/api/v1/blog', blogRouter);
app.use('/api/v1/loyalty', loyaltyRouter);
app.use('/api/v1/settings', siteSettingsRouter);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Serve the built React client (single-service deployment)
const clientDist = path.resolve(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));

    // SPA fallback: any non-API GET route returns index.html
    app.get(/^\/(?!api\/).*/, (req, res) => {
        res.sendFile(path.join(clientDist, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.status(200).send('Alrafgha Group server is running successfully! 🎉');
    });
}

app.use(globalErrorHandler);

module.exports = app;
