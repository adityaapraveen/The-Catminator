const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createScan, getScans, getScan, updateScan, deleteScan } = require('../controllers/scanController');

// Protect all scan routes
router.use(protect);

// Scan routes
router.post('/', createScan);
router.get('/', getScans);
router.get('/:id', getScan);
router.put('/:id', updateScan);
router.delete('/:id', deleteScan);

module.exports = router; 