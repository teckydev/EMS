const express = require('express');
const { 
    getOrgSettings,
     updateOrgSettings
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();
router.get('/org', protect, authorizeRoles('admin', 'HR'), getOrgSettings);
router.put('/org', protect, authorizeRoles('admin', 'HR'), updateOrgSettings);
module.exports = router;