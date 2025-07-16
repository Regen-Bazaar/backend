const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getSellerProjects,
  getSellerSoldProjects,
  getSellerActivity
} = require('../controllers/sellerController');


router.use(protect);
router.use(authorize('user'));


router.get('/projects', getSellerProjects);

router.get('/sold-projects', getSellerSoldProjects);

router.get('/activity', getSellerActivity);

module.exports = router;
