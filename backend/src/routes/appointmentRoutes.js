const router = require('express').Router();
const { authenticate, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/appointmentController');

router.get('/me',     authenticate, ctrl.getMyAppointments);
router.post('/',      authenticate, requireRole('patient'), ctrl.bookAppointment);
router.put('/:id/status', authenticate, requireRole('doctor', 'admin'), ctrl.updateStatus);
router.delete('/:id', authenticate, requireRole('patient'), ctrl.cancelAppointment);

module.exports = router;