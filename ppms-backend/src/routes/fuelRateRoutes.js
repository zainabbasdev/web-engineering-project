// routes/fuelRateRoutes.js
import express from 'express';
import { getRates, setRate } from '../controllers/fuelRateController.js';

const router = express.Router();

router.get('/', getRates);
router.post('/', setRate);

export default router;