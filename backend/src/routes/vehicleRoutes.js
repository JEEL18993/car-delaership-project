const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Protect all vehicle routes with JWT authentication
router.use(authenticateToken);

router.get('/search', vehicleController.searchVehicles);
router.get('/', vehicleController.getVehicles);

router.post('/', requireAdmin, vehicleController.createVehicle);
router.put('/:id', requireAdmin, vehicleController.updateVehicle);
router.delete('/:id', requireAdmin, vehicleController.deleteVehicle);

// Inventory purchase & restock routes
router.post('/:id/purchase', vehicleController.purchaseVehicle);
router.post('/:id/restock', requireAdmin, vehicleController.restockVehicle);

module.exports = router;
