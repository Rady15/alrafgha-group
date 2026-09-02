const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024       // 10MB limit
    }
});

// Get ImageKit authentication parameters (only if configured)
exports.getAuthParameters = catchAsync(async (req, res, next) => {
    // Check if ImageKit is configured
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (publicKey && privateKey && urlEndpoint && publicKey !== 'placeholder') {
        const ImageKit = require('imagekit');
        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint
        });
        const result = imagekit.getAuthenticationParameters();
        res.status(200).json(result);
    } else {
        // Return placeholder if ImageKit not configured
        res.status(200).json({
            publicKey: publicKey || '',
            privateKey: privateKey || '',
            urlEndpoint: urlEndpoint || ''
        });
    }
});

// Upload file - supports both ImageKit and multer-only mode
exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please upload a file', 400));
    }

    // Check if ImageKit is configured
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (publicKey && privateKey && urlEndpoint && publicKey !== 'placeholder') {
        // ImageKit mode: upload to ImageKit
        const ImageKit = require('imagekit');
        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint
        });

        const folder = req.body.folder || '/uploads';

        const result = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: folder
        });

        res.status(200).json({
            status: 'success',
            data: {
                url: result.url,
                fileId: result.fileId,
                name: result.name
            }
        });
    } else {
        // Multer-only mode: return file as base64 data URL
        const fileBase64 = req.file.buffer.toString('base64');
        const dataUrl = `data:${req.file.mimeType};base64,${fileBase64}`;

        res.status(200).json({
            status: 'success',
            data: {
                url: dataUrl,
                fileId: req.file.filename || Date.now() + '-' + req.file.originalname,
                name: req.file.originalname,
                base64: fileBase64
            }
        });
    }
});

// Upload multiple files - supports both ImageKit and multer-only mode
exports.uploadMultipleFiles = catchAsync(async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('Please upload at least one file', 400));
    }

    // Check if ImageKit is configured
    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    if (publicKey && privateKey && urlEndpoint && publicKey !== 'placeholder') {
        // ImageKit mode
        const ImageKit = require('imagekit');
        const imagekit = new ImageKit({
            publicKey,
            privateKey,
            urlEndpoint
        });

        const uploadPromises = req.files.map(file => 
            imagekit.upload({
                file: file.buffer,
                fileName: file.originalname,
                folder: '/vehicle-documents'
            })
        );

        const results = await Promise.all(uploadPromises);

        res.status(200).json({
            status: 'success',
            data: {
                files: results.map(result => ({
                    url: result.url,
                    fileId: result.fileId,
                    name: result.name
                }))
            }
        });
    } else {
        // Multer-only mode: return all files as base64 data URLs
        const files = req.files.map(file => {
            const fileBase64 = file.buffer.toString('base64');
            return {
                url: `data:${file.mimeType};base64,${fileBase64}`,
                fileId: Date.now() + '-' + file.originalname,
                name: file.originalname,
                base64: fileBase64
            };
        });

        res.status(200).json({
            status: 'success',
            data: {
                files: files
            }
        });
    }
});

// Export multer upload middleware
exports.multerUpload = upload;