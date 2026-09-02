const express = require('express');
const siteSettingsController = require('../controllers/siteSettingsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', siteSettingsController.getSettings);
router.get('/:key', siteSettingsController.getSetting);

router.use(auth.protect, auth.restrictTo('admin'));

router.post('/', siteSettingsController.createSetting);
router.patch('/:key', siteSettingsController.updateSetting);
router.delete('/:key', siteSettingsController.deleteSetting);

module.exports = router;
