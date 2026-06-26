const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const { getSlots, createSlot } = require('../controllers/slotController');

router.get('/:doctorId', getSlots);
router.post('/', authenticate, requireRole('doctor'), createSlot);

module.exports = router;