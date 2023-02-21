import express from "express";

import {
    getSuratKeluar,
    getSuratKeluarById,
    createSuratKeluar,
    updateSuratKeluar,
    deleteSuratKeluar
} from "../controllers/SuratKeluarControllers.js";

const router = express.Router();

router.get('/suratkeluar', getSuratKeluar);
router.get('/suratkeluar/:id', getSuratKeluarById);
router.post('/suratkeluar', createSuratKeluar);
router.patch('/suratkeluar/:id', updateSuratKeluar);
router.delete('/suratkeluar/:id', deleteSuratKeluar);

export default router;