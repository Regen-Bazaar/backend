const express = require('express');
const router = express.Router();
const { purchaseRWIP } = require('../controllers/rwipController');
const { protect } = require('../middleware/auth');

// All RWIP routes are protected
router.use(protect);

// @route   POST /api/rwip/purchase
// @desc    Record a RWIP (NFT) purchase
// @access  Private
router.post('/purchase', purchaseRWIP);

module.exports = router; 