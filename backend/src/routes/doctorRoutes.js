const router = require('express').Router();
const { getAllDoctors, getDoctorById } = require('../controllers/doctorController');

router.get('/',    getAllDoctors);
router.get('/:id', getDoctorById);

module.exports = router;